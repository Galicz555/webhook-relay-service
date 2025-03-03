import axios from 'axios'
import logger from '../utils/logger'
import { config } from '../config'
import { WebhookData } from '../types/webhookData'

export class RelayService {
  public async forwardToInternalService(data: WebhookData): Promise<void> {
    try {
      const response = await axios.post(
        `http://${config.serverHost}:${config.serverPort}/internal/`,
        data
      )

      logger.info(`Internal service response: ${response.status}`)
    } catch (error) {
      logger.error('Error calling internal service:', error)
      throw error
    }
  }
}
