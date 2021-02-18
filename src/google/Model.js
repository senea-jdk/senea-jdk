import Data from './Data'

// 全局的Hook配置
// 配置的值是Hook类的对象
var hookMap = new Data()
// 有些配置的值的计算有特殊方法，这里存储计算规则
// [/^contentGroup([0-9]+)$/, generateFunction]
// generateFunction输入是正则的exec执行结果，输出是Hook类的对象
// 执行结果会被放到hookMap
var specialHooks = []

// 新增特殊配置生成规则
var addSpecialHook = function (fieldNameReg, gen) {
  specialHooks.push([new RegExp('^' + fieldNameReg + '$'), gen])
}
// 获取hookMap中的配置，如果配置不存在，则使用specialHooks中的规则生成
var getHook = function (fieldName) {
  var value = hookMap.get(fieldName)
  if (!value) {
    for (var i = 0; i < specialHooks.length; i++) {
      var hook = specialHooks[i]
      var r = hook[0].exec(fieldName)
      if (r) {
        value = hook[1](r)
        // 生成结果会被放到hookMap中缓存下来
        hookMap.set(value.name, value)
        break
      }
    }
  }
  return value
}

var trackingIdRegex = /^(UA|YT|MO|GP)-(\d+)-(\d+)$/
var _modelSet = function (model, fieldName, fieldValue, temporary) {
  if (fieldValue != null) {
    switch (fieldName) {
      case TRACKING_ID:
        trackingIdRegex.test(fieldValue)
    }
  }

  var e = getHook(fieldName)
  if (e && e.setter) {
    // 如果有特殊规则，则使用特定规则设置
    e.setter(model, fieldName, fieldValue, temporary)
  } else {
    // 否则设置到模型的data上
    model.data.set(fieldName, fieldValue, temporary)
  }
}

class Model {
  constructor() {
    this.data = new Data()
  }
  get(fieldName) {
    var hook = getHook(fieldName)
    var value = this.data.get(fieldName)

    // 如果没有则使用默认值
    if (hook && undefined == value) {
      if (isFunction(hook.defaultValue)) {
        value = hook.defaultValue()
      } else {
        value = hook.defaultValue
      }
    }

    // 如果有getter，则使用getter来转换
    return hook && hook.getter ? hook.getter(this, fieldName, value) : value
  }
  set(fieldName, fieldValue, temporary) {
    if (!fieldName) {
      return
    }

    if ('object' == typeof fieldName)
      for (var d in fieldName)
        fieldName.hasOwnProperty(d) &&
          _modelSet(this, d, fieldName[d], temporary)
    else _modelSet(this, fieldName, fieldValue, temporary)
  }
}
