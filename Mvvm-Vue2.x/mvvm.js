
const isExpectType = (param, ...types) => {
  return types.some(type => Object.prototype.toString.call(param).slice(8, -1).toLowerCase() === type)
}

class Mvvm {
  constructor (options) {
    /**
     * initData 初始化数据
     * 这里先把数据代理到 this 上, 然后处理响应式
     */
    if (options.data) {
      this.$data = options.data
      this._proxy(this, this.$data)
      new Observer(this.$data)
    }
    // initComputed
    /**
     * initWatch 初始化观察者
     * 此处我把源码中的 initWatch 和 createWatcher 合到一起
     */
    if (options.watch) {
      const watch = options.watch
      Object.keys(watch).forEach(key => {
        let handler = watch[key]
        let watchOpt = {}
        if (Object.prototype.toString.call(handler) === '[object Object]') {
          watchOpt = handler
          handler = watchOpt.handler
        }
        // 如果是 handler 是 Function 则无需处理
        // 且目前不考虑 handler 是字符串和数组的情况
        this.$watch(key, handler, watchOpt)
      })
    }
  }
  /**
   * 把 data 上面的数据代理到 this 上面
   * @param {*} vm 
   * @param {*} data 
   */
  _proxy (vm, data) {
    if (typeof data !== 'object') return
    Object.keys(data).forEach(key => {
      Object.defineProperty(vm, key, {
        get: () => {
          return data[key]
        },
        set: (newVal) => {
          data[key] = newVal
        }
      })
    })
  }
  $set () {}
  $watch (expr, cb, options) {
    const watcher = new Watcher(this, expr, cb, options)
    if (options.immediate) {
      cb.call(this, watcher.value)
    }
    return function unwatchFn () {
      // 卸载当前 watch 的观察模式
    }
  }
}

class Observer {
  /**
   * 响应式构造器
   * @param {*} data 
   */
  constructor (data) {
    this.observe(data)
  }
  /**
   * 处理响应式
   * @param { Object | Array } data
   */
  observe (data) {
    if (typeof data !== 'object') return
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }
  /**
   * 重写 setter / getter
   * @param {*} data 
   * @param {*} key 
   * @param {*} val 
   */
  defineReactive (data, key, val) {
    const dep = new Dep()
    let childOb = this.observe(val)
    Object.defineProperty(data, key, {
      get: () => {
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val
      },
      set: (newVal) => {
        if (newVal === val) return
        val = newVal
        childOb = this.observe(newVal)
        dep.notify()
      }
    })
  }
}

class Dep {
  static target = null
  /**
   * 订阅中心构造器
   */
  constructor () {
    this.subs = []
  }
  /**
   * 收集依赖
   * @param {*} sub 
   */
  addSub (sub) {
    if (!this.subs.includes(sub)) {
      this.subs.push(sub)
    }
  }
  /**
   * 派发更新
   */
  notify () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

function parsePath (path) {
  path += '.'
  let segments = [], segment = ''
  for (let i = 0; i < path.length; i++) {
    let curr = path[i]
    if (/\[|\./.test(curr)) {
      segments.push(segment)
      segment = ''
    } else if (/\W/.test(curr)) {
      continue
    } else {
      segment += curr
    }
  }
  return function (data) {
    return segments.reduce((data, key) => {
      return data[key]
    }, data)
  }
}

let uid = 0
class Watcher {
  /**
   * 观察者构造器
   * @param {*} vm 
   * @param {*} expr 
   * @param {*} cb 
   */
  constructor (vm, expr, cb, options) {
    this.id = uid++
    this.vm = vm
    this.expr = expr
    this.deep = !!options.deep
    if (typeof expr === 'function') {
      this.getter = expr
    } else {
      this.getter = parsePath(expr)
    }
    this.cb = cb
    this.value = this.get()
    // this.value = undefined
  }
  /**
   * 根据表达式获取新值
   */
  get () {
    Dep.target = this
    const value = this.getter.call(this.vm, this.vm)
    // 处理深度监听
    if (this.deep) {
      traverse(value)
    }
    Dep.target = null
    return value
  }
  /**
   * 触发 watcher 更新
   */
  update () {
    const newVal = this.get()
    const oldVal = this.value
    this.value = newVal
    this.cb.call(this.vm, newVal, oldVal)
  }
}

function traverse (value) {
  // const seenObjects = new Set()
  const dfs = (data) => {
    if (!isExpectType(data, 'array', 'object')) return
    Object.keys(data).forEach(key => {
      const value = data[key]
      dfs(value)
    })
  }
  dfs(value)
  // seenObjects.clear()
}
