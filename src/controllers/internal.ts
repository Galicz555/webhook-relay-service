import { Request, Response } from 'express'
import logger from '../utils/logger'

export class InternalController {
  public mockResponses = async (req: Request, res: Response) => {
    const randomErrorRate = Math.random()
    if (randomErrorRate < 0.3) {
      const errorCodes = [400, 500, 502, 503]
      const chosenError =
        errorCodes[Math.floor(Math.random() * errorCodes.length)]

      logger.error(`Mock internal: returning error code ${chosenError}`)
      return res.status(chosenError).json({ error: 'Random error occurred' })
    }

    const randomDelayRate = Math.random()
    if (randomDelayRate < 0.3) {
      const delayMs = Math.floor(Math.random() * 30000)
      logger.info(`Mock internal: delaying response by ${delayMs} ms`)

      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }

    logger.info('Mock internal: success response')
    return res.status(200).json({
      message: 'Mock internal service response',
      requestBody: req.body,
    })
  }
}
