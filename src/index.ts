import checkInteractivity from 'is-interactive'
import k from 'kleur'

/**
 * Equals true when `process.stdout` is a TTY.
 *
 * When false, the `clear` and `spin` functions do nothing,
 * and `MistyTask` methods are restricted to append-only logs.
 */
export const isInteractive = checkInteractivity()

/** Write to the current line */
export const print = process.stdout.write.bind(process.stdout)

/**
 * Log a yellow message prefixed by `[!]`
 */
export function warn(msg: string) {
  console.warn(k.yellow('[!] ' + msg))
}

/**
 * Log an error message and call `process.exit(1)`
 */
export function fatal(msg: string): never {
  console.error(k.red('[!]'), msg)
  process.exit(1)
}

/**
 * Log a message prefixed by a green ✔︎
 */
export function success(msg: string) {
  console.log(k.green('✔︎'), msg)
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
