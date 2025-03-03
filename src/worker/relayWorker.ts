import { relayQueue } from '../queue/relayQueue'
import { RelayService } from '../services/relayService'
import logger from '../utils/logger'

const relayService = new RelayService()

relayQueue.process(5, async (job) => {
  const payload = job.data

  try {
    await relayService.forwardToInternalService(payload)
    logger.info(`Job ${job.id} processed successfully`)
  } catch (error) {
    logger.error(`Job ${job.id} failed:`, error)
    throw error
  }
})
