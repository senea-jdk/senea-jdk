class Data {
  constructor() {
    this.keys = []
    this.values = {}
    this.tmpData = {}
  }
  set(fieldName, fieldValue, temporary) {
    this.keys.push(fieldName)
    temporary
      ? (this.tmpData[':' + fieldName] = fieldValue)
      : (this.values[':' + fieldName] = fieldValue)
  }
  get(fieldName) {
    return this.tmpData.hasOwnProperty(':' + fieldName)
      ? this.tmpData[':' + fieldName]
      : this.values[':' + fieldName]
  }
  map(callback) {
    for (var b = 0; b < this.keys.length; b++) {
      var fieldName = this.keys[b],
        fieldValue = this.get(fieldName)
      fieldValue && callback(fieldName, fieldValue)
    }
  }
}

export default Data
