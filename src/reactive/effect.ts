// 全局变量
// 当前正在观察的响应副作用函数
let activeEffeact

// 封装effect 用于收集依赖
class ReactiveEffect {
 constructor(public fn, public options) {

 }
}

function effect(fn: Function, options = {}) {
  const effectFn = () => {
    clearEffectFn(effectFn)
    // 当前收集的依赖
    activeEffeact = effectFn

    fn()

    activeEffeact = undefined
  }
  // 将options挂在在 封装后函数的属性 options中，在trigger中，从依赖桶中读取依赖函数时，可以拿到options
  effectFn.options = options

  // 将当前effectFn的所有相关依赖绑定到deps中
  effectFn.deps = []

  

  effectFn()
}

// 执行副作用钱  清除当前执行副作用的所有依赖
function clearEffectFn(effectFn) {
  for(let i = 0; i < effectFn.deps?.length; i++) {
    const deps: Set<any> = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

const targetMap = new WeakMap()
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

  activeEffeact?.deps.push(dep)
}

// 触发响应式依赖
function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  const deps = depsMap.get(key)

  const effectFnToRuns = new Set<any>(deps)
  effectFnToRuns.forEach(fn => {
    if (fn !== activeEffeact) {
      if (fn.options.scheduler) {
        fn.options.scheduler()
      } else {
        fn()
      }
    } 
    
  });
}

export {
  effect,
  track,
  trigger
}