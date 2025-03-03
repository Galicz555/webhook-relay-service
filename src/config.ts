export const config = {
  internalUrl: process.env.INTERNAL_URL || 'http://localhost:3000/internal/',
  maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
  timeout: parseInt(process.env.TIMEOUT || '60000', 10),
}
