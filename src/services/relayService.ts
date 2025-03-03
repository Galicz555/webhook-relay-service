import axios from 'axios'
import { ReqError } from '../types/error'
import logger from '../utils/logger'
import { config } from '../config'
import { WebhookData } from '../types/webhookData'

export class RelayService {
  public async forwardToInternalService(data: WebhookData): Promise<void> {
    const { internalUrl, maxRetries, timeout } = config

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post(internalUrl, data, {
          timeout: timeout,
        })

        logger.info(`Internal service response: ${response.status}`)

        return
      } catch (error) {
        logger.error(
          `Error calling internal service on attempt ${attempt + 1}: ${
            (error as ReqError)?.status
          }`
        )

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000
          logger.info(`Retrying in ${delay} ms...`)
          await new Promise((res) => setTimeout(res, delay))
        } else {
          throw error
        }
      }
    }
  }
}
