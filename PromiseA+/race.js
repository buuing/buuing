
/**
 * 实现Promise.race方法
 */
Promise.myRace = function (values) {
  return new Promise((resolve, reject) => {
    let len = values.length
    for (let i = 0; i < len; i++) {
      let curr = values[i]
      if (isPromise(curr)) {
        curr.then(res => {
          resolve(res)
        })
      } else {
        resolve(curr)
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

Promise.myRace([
  new Promise(resolve => setTimeout(() => resolve(1), 1000)),
  Promise.resolve(3),
  2,
]).then(res => {
  console.log(res)
})
