import { Router } from 'express'

import { InternalController } from '../controllers/internal'
import logger from '../utils/logger'

const internalController = new InternalController()

const router = Router()

router.post('/', (req, res) => {
  logger.info('Received request to /internal')
  internalController.mockResponses(req, res)
})

export default router
