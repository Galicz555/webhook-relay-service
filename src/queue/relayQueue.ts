import Queue from 'bull'
import { config } from '../config'
import logger from '../utils/logger'
import { ReqError } from '../types/error'

export const relayQueue = new Queue('relayQueue', {
  redis: {
    host: config.redisHost || '127.0.0.1',
    port: config.redisPort || 6379,
  },
})

export const addJobToRelayQueue = (data: any) => {
  relayQueue.add(data, {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  })
}

relayQueue.on('error', (error) => {
  logger.error(`RelayQueue encountered an error: ${(error as ReqError).status}`)
})

relayQueue.on('failed', (job, error) => {
  logger.error(
    `Job ${job.id} failed with error: ${(error as ReqError).status}. Attempt ${job.attemptsMade} of ${job.opts.attempts}`
  )
})

relayQueue.on('stalled', (job) => {
  logger.warn(
    `Job ${job.id} stalled. Attempt ${job.attemptsMade} of ${job.opts.attempts}`
  )
})
