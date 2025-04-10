import { jest } from '@jest/globals'

jest.unstable_mockModule('@actions/core', () => ({
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn()
}))

describe('logger functions', () => {
  let core: typeof import('@actions/core')
  let logger: typeof import('../src/logger')

  beforeEach(async () => {
    jest.resetModules()

    await jest.isolateModulesAsync(async () => {
      core = await import('@actions/core')
      logger = await import('../src/logger')
    })
  })

  it('calls logInfo with formatted message', () => {
    logger.logInfo('hello')
    expect(core.info).toHaveBeenCalledWith('[INFO] hello')
  })
})
