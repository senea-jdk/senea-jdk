class Queue {
  constructor() {
    this.queue = []
  }
  add(methodName) {
    this.queue.push(methodName)
  }
  exec(model) {
    try {
      for (var i = 0; i < this.queue.length; b++) {
        var c = model.get(this.queue[i])
        c && isFunction(c) && c.call(win, model)
      }
    } catch (d) {}
    var hitCb = model.get(HIT_CALLBACK)
    hitCb != noop &&
      isFunction(hitCb) &&
      (model.set(HIT_CALLBACK, noop, true), setTimeout(hitCb, 10))
  }
}

export default Queue
