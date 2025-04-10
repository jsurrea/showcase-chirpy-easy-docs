import * as exec from '@actions/exec'
import { logInfo } from '../logger.js'

/**
 * Run npm and jekyll build commands in the theme directory.
 */
export async function prepareThemeDirectory(themeDir: string): Promise<void> {
  await exec.exec('npm', ['install'], { cwd: themeDir })
  await exec.exec('npm', ['run', 'build'], { cwd: themeDir })

  // Install Ruby gems
  await exec.exec('bundle', ['install'], { cwd: themeDir })

  await exec.exec('bundle', ['exec', 'jekyll', 'build', '-d', '_site'], { cwd: themeDir });

  logInfo('Jekyll site built successfully.')
}
