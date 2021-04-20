
/*
 * 实现then的链式调用
 * status = 'pending' | 'fulfilled' | 'rejected'
 */
class myPromise {
  constructor (executor) {
    this.status = 'pending' // 当前的状态
    this.value = undefined // 成功的值
    this.reason = undefined // 失败的原因
    this.onFulfilledCallbacks = [] // then队列
    this.onRejectedCallbacks = [] // catch队列
    // 成功的执行函数
    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.onFulfilledCallbacks.forEach(fn => fn())
      }
    }
    // 失败的执行函数
    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    // 调用执行器, 如果报错就直接进入catch
    try {
      executor(resolve, reject)
    } catch (err) {
      reject(err)
    }
  }
  then (onFulfilled, onRejected) {
    // 由于then的参数都是可选参数, 所以需要过滤值不是函数的情况
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (val) => val
    onRejected = typeof onRejected === 'function' ? onRejected : (err) => {
      throw err
    }
    // 返回一个新的promise
    let promise2 = new myPromise((resolve, reject) => {
      // 同步情况下, resolve会先一步执行, 这里直接就能观察到状态的变化
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      }
      // 异步情况下, then执行的时候状态还没改变, 所有还是pending
      if (this.status === 'pending') {
        // 先把函数都存储起来, 等待后续resolve或reject触发的时候, 再执行所有的回调
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (err) {
              reject(err)
            }
          })
        })
      }
    })
    return promise2
  }
}

// promise处理过程
function resolvePromise (promise2, x, resolve, reject) {
  if (promise2 === x) return reject(new TypeError('循环引用错误'))
  // x 必须是一个对象或方法, 否则就直接调用resolve返回值
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
    // 防止多次调用成功或失败, 因为传入的promsie可能是别人封装的
    let called = false
    // 尝试读取x的then属性, 如果不存在就说明他不是一个thenable
    try {
      let then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (err) {
      // 如果报错说明不是thenable, 就直接返回
      if (called) return
      called = true
      reject(err)
    }
  } else {
    resolve(x)
  }
}

myPromise.defer = myPromise.deferred = function () {
  let dfd = {}
  dfd.promise = new myPromise((resolve, reject) => {
    dfd.resolve = resolve
    dfd.reject = reject
  })
  return dfd
}

module.exports = myPromise
