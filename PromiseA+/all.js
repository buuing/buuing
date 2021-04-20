
/**
 * 实现Promise.all方法
 */
Promise.myAll = function (values) {
  return new Promise((resolve, reject) => {
    let count = 0, len = values.length, arr = []
    for (let i = 0; i < len; i++) {
      let curr = values[i]
      if (isPromise(curr)) {
        curr.then(res => {
          arr[i] = res
          if (++count === len) resolve(arr)
        }, reject)
      } else {
        arr[i] = curr
        if (++count === len) resolve(arr)
      }
    }
  })
}

// 判断是否是一个promise
function isPromise (value) {
  if ((typeof value === 'object' && value !== null) || typeof value === 'function') {
    if (typeof value.then === 'function') {
      return true
    }
  }
  return false
}

let p = Promise.myAll([
  1,
  new Promise(resolve => setTimeout(() => resolve(2), 1000)),
  3
]).then(res => {
  console.log(res)
})
