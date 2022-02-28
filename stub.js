// This module is a stub implementation that lets xplat packages
// use "misty/task" without breaking non-Node.js usage.

/** @type {(...args: any[]) => any} */
const noop = () => {}

/** @returns {import('./src/task').MistyTask} */
const startTask = () => ({
  height: 0,
  render: noop,
  update: noop,
  finish(msg) {
    if (msg != null) {
      console.log(msg)
    }
  },
})

exports.startTask = startTask
exports.getSpinner = noop
exports.setSpinner = noop
exports.spin = noop
