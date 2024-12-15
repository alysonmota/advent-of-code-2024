import { readFileSync } from 'node:fs'

export const LINE_FEED = String.fromCharCode(0x0a)
export const SPACE = String.fromCharCode(0x20)
export const ONE = Number(true)

export function readEntry(entry_path: string): string {
	const entry_content = String(readFileSync(entry_path)).trim()
	return entry_content
}
