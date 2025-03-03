import axios from 'axios'
import { RelayService } from '../../src/services/relayService'
import { config } from '../../src/config'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('RelayService', () => {
  const relayService = new RelayService()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call internal service with correct data', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 200, data: {} })

    await relayService.forwardToInternalService({
      username: 'test',
      password: '123',
    })

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `http://${config.serverHost}:${config.serverPort}/internal/`,
      { username: 'test', password: '123' }
    )
  })

  it('should throw an error if internal service call fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

    await expect(
      relayService.forwardToInternalService({
        username: 'test',
        password: '123',
      })
    ).rejects.toThrow('Network error')
  })
})
