import { Request, Response } from 'express'
import logger from '../utils/logger'
import { ReqError } from '../types/error'

export class WebhookController {
  public webhook = async (req: Request, res: Response): Promise<Response> => {
    try {
      const webhookData = req.body
      console.log(
        '🚀 ~ WebhookController ~ webhook= ~ webhookData:',
        webhookData
      )

      // Forward the webhook data to the internal service

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
