// 全局变量
// 当前正在观察的响应副作用函数
let activeEffeact

function effect(fn: Function) {
  activeEffeact = fn
  fn()
}

const targetMap = new Map()
// 收集响应式依赖
function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)

  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  dep.add(activeEffeact)
}

// 触发响应式依赖
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const deps = depsMap.get(key)
  deps.forEach(fn => {
    fn()
  });
}

export {
  effect,
  track,
  trigger
}