
/**
  * 过滤数字
  * @param { String | Number } str 将要过滤的字符串
  * @param { Number } n = 2 保留几位小数
  */
function filterNumber (str, n = 2) {
  let arr = String(str).trim().split("");
  let zeroIndex = -1;
  for (let i = 0; i < arr.length; i++) {
    const curr = arr[i];
    // 去除头部0
    if (i === 0 && curr === "0" && arr[i + 1] !== ".") {
      arr.splice(i--, 1);
      continue;
    }
    // 记录小数点第一次出现的位置
    if (curr === "." && zeroIndex < 0) {
      zeroIndex = i;
      continue;
    }
    // 处理非数字的情况
    if (!/^[0-9]$/.test(curr)) {
      arr.splice(i--, 1);
      continue;
    }
    // 保留几位小数
    if (zeroIndex >= 0 && i - zeroIndex > n) {
      arr = arr.slice(0, i);
      break;
    }
  }
  // 处理开头小数的问题
  if (arr[0] === ".") arr.unshift("0");
  return arr.join("");
}

// 测试用例
console.log('0123') // 123
console.log('0.123') // 0.12
console.log('.123') // 0.12
console.log('1.2.3') // 1.2
console.log('123.123') // 123.12
console.log('123.120') // 123.12
