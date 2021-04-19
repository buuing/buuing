
/*
 * 实现最基础的同步/异步调用
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
    // 同步情况下, resolve会先一步执行, 这里直接就能观察到状态的变化
    if (this.status === 'fulfilled') {
      onFulfilled(this.value)
    }
    if (this.status === 'rejected') {
      onRejected(this.reason)
    }
    // 异步情况下, then执行的时候状态还没改变, 所有还是pending
    if (this.status === 'pending') {
      // 先把函数都存储起来, 等待后续resolve或reject触发的时候, 再执行所有的回调
      this.onFulfilledCallbacks.push(() => onFulfilled(this.value))
      this.onRejectedCallbacks.push(() => onRejected(this.reason))
    }
  }
}

let p1 = new myPromise((resolve, reject) => {
  console.log('同步任务')
  // setTimeout(_ => {
    resolve('success')
  // }, 1000)
})

p1.then(res => {
  console.log('成功', res)
}, err => {
  console.log('失败', err)
})
