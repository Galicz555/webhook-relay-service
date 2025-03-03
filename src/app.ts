import express, { Application } from 'express'
import webhookRouter from './routes/webhook'
import internalRouter from './routes/internal'

const app: Application = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/webhook', webhookRouter)
app.use('/internal', internalRouter)

export default app
