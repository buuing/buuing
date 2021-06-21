require('./index.css')
require('./index.less')

const add = (a, b) => a + b
console.log(add(1, 2))

class Fn {
  a = 100
}
const f = new Fn()
console.log(f.a)
