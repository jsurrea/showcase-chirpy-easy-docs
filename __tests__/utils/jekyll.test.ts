import { jest } from '@jest/globals'
import type { ExecOptions } from '@actions/exec'

jest.unstable_mockModule('@actions/exec', () => ({
  exec: jest.fn()
}))

describe('prepareThemeDirectory', () => {
  let prepareThemeDirectory: (themeDir: string) => Promise<void>
  let exec: jest.MockedFunction<
    (
      commandLine: string,
      args?: string[],
      options?: ExecOptions
    ) => Promise<number>
  >

  const themeDir = '/fake/theme/path'

  beforeEach(async () => {
    jest.resetModules()

    await jest.isolateModulesAsync(async () => {
      const execModule = await import('@actions/exec')
      exec = execModule.exec as typeof exec
      ;({ prepareThemeDirectory } = await import('../../src/utils/jekyll'))
    })

    exec.mockClear()
  })

  it('runs npm install, npm run build, and jekyll build', async () => {
    await prepareThemeDirectory(themeDir)

    expect(exec).toHaveBeenCalledWith('npm', ['install'], { cwd: themeDir })
    expect(exec).toHaveBeenCalledWith('npm', ['run', 'build'], {
      cwd: themeDir
    })
    expect(exec).toHaveBeenCalledWith('bundle', ['install'], {
      cwd: themeDir
    })
    expect(exec).toHaveBeenCalledWith(
      'bundle',
      ['exec', 'jekyll', 'build', '-d', '_site'],
      { cwd: themeDir }
    )
  })
})
