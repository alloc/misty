if (!globalThis.__misty) {
  globalThis.__misty = __dirname
}

const _task = require(globalThis.__misty + '/dist/task.js')
exports.startTask = _task.startTask
