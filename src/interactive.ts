/**
 * Equals true when `process.stdout` is a TTY.
 *
 * When false, the `clear` and `spin` functions do nothing,
 * and `MistyTask` methods are restricted to append-only logs.
 */
export const isInteractive = Boolean(
  process.stdout &&
    process.stdout.isTTY &&
    process.env.TERM !== 'dumb' &&
    !('CI' in process.env)
)
