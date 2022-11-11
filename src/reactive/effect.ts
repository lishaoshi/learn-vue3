// 全局变量
// 当前正在观察的响应副作用函数
let activeEffeact

function effect(fn: Function, options = {}) {
  const effectFn = () => {
    clearEffectFn(effectFn)
    // 当前收集的依赖
    activeEffeact = effectFn

    fn()
  }
  // 将options挂在在 封装后函数的属性 options中，在trigger中，从依赖桶中读取依赖函数时，可以拿到options
  effectFn.options = options

  // 将当前effectFn的所有相关依赖绑定到deps中
  effectFn.deps = []

  

  effectFn()
  
  activeEffeact = undefined
}

// 执行副作用钱  清除当前执行副作用的所有依赖
function clearEffectFn(effectFn) {
  for(let i = 0; i <  effectFn.deps?.length; i++) {

  }
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
  deps && deps.forEach(fn => {
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