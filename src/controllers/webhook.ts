import { Request, Response } from 'express'
import { RelayService } from '../services/relayService'
import logger from '../utils/logger'
import { ReqError } from '../types/error'

export class WebhookController {
  private relayService: RelayService

  constructor(relayService: RelayService) {
    this.relayService = relayService
  }

  public webhook = async (req: Request, res: Response): Promise<Response> => {
    try {
      await this.relayService.forwardToInternalService(req.body)

      return res.status(200).json({
        message: 'Webhook received and forwarded successfully',
      })
    } catch (error) {
      logger.error('Error forwarding webhook:', (error as ReqError)?.status)
      return res.status(500).json({
        message: 'Failed to process webhook',
      })
    }
  }
}
