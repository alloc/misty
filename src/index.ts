import { green, red, yellow } from 'kleur/colors'
import { callerPath, emit } from 'shared-log'
import { isInteractive } from './interactive'

export { isInteractive }

/** Write to the current line */
export const print = process.stdout.write.bind(process.stdout)

/**
 * Log a yellow message prefixed by `[!]`
 */
export function warn(msg: string) {
  emit('warn', [yellow('[!] ' + msg)], callerPath())
}

const pastWarnings = new Set<string>()

/** Print a warning at most once */
export function warnOnce(msg: string) {
  if (!pastWarnings.has(msg)) {
    pastWarnings.add(msg)
    warn(msg)
  }
}

/**
 * Log an error message and call `process.exit(1)`
 */
export function fatal(...args: any[]): never {
  emit('error', [red('[!]'), ...args], callerPath())
  process.exit(1)
}

/**
 * Log a message prefixed by a green ✔︎
 */
export function success(...args: any[]) {
  emit('info', [green('✔︎'), ...args], callerPath())
}

/** Clear the screen and its history */
export function clear(): void
/** Clear a number of lines above the cursor */
export function clear(lines: number): void
/** @internal */
export function clear(lines?: number) {
  if (!isInteractive) return
  if (lines == null) {
    print('\x1B[2J\x1B[3J\x1B[H\x1Bc')
  } else {
    print('\x1B[2K') // clear line
    print('\x1B[1000D') // move to beginning of line
    while (0 < lines--) {
      print('\x1B[1A') // move up one line
      print('\x1B[2K') // clear line
    }
  }
}

/** Format an elapsed time (in milliseconds) to a human-readable string */
export function formatElapsed(start: number) {
  const elapsedMs = Date.now() - start
  return elapsedMs < 200
    ? elapsedMs + 'ms'
    : (elapsedMs / 1000).toFixed(1) + 's'
}
