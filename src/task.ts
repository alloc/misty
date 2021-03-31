import k from 'kleur'
import { getSpinner, spin, spinListeners } from './spin'
import { clear, success, print, isInteractive } from '.'

let activeTasks = new Set<MistyTask>()

export interface MistyTask {
  render(showElapsed?: boolean): void
  update(msg: string): void
  finish(msg?: string): void
}

export function startTask(text: string): MistyTask {
  let start = Date.now()
  const task: MistyTask = {
    render(showElapsed = true) {
      const elapsed = showElapsed ? k.gray(formatElapsed(start)) : ''
      print(getSpinner() + ` ${text} ` + elapsed + '\n')
    },
    update(msg) {
      text = msg
      if (!isInteractive) {
        this.render()
      }
    },
    finish(msg) {
      printTasks()
      if (msg) {
        const color = msg.endsWith(' in') ? k.white : k.gray
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
  task.render(false)
  activeTasks.add(task)
  return task
}

let wiped = false

function printTasks() {
  if (!wiped && activeTasks.size) {
    wiped = true
    clear(activeTasks.size)
    process.nextTick(() => {
      activeTasks.forEach(task => task.render())
      wiped = false
    })
  }
}

function formatElapsed(start: number) {
  const elapsedMs = Date.now() - start
  return elapsedMs < 200
    ? elapsedMs + 'ms'
    : (elapsedMs / 1000).toFixed(1) + 's'
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
