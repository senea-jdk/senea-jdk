class UsageManager {
  constructor(umMap) {
    this.umMap = umMap || []
  }
  set(idx) {
    this.umMap[idx] = true
  }
  encode() {
    var um = []
    for (var i = 0; i < this.umMap.length; i++) {
      if (this.umMap[i]) {
        // `1 << x` === `Math.pow(2, x)`
        um[Math.floor(i / 6)] ^= 1 << i % 6
      }
    }
    for (i = 0; i < um.length; i++) {
      um[
        i
      ] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'.charAt(
        um[i] || 0
      )
    }
    return um.join('') + '~'
  }
  decode(um) {
    um = um.slice(0, -1)
    var key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
    var code
    var binaryCode
    var reversedbinaryCode
    var codes = []
    for (var i = 0; i < um.length; i++) {
      code = key.indexOf(um.charAt(i))
      binaryCode = code.toString(2)
      reversedbinaryCode = binaryCode.split('').reverse()
      // console.log(i + '=' + code + '=' + binaryCode + '=reverse(' + reversedbinaryCode + ')');
      for (var j = 0; j < reversedbinaryCode.length; j++) {
        if (reversedbinaryCode[j] === '1') {
          codes.push(j + 6 * i)
        }
      }
    }
    return codes
  }
}

export default UsageManager
