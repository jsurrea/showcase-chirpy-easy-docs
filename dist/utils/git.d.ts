/**
 * Clone a git repository into a target directory.
 * @param repo Repository name (e.g., "owner/repo")
 * @param targetDir Absolute path to clone the repo into
 * @param ref Optional: tag, branch or commit to checkout
 */
export declare function cloneRepo(repo: string, targetDir: string, ref?: string): Promise<void>;
