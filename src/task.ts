import { gray, white } from 'kleur/colors'
import stripAnsi from 'strip-ansi'
import { clear, formatElapsed, isInteractive, print, success } from '.'
import { getSpinner, spin, spinListeners } from './spin'

let activeTasks = new Set<MistyTask>()

export interface MistyTask {
  height: number
  render(showElapsed?: boolean): void
  update(msg?: string): void
  finish(msg?: string): void
}

export function startTask(
  init: string | (() => string),
  hideSpinner?: boolean
): MistyTask {
  let text = typeof init == 'string' ? init : init()
  let render = typeof init == 'string' ? () => text : init
  let start = Date.now()
  let output = ''
  const task: MistyTask = {
    get height() {
      const lines = stripAnsi(output).split('\n')
      return lines.reduce(
        (height, line) =>
          height + Math.ceil(line.length / process.stdout.columns),
        0
      )
    },
    render(showElapsed = true) {
      const elapsed = showElapsed ? gray(formatElapsed(start)) : ''
      output = hideSpinner ? '' : getSpinner() + ' '
      output += text + ' ' + elapsed
      print(output + '\n')
    },
    update(msg = render()) {
      text = msg
      if (!isInteractive) {
        this.render()
      }
    },
    finish(msg) {
      printTasks()
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
      activeTasks.forEach(task => task.render())
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
