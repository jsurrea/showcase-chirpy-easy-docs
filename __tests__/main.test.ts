import { jest } from '@jest/globals'

jest.unstable_mockModule('@actions/core', () => ({
  getInput: jest.fn(),
  setFailed: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn()
}))

jest.unstable_mockModule('../src/utils/git', () => ({
  cloneRepo: jest.fn()
}))

jest.unstable_mockModule('../src/utils/fs', () => ({
  validateDocsDirectory: jest.fn(),
  copyDocumentationFiles: jest.fn()
}))

jest.unstable_mockModule('../src/utils/jekyll', () => ({
  prepareThemeDirectory: jest.fn()
}))

describe('run()', () => {
  let run: () => Promise<void>
  let core: typeof import('@actions/core')
  let gitUtils: typeof import('../src/utils/git')
  let fsUtils: typeof import('../src/utils/fs')
  let jekyllUtils: typeof import('../src/utils/jekyll')

  beforeEach(async () => {
    jest.resetModules()

    process.env.GITHUB_REPOSITORY = 'my-org/repo-x'
    process.env.GITHUB_WORKSPACE = '/tmp/workspace'

    await jest.isolateModulesAsync(async () => {
      core = await import('@actions/core')
      gitUtils = await import('../src/utils/git')
      fsUtils = await import('../src/utils/fs')
      jekyllUtils = await import('../src/utils/jekyll')
      ;({ run } = await import('../src/main'))
    })
  })

  it('runs the full flow successfully', async () => {
    ;(core.getInput as jest.Mock).mockReturnValue('docs')

    await run()

    expect(gitUtils.cloneRepo).toHaveBeenCalledWith(
      'my-org/repo-x',
      expect.stringContaining('/repo-x')
    )
    expect(gitUtils.cloneRepo).toHaveBeenCalledWith(
      'jsurrea/showcase-chirpy-theme',
      expect.stringContaining('/theme'),
      'v1.0.0'
    )
    expect(fsUtils.validateDocsDirectory).toHaveBeenCalled()
    expect(fsUtils.copyDocumentationFiles).toHaveBeenCalled()
    expect(jekyllUtils.prepareThemeDirectory).toHaveBeenCalled()
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  it('fails if docs-dir input is missing and directory does not exist', async () => {
    ;(core.getInput as jest.Mock).mockReturnValue('')
    ;(fsUtils.validateDocsDirectory as jest.Mock).mockImplementation(() => {
      throw new Error('Directory does not exist')
    })

    await run()

    expect(core.setFailed).toHaveBeenCalledWith('Directory does not exist')
  })

  it('uses default docs-dir if input is empty', async () => {
    ;(core.getInput as jest.Mock).mockReturnValue('')

    await run()

    expect(fsUtils.validateDocsDirectory).toHaveBeenCalledWith(
      '/tmp/workspace/repo-x/docs'
    )
  })
})
