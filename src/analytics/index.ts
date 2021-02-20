import { runTasks, runTask } from './taskRunner'

const tasks = window.senea.q || []
runTasks(tasks)

window.senea = (...args) => runTask(args)
