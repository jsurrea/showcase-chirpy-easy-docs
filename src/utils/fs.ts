import * as fs from 'fs'
import * as path from 'path'
import * as io from '@actions/io'
import * as glob from '@actions/glob'
import { logInfo, logWarning } from '../logger.js'
import {
  CONFIG_FILE_NAME,
  INDEX_FILE_NAME,
  TABS_DIR_NAME
} from '../constants.js'

/**
 * Validate that the documentation directory exists.
 * Throws an error if not found.
 */
export function validateDocsDirectory(docsPath: string): void {
  if (!fs.existsSync(docsPath) || !fs.statSync(docsPath).isDirectory()) {
    throw new Error(`Documentation directory "${docsPath}" does not exist.`)
  }
}

/**
 * Copy and prepare documentation files from repo-X into the Jekyll theme.
 */
export async function copyDocumentationFiles(
  docsDir: string,
  themeDir: string
): Promise<void> {
  const indexSrc = path.join(docsDir, INDEX_FILE_NAME)
  const configSrc = path.join(docsDir, CONFIG_FILE_NAME)
  const tabsDest = path.join(themeDir, TABS_DIR_NAME)

  // Copy index.md if it exists
  if (fs.existsSync(indexSrc)) {
    await io.cp(indexSrc, path.join(themeDir, INDEX_FILE_NAME))
    logInfo('index.md copied to theme root.')
  } else {
    logWarning(
      'index.md not found in docs directory. Using default index from theme.'
    )
  }

  // Validate and copy _config.yml
  if (!fs.existsSync(configSrc)) {
    throw new Error('_config.yml not found in docs directory.')
  }
  await io.cp(configSrc, path.join(themeDir, CONFIG_FILE_NAME))
  logInfo('_config.yml copied to theme root.')

  // Clear _tabs directory
  await io.rmRF(tabsDest)
  await io.mkdirP(tabsDest)

  // Copy *.md files except index.md
  const pattern = path.join(docsDir, '*.md')
  const globber = await glob.create(pattern)
  const files = (await globber.glob()).filter(
    (f) => !f.endsWith(INDEX_FILE_NAME)
  )

  if (files.length === 0) {
    logWarning('No additional markdown files found in docs directory.')
    return
  }

  for (const file of files) {
    const fileName = path.basename(file)
    await io.cp(file, path.join(tabsDest, fileName))
  }

  logInfo(`Copied ${files.length} markdown file(s) to _tabs.`)
}
