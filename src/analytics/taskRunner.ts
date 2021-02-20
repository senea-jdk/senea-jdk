import { createTracker, defaultTracker } from './tracker'
import { warn, throwError, isObject, isFunction, isString } from '../util'

export function runTasks(tasks: Task[]) {
  tasks.forEach((task) => runTask(task))
}

export function runTask(task: Task) {
  if (isCommand(task)) {
    runCommand(task)
  } else if (isCallback(task)) {
    runCallback(task)
  } else {
    warn(`暂不支持${task}格式的命令`)
  }
}

function isCallback(task: any): task is CallbackTask {
  return isFunction(task[0])
}

function runCallback(task: CallbackTask) {
  const cmd = task[0]
  cmd(defaultTracker)
}

function isCommand(task: any): task is CommandTask {
  return isString(task[0])
}

function runCommand(task: CommandTask) {
  // 检查操作是否符合规范
  inspectOperation(task)
  const cmd = task[0]
  if (cmd === 'create') {
    runCreate(task)
  } else if (cmd === 'set') {
    runSet(task)
  } else if (cmd === 'send') {
    runSend(task)
  }
}

function inspectOperation(task: CommandTask) {
  const cmd = task[0]
  if (!defaultTracker && cmd !== 'create') {
    throwError('senea.create必须在所有命令之前！')
  }
  if (defaultTracker && cmd === 'create') {
    throwError('暂不支持创建多个tracker！')
  }
}

function runCreate(task: CommandTask) {
  const opts = isObject(task[2]) ? task[2] : {}

  createTracker({
    tId: task[1],
    ...opts
  })
}

function runSet(task: CommandTask) {
  const [_, fieldName, fieldValue] = task
  defaultTracker.setField(fieldName, fieldValue)
}

function runSend(task: CommandTask) {
  const [_, hitType, param] = task
  if (hitType === 'pageview') {
    defaultTracker.send('pageview', param)
  } else if (hitType === 'event') {
    defaultTracker.send('event', param)
  } else if (hitType === 'performance') {
    defaultTracker.send('performance', param)
  } else {
    warn(`senea.send 暂只支持'pageview','event','performance'`)
  }
}
