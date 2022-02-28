if (!globalThis.__misty) {
  globalThis.__misty = __dirname
}

const _spin = require(globalThis.__misty + '/dist/spin.js')
exports.getSpinner = _spin.getSpinner
exports.setSpinner = _spin.setSpinner
exports.spin = _spin.spin
