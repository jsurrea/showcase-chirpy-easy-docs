import * as exec from '@actions/exec';
import * as io from '@actions/io';
import { logInfo } from '../logger.js';

/**
 * Clone a git repository into a target directory.
 * @param repo Repository name (e.g., "owner/repo")
 * @param targetDir Absolute path to clone the repo into
 * @param ref Optional: tag, branch or commit to checkout
 */
export async function cloneRepo(repo: string, targetDir: string, ref?: string): Promise<void> {
  const repoUrl = `https://github.com/${repo}.git`;

  await io.mkdirP(targetDir);

  const args = ['clone', repoUrl, targetDir, '--single-branch', '--depth', '1'];
  if (ref) {
    args.push('--branch', ref);
  }

  await exec.exec('git', args);

  if (ref) {
    await exec.exec('git', ['checkout', ref], { cwd: targetDir });
  }

  logInfo(`Repository ${repo} cloned to ${targetDir}`);
}
