import { extend, isArray } from '../shared/index'
import {
  createDep,
  Dep
} from './dep'

// 全局变量
// 当前正在观察的响应副作用函数
let activeEffeact

let effectStack: any = []


// 封装effect 用于收集依赖
export class ReactiveEffect {
  active: Boolean = true
  deps: Dep[] = []
  onStop?: () => void
 constructor(public fn, public scheduler?) {

 }

 run() {

  effectStack.push(this)
  cleanupEffect(this)

  activeEffeact = this as any

  const result = this.fn()
  effectStack.pop()

  activeEffeact = effectStack[effectStack.length - 1]

  return result
 }

 stop() {
  if (this.active) {
    cleanupEffect(this)
    if (this.onStop) {
      this.onStop()
    }
    this.active = false
  }
 }
}

function effect(fn: Function, options = {}) {

  const effect = new ReactiveEffect(fn)
  // 将options挂在在 封装后函数的属性 options中，在trigger中，从依赖桶中读取依赖函数时，可以拿到options
  // effectFn.options = options
  extend(effect, options)

  // 将当前effectFn的所有相关依赖绑定到deps中
  // effectFn.deps = []

  effect.run()
  // effect 返回副作用函数  提供可主动触发副作用函数 可自定义执行副作用时机
  const runner = (effect.run.bind(effect)) as ReactiveEffectRunner
  runner.effect = effect
  return runner
}

// stop reactivety
export function stop(runner: ReactiveEffectRunner) {
  runner.effect.stop()
}

export interface ReactiveEffectRunner<T = any> {
  (): T
  effect: ReactiveEffect
}

// 执行副作用钱  清除当前执行副作用的所有依赖
function cleanupEffect(effect: ReactiveEffect) {
  for(let i = 0; i < effect.deps?.length; i++) {
    const deps: Set<any> = effect.deps[i]
    deps.delete(effect)
  }
  effect.deps.length = 0
}

const targetMap = new WeakMap()
// 收集响应式依赖
function track(target, key) {
  if(!activeEffeact) return
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

  const effectFnToRuns = createDep(deps)

  triggerEffects(effectFnToRuns)
}


function triggerEffects(dep: Dep | ReactiveEffect[]) {
  const effects = isArray(dep) ? dep : [...dep]
  for (const effect of effects) {
    triggerEffect(effect)
  }
}

function triggerEffect(effect: ReactiveEffect) {
  if (effect !== activeEffeact) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export {
  effect,
  track,
  trigger
}