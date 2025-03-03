import express, { Application } from 'express'
import webhookRouter from './routes/webhook'

const app: Application = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/webhook', webhookRouter)

export default app
