import { jest } from '@jest/globals'
import type { ExecOptions } from '@actions/exec'

jest.unstable_mockModule('@actions/exec', () => ({
  exec: jest.fn()
}))

describe('cloneRepo', () => {
  let cloneRepo: (repo: string, target: string, ref?: string) => Promise<void>
  let exec: jest.MockedFunction<
    (
      commandLine: string,
      args?: string[],
      options?: ExecOptions
    ) => Promise<number>
  >

  const targetDir = '/tmp/test-repo'

  beforeEach(async () => {
    jest.resetModules()

    await jest.isolateModulesAsync(async () => {
      const execModule = await import('@actions/exec')
      exec = execModule.exec as typeof exec
      ;({ cloneRepo } = await import('../../src/utils/git'))
    })

    exec.mockClear()
  })

  it('calls git clone with correct arguments', async () => {
    await cloneRepo('jsurrea/showcase-chirpy-theme', targetDir, 'v1.0.0')

    expect(exec).toHaveBeenNthCalledWith(1, 'git', [
      'clone',
      'https://github.com/jsurrea/showcase-chirpy-theme.git',
      '/tmp/test-repo',
      '--single-branch',
      '--depth',
      '1',
      '--branch',
      'v1.0.0'
    ])
    expect(exec).toHaveBeenNthCalledWith(2, 'git', ['checkout', 'v1.0.0'], {
      cwd: '/tmp/test-repo'
    })
  })
})
