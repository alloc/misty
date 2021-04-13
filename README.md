# misty <img src="https://raw.githubusercontent.com/alloc/misty/master/misty.png" height="40"/>

[![npm](https://img.shields.io/npm/v/misty.svg)](https://www.npmjs.com/package/misty)
[![Code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://paypal.me/alecdotbiz)

> Logging utils for command line

&nbsp;

## Example

Clone `misty` and run the `test.js` script.

```sh
git clone https://github.com/alloc/misty
node misty/test.js
```

<img src="https://raw.githubusercontent.com/alloc/misty/master/test.gif" height="500"/>

&nbsp;

## Usage

```ts
import {
  isInteractive,
  warn,
  fatal,
  success,
  clear,
  print,
} from 'misty'

if (isInteractive) {
  // Prompt the user or something.
}

// Print a yellow message with [!] in front.
warn('Be careful')

// Print a message to stderr with red [!] in front. Then call process.exit(1)
fatal('Bollocks')

// Print a message with green checkmark in front.
success('We did it!')

// Clear the screen and scrollback.
clear()

// Clear two lines above the cursor.
clear(2)

// Like console.log without a line break. Useful for control sequences.
print('...')
```

&nbsp;

### Tasks

The `misty/task` module provides the `startTask` function, which helps you communicate what your script is doing without spamming the final output. **Task logs are transient,** so it's best to avoid using tasks for information that could be useful for debugging.

Tasks are logs that:
- have a spinner in front
- stick to the end
- can be updated
- can be finished
- print their elapsed time

```ts
import { startTask } from 'misty/task'

const task = startTask('Building…')
task.update('Analyzing…')
task.finish('Build completed')
```

**What else should you know?**
- Multiple tasks can be active at once.
- Call `finish` with no message to hide the task.

&nbsp;

### Spinner

The `misty/spin` module provides functions to customize the spinner
and build your own task-like messages.

```ts
import { setSpinner } from 'misty/spin'

// Customize the spinner!
setSpinner({
  interval: 50,
  frames: ['◐', '◓', '◑', '◒'],
  color: require('kleur').magenta,
})

// These are for advanced usage.
import { spin, spinListeners, getSpinner } from 'misty/spin'
```

**What else should you know?**
- Animating multiple different spinners is not supported.
- Tasks use the spinner passed to `setSpinner`.

&nbsp;

### Prompts

Prompts are not supported by `misty`, but I recommend these packages:
- [`clikey`](https://github.com/zewish/clikey) for keypress events
- [`prompts`](https://github.com/terkelg/prompts) for user input

&nbsp;

### Colors

Color support is provided by [`kleur`](https://github.com/lukeed/kleur), so you should use that too.

&nbsp;

### Logging

Logs are handled by [`shared-log`](https://github.com/alloc/shared-log).
