export const config = {
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  serverHost: process.env.SERVER_HOST || 'server',
  serverPort: process.env.SERVER_PORT || 3000,
}
