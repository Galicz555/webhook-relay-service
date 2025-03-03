# Test Plan for Queue-Based Webhook System

This document outlines the testing approach for a Node.js application that processes incoming webhook requests by enqueuing them in Redis via Bull, and subsequently having a worker consume jobs to call an internal mock service.

---

## 1. Unit Testing

### 1.1 **Controllers & Services**

- **Webhook Controller**

  - **Happy Path**:
    - Send a valid `POST /webhook` request with a proper JSON body.
    - Mock the Bull queue’s `add` method.
    - Verify that the webhook controller enqueues the data and returns a `202 Accepted` (or `200 OK`).
  - **Invalid Request**:
    - Test sending malformed JSON.
    - Expect a `400 Bad Request` or an appropriate error response.

- **Relay Service**
  - **Success Case**:
    - Mock `axios.post(...)` to return a `200` status.
    - Verify that the method resolves without throwing an error.
  - **Failure & Retry**:
    - Mock `axios.post(...)` to throw (e.g., `500` or timeout).
    - Check that the retry logic (Bull’s built-in attempts) is triggered or the error is properly propagated.

### 1.2 **Queue-Related Logic**

- **Queue Initialization**:
  - Confirm that the queue is created with the correct name and default options (e.g., `attempts: 5`, exponential backoff).
  - Ensure that queue-level errors are logged as expected.
- **Job Processing**:
  - Mock the worker’s process function to ensure it handles job data correctly (accepts the payload, calls the service, etc.).
  - Validate that an error in job processing is logged and triggers a retry or fails the job.

---

## 2. Integration Testing

### 2.1 **Server + Queue (Without Worker)**

1. Run a real (or test) Redis instance.
2. Spin up the server in a test environment.
3. **POST** a sample JSON body to `POST /webhook`.
4. Check that:
   - A new job is created in the Bull queue.
   - The job data matches the request body.
   - The server responds with `202` or `200`.

### 2.2 **Worker + Redis + Mock Internal**

1. Start the **worker** in tandem with Redis and a mock internal endpoint.
2. Manually enqueue a job into the queue (or trigger via `/webhook`).
3. Verify:
   - The worker receives the job from the queue.
   - It calls the mock internal endpoint, which might introduce random delays or return error codes (400/500/502/503).
   - If the call succeeds, the job completes. If it fails, the job is retried (up to the configured limit) or ultimately fails.

---

## 3. End-to-End (E2E) Testing

1. **Full Stack Setup**:
   - Use `docker-compose` or a similar approach to run **server**, **worker**, and **Redis**.
2. **Send a Webhook**:
   - `curl -X POST http://localhost:3000/webhook -d '{"key":"value"}'`
   - Expect a quick response (`202 Accepted`).
3. **Worker Behavior**:
   - Monitor logs to confirm the worker picked up the job and forwarded to the mock internal service.
4. **Error Simulation**:
   - If the mock internal randomly fails, confirm that the job is retried (Bull attempts) or eventually marked as failed.
5. **Success Path**:
   - If the mock internal returns 200, the job should complete successfully, and logs should reflect this outcome.

---

## 4. Performance & Load Testing

### 4.1 **Load Testing**

- **Normal/High RPS**:
  - Send ~1000 RPS to `POST /webhook` for a few minutes.
  - **Metrics** to track:
    - HTTP response codes from the server.
    - Queue depth in Redis (should not skyrocket if worker is keeping up).
    - Worker throughput (jobs processed per second).
    - Error rate (if mock internal returns many errors).

### 4.2 **Soak Testing**

- **Long Duration (hours)**:
  - Maintain a moderate, consistent load and watch for:
    - Memory leaks in the server or worker.
    - Growth of queue depth over time.
    - CPU usage or unexpected failures.

### 4.3 **Stress & Spike Testing**

- **Spike**:
  - Jump from near-zero to 2–3× normal load.
  - Observe how quickly the queue grows and how the worker recovers once the spike subsides.

---

## 5. Error & Chaos Testing

### 5.1 **Network or Redis Failures**

- Temporarily **stop the Redis container** or block its port.
- Ensure that when the server tries to enqueue jobs, it handles connection errors gracefully.
- Restart Redis and check if the queue resumes smoothly.

### 5.2 **Worker Crashes**

- **Kill** the worker container/process while it is processing jobs.
- Confirm that any unprocessed jobs remain in the queue, and a new worker process can pick them up after restart.

---

## 6. Observability & Logging

- **Logging**:
  - Ensure each major action (enqueue, job start, job success, job fail) is logged.
  - Verify error messages and stack traces are captured.
- **Monitoring**:
  - If using Prometheus, Grafana, or a third-party APM, track:
    - Queue metrics (active jobs, failed jobs, completed jobs).
    - Request rates and latencies for `/webhook`.
    - Worker CPU/memory usage.

---

## 7. Summary

This test plan ensures coverage across **functional correctness**, **integration between components** (server, worker, Redis, mock service), and **performance characteristics** (handling high throughput, random delays, and errors). By systematically running these tests, you can validate the reliability and resilience of the queue-based architecture.
