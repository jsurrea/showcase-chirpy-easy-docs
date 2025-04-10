import * as path from 'path'
import * as fs from 'fs'
import * as io from '@actions/io'
import {
  validateDocsDirectory,
  copyDocumentationFiles
} from '../../src/utils/fs'

// ESM-compatible __dirname
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fixtureRoot = path.resolve(__dirname, '../../__fixtures__/fs/docs-valid')
const noIndexDir = path.resolve(
  __dirname,
  '../../__fixtures__/fs/docs-no-index'
)
const emptyDocs = path.resolve(__dirname, '../../__fixtures__/fs/docs-empty')
const tempThemeDir = path.resolve(__dirname, '../../__fixtures__/fs/temp-theme')

beforeEach(async () => {
  await io.rmRF(tempThemeDir)
  await io.mkdirP(tempThemeDir)
})

afterAll(async () => {
  await io.rmRF(tempThemeDir)
})

describe('validateDocsDirectory', () => {
  it('should throw if directory does not exist', () => {
    const invalidPath = path.join(fixtureRoot, 'non-existent')
    expect(() => validateDocsDirectory(invalidPath)).toThrow()
  })

  it('should pass if directory exists', () => {
    expect(() => validateDocsDirectory(fixtureRoot)).not.toThrow()
  })
})

describe('copyDocumentationFiles', () => {
  it('copies index.md and .md files correctly', async () => {
    await copyDocumentationFiles(fixtureRoot, tempThemeDir)

    const indexTarget = path.join(tempThemeDir, 'index.md')
    const configTarget = path.join(tempThemeDir, '_config.yml')
    const tabsTarget = path.join(tempThemeDir, '_tabs')

    expect(fs.existsSync(indexTarget)).toBe(true)
    expect(fs.existsSync(configTarget)).toBe(true)
    expect(fs.readdirSync(tabsTarget).length).toBe(2)
  })

  it('warns when index.md is missing', async () => {
    await copyDocumentationFiles(noIndexDir, tempThemeDir)

    const indexTarget = path.join(tempThemeDir, 'index.md')
    const configTarget = path.join(tempThemeDir, '_config.yml')
    const tabsTarget = path.join(tempThemeDir, '_tabs')

    expect(fs.existsSync(indexTarget)).toBe(false)
    expect(fs.existsSync(configTarget)).toBe(true)
    expect(fs.readdirSync(tabsTarget).length).toBe(2)
  })

  it('warns when no markdown files are found', async () => {
    await copyDocumentationFiles(emptyDocs, tempThemeDir)

    const tabsTarget = path.join(tempThemeDir, '_tabs')

    // Expect the directory to exist
    expect(fs.existsSync(tabsTarget)).toBe(true)

    // But to be empty
    const contents = fs.readdirSync(tabsTarget)
    expect(contents).toHaveLength(0)
  })
})
