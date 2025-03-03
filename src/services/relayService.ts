import { ReqError } from '../types/error'
import logger from '../utils/logger'

export class RelayService {
  public async forwardToInternalService(data: any): Promise<void> {
    const maxRetries = 3

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        // Send the data to the internal service

        return
      } catch (error) {
        logger.error(
          `Error calling internal service on attempt ${attempt + 1}:`,
          (error as ReqError)?.status,
          (error as ReqError)?.message
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
