/**
 * Validate that the documentation directory exists.
 * Throws an error if not found.
 */
export declare function validateDocsDirectory(docsPath: string): void;
/**
 * Copy and prepare documentation files from repo-X into the Jekyll theme.
 */
export declare function copyDocumentationFiles(docsDir: string, themeDir: string): Promise<void>;
