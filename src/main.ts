import * as core from '@actions/core'
import * as path from 'path'

import { DOCS_DIR_INPUT_NAME, DEFAULT_DOCS_DIR } from './constants.js'
import { cloneRepo } from './utils/git.js'
import { prepareThemeDirectory } from './utils/jekyll.js'
import { validateDocsDirectory, copyDocumentationFiles } from './utils/fs.js'
import { logInfo, logError } from './logger.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const docsDir = core.getInput(DOCS_DIR_INPUT_NAME) || DEFAULT_DOCS_DIR

    const workspace = process.env.GITHUB_WORKSPACE || '/github/workspace'
    const repoXPath = path.resolve(workspace, 'repo-x')
    const themePath = path.resolve(workspace, 'theme')

    logInfo(`Cloning source repository into ${repoXPath}...`)
    await cloneRepo(process.env.GITHUB_REPOSITORY as string, repoXPath)

    logInfo(`Cloning theme repository into ${themePath}...`)
    await cloneRepo('jsurrea/showcase-chirpy-theme', themePath, 'v1.0.0')

    const fullDocsPath = path.join(repoXPath, docsDir)
    validateDocsDirectory(fullDocsPath)

    await copyDocumentationFiles(fullDocsPath, themePath)

    logInfo('Preparing Jekyll site...')
    await prepareThemeDirectory(themePath)

    // The Jekyll build/deploy steps will happen after this in the workflow
  } catch (error) {
    logError((error as Error).message)
    core.setFailed((error as Error).message)
  }
}
