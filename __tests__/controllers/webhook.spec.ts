import { Request, Response } from 'express'
import { WebhookController } from '../../src/controllers/webhook'
import { RelayService } from '../../src/services/relayService'
import { addJobToRelayQueue } from '../../src/queue/relayQueue'

jest.mock('../../src/queue/relayQueue', () => ({
  addJobToRelayQueue: jest.fn(),
}))

function createMockResponse() {
  const res = {} as Response
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('WebhookController', () => {
  let webhookController: WebhookController

  beforeAll(() => {
    const relayService = new RelayService()
    webhookController = new WebhookController(relayService)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call addJobToRelayQueue and return 200 on success', async () => {
    const req = { body: { foo: 'bar' } } as Request
    const res = createMockResponse()

    ;(addJobToRelayQueue as jest.Mock).mockImplementation(() => {})

    await webhookController.webhook(req, res)

    expect(addJobToRelayQueue).toHaveBeenCalledTimes(1)
    expect(addJobToRelayQueue).toHaveBeenCalledWith({ foo: 'bar' })
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Webhook received and forwarded successfully',
    })
  })

  it('should return 500 if addJobToRelayQueue throws an error', async () => {
    const req = { body: { foo: 'bar' } } as Request
    const res = createMockResponse()

    ;(addJobToRelayQueue as jest.Mock).mockImplementation(() => {
      throw new Error('Queue failure')
    })

    await webhookController.webhook(req, res)

    expect(addJobToRelayQueue).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to process webhook',
    })
  })
})
