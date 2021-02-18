class Hook {
  constructor(name, paramName, defaultValue, getter, setter) {
    this.name = name // 字段名
    this.paramName = paramName // F 字段的参数名（传给后端时候的参数名）
    this.getter = getter // Z 获取时候的hook函数
    this.setter = setter // o 设置时候的hook函数
    this.defaultValue = defaultValue // 默认值
  }
}
