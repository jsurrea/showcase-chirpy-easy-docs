import * as core from '@actions/core'

export function logInfo(message: string): void {
  core.info(`[INFO] ${message}`)
}

export function logWarning(message: string): void {
  core.warning(`[WARN] ${message}`)
}

export function logError(message: string): void {
  core.error(`[ERROR] ${message}`)
}
