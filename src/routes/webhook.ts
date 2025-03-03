import { Router } from 'express'
import { WebhookController } from '../controllers/webhook'
import { RelayService } from '../services/relayService'

const relayService = new RelayService()
const webhookController = new WebhookController(relayService)

const router = Router()

router.post('/', webhookController.webhook)

export default router
