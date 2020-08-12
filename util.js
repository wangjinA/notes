
/**
 * @description 指定范围随机数字
 * @param {Number} min 最小数  
 * @param {Number} max 最大数  
 * @return {Number} 返回数字
 */
export const randomNumber = (min = 0, max = 10) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
/**
 * @description 指定长度随机字符串
 * @param {Number} length 随机字符串长度  
 * @param {Number} chats 可自定义字符串列表  
 * @return {String} 英文和数字的随机字符串
 */
export const randomString = (length = 10, chats) => {
  if (!chats) chats = '1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
  let str = ''
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}
// 清除HTML标签
export const clear_html_tag = (str) => {
  return str ? str.replace(/<\/?.+?>/g, '') : str
}
// 判断必传参数
export const $required = (arr = [], params) => {
  if (!params) {
    return false
  }
  let noProblem = true
  arr.forEach(key => {
    if (!params.hasOwnProperty(key)) {
      console.error(`缺少 ${key} 参数`)
      noProblem = false
    }
  });
  return noProblem
}

/**
 * @description 对象转换为style语句  
 * @param {Array} style style对象 {color:red,fontSize:12px}
 * @param {Array} isImportant 是否inportant
 * @return {String} style语句字符串 'color:red;fontSize:12px'
 */
export const jsonToStyle = (style, isImportant) => {
  isImportant = isImportant ? '!important' : ''
  if (style instanceof Object) {
    let s = []
    for (let i in style) {
      s.push(`${i}:${style[i]}${isImportant}`);
    }
    return s.join(';')
  }
  return ''
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
  const keyValueArr = url.split("?")[1].split("&");
  let paramObj = {};
  keyValueArr.forEach(item => {
    const keyValue = item.split("=");
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};

// 数字转换单位  10000 -> 1万
//使用
// let num = 10000
// numGetUnit(num ) // console.log(1) 单独抽出来方便做【数字递增效果】
// numGetUnit(num, true) // console.log('万') // 方便额外设置单位的字体样式
export const numGetUnit = (__num, __isReturnUnit = false) => {
  let wszd = {
    addWan: function (integer, number, mutiple, decimalDigit) {
      var me = this
      var digit = me.getDigit(integer)
      if (digit > 3) {
        var remainder = digit % 8
        if (remainder >= 5) {
          // ‘十万’、‘百万’、‘千万’显示为‘万’
          remainder = 4
        }
        return [Math.round(number / Math.pow(10, remainder + mutiple - decimalDigit)) / Math.pow(10, decimalDigit), '万']
      } else {
        return [Math.round(number / Math.pow(10, mutiple - decimalDigit)) / Math.pow(10, decimalDigit)]
      }
    },
    getDigit: function (integer) {
      var digit = -1
      while (integer >= 1) {
        digit++
        integer = integer / 10
      }
      return digit
    },
    addChineseUnit: function (number, decimalDigit = 0) {
      // decimalDigit：小数点保留多少位 默认0
      var me = this
      var integer = Math.floor(number)
      var digit = me.getDigit(integer)
      // ['个', '十', '百', '千', '万', '十万', '百万', '千万'];
      var unit = []
      if (digit > 3) {
        var multiple = Math.floor(digit / 8)
        if (multiple >= 1) {
          // 添加亿
          var tmp = Math.round(integer / Math.pow(10, 8 * multiple))
          unit = me.addWan(tmp, number, 8 * multiple, decimalDigit)
          for (var i = 0; i < multiple; i++) {
            unit.push('亿')
          }
          return unit
        } else {
          // 添加万
          return me.addWan(integer, number, 0, decimalDigit)
        }
      } else {
        return [number]
      }
    }
  }
  let arr = wszd.addChineseUnit(__num)
  if (__isReturnUnit) {
    arr.shift()
    return arr.join('') // 返回单位
  } else {
    return arr[0] // 返回数字
  }
}