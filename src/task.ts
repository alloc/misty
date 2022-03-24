import { gray, white } from 'kleur/colors'
import stripAnsi from 'strip-ansi'
import { clear, formatElapsed, isInteractive, print, success } from '.'
import { getSpinner, spin, spinListeners } from './spin'

let activeTasks = new Set<MistyTask>()

export interface MistyTask {
  isFooter: boolean
  height: number
  render(showElapsed?: boolean): void
  update(msg?: string): void
  finish(msg?: string): void
}

export namespace MistyTask {
  export interface Options {
    /**
     * Control whether the elapsed time is visible for this task.
     * @default true
     */
    elapsed?: boolean
    /**
     * Control whether the spinner is visible for this task.
     *
     * The default value is `true` unless `footer: true` is used.
     */
    spinner?: boolean
    /**
     * Always render this task after normal tasks.
     *
     * This also implies `spinner: false`
     */
    footer?: boolean
  }
}

export function startTask(
  init: string | (() => string),
  options: boolean | MistyTask.Options = {}
): MistyTask {
  if (typeof options == 'boolean') {
    options = { spinner: options }
  }

  const elapsedVisible = options.elapsed !== false
  const spinnerEnabled = options.footer
    ? options.spinner
    : options.spinner !== false

  let text = typeof init == 'string' ? init : init()
  let render = typeof init == 'string' ? () => text : init
  let start = Date.now()
  let output = ''

  const task: MistyTask = {
    isFooter: !!options.footer,
    get height() {
      const lines = stripAnsi(output).split('\n')
      return lines.reduce(
        (height, line) =>
          height + Math.ceil(line.length / process.stdout.columns),
        0
      )
    },
    render(showElapsed = elapsedVisible) {
      const elapsed = showElapsed ? gray(formatElapsed(start)) : ''
      output = spinnerEnabled ? getSpinner() + ' ' : ''
      output += text + ' ' + elapsed
      print(output + '\n')
    },
    update(msg = render()) {
      if (text !== msg) {
        text = msg
        if (!isInteractive) {
          this.render()
        }
      }
    },
    finish(msg) {
      if (isInteractive) {
        printTasks()
      }
      if (msg) {
        const color = msg.endsWith(' in') ? white : gray
        success(msg + color(' ' + formatElapsed(start)))
      }
      activeTasks.delete(this)
      if (!activeTasks.size) {
        spinListeners.delete(printTasks)
        spin(false)
      }
    },
  }

  if (!activeTasks.size) {
    spinListeners.add(printTasks)
    spin(true)
  }

  install()
  if (!wiped) {
    task.render(false)
  }

  activeTasks.add(task)
  return task
}

let wiped = false

function printTasks() {
  if (!wiped && activeTasks.size) {
    wiped = true
    clear(getTasksHeight())
    process.nextTick(() => {
      activeTasks.forEach(task => !task.isFooter && task.render())
      activeTasks.forEach(task => task.isFooter && task.render())
      wiped = false
    })
  }
}

function getTasksHeight() {
  let height = 0
  activeTasks.forEach(task => (height += task.height))
  return height
}

let installed = false

function install() {
  if (!isInteractive) return
  if (!installed) {
    installed = true
    for (const name of ['stdout', 'stderr'] as const)
      hookBefore(process[name], 'write', printTasks)
    for (const name of ['log', 'warn', 'error'])
      hookBefore(console, name, printTasks)
  }
}

function hookBefore(target: any, method: string, hook: (args: any[]) => void) {
  const impl = target[method]
  target[method] = (...args: any[]) => (hook(args), impl.apply(target, args))
}
