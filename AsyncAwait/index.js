
// 获取数据的异步方法
const getData = (res) => new Promise(resolve => setTimeout(resolve, 1000, res))

// async function asyncFunc () {
//   console.log('同步')
//   const res1 = await getData('异步1')
//   console.log(res1)
//   const res2 = await getData('异步2')
//   console.log(res2)
//   return '结束'
// }

function * testGenerator () {
  console.log('同步')
  const res1 = yield getData('异步1')
  console.log(res1)
  const res2 = yield getData('异步2')
  console.log(res2)
  return '结束'
}

/**
 * 模拟 async / await 的底层实现
 */
function asyncToGenerator (generatorFunc) {
  return function () {
    const gen = generatorFunc.apply(this, arguments)
    return new Promise((resolve, reject) => {
      function step (key, arg) {
        let res
        try {
          res = gen[key](arg)
        } catch (err) {
          reject(err)
        }
        const { value, done } = res
        if (done) return resolve(value)
        return Promise.resolve(value).then(
          val => step('next', val),
          err => step('throw', err)
        )
      }
      step('next')
    })
  }
}

const fn = asyncToGenerator(testGenerator)
fn().then(result => {
  console.log(result)
})
