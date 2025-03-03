import { Router } from 'express'
import { WebhookController } from '../controllers/webhook'

const webhookController = new WebhookController()

const router = Router()

router.post('/', webhookController.webhook)

export default router
