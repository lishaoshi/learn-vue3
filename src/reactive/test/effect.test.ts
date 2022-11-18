import { effect, stop, ReactiveEffectRunner } from '../effect'
import { reactive } from '../reactive'

describe('effect path', () => {
  
  it('effect test', () => {
    const obj = reactive({ name: 'liss' })
    let name = null
    effect(() => {
      name = obj.name
    })
    expect(name).toBe('liss')

    obj.name = 'mxx'
    
    expect(name).toBe('mxx')

  })

  let currentAge = 0
  // 调度 scheduler 测试用例
  it('scheduler test', () => {
    const obj = reactive({ name: 'liss', age: 18 })
    effect(() => {
      console.log(obj.age)
    }, {
      scheduler() {
        currentAge = obj.age
      }
    })

   obj.age = 20
   expect(currentAge).toBe(obj.age)
  })

  // 无限循环
  it('trigger and track', () => {
    const obj = reactive({count: 0})

    effect(() => {
      obj.count++
    })
    expect(obj)

  })

  // 三则运算符 读取时 合理出发响应式
  it('shoudler read key', () => {
    let bodyText = ''
    let resultcount = 0
    const obj = reactive({ ok: true, text: 'hello jest' })

    effect(() => {
      bodyText = obj.ok ? obj.text : 'hello body'
      resultcount++
    })

    obj.ok = false

    obj.text = 'jest'

    expect(resultcount).toBe(2)

  })

  // 测试effect 嵌套
  it('effect 嵌套', () => {
    let cName
    let cAge
    const info = reactive({
      name: 'liss',
      age: 25
    })

    effect(() => {
      console.log('外层effect')
      effect(() => {
        console.log('内嵌套')
        cAge = info.age
      })
      cName = info.name
    })
    info.age = 18

  })

  // stop
  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner: ReactiveEffectRunner = effect(() => {
      dummy = obj.prop
    })

    obj.prop = 2

    expect(dummy).toBe(2)
    stop(runner)

    obj.prop = 3

    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(3)
  })

  it('events: onStop', () => {
    const onStop = jest.fn()

    const runner = effect(() => {}, {
      onStop
    })

    stop(runner)

    expect(onStop).toHaveBeenCalled()
  })
// stop 后再执行runner  将不再响应
  it('should stoped for runner call not observe', () => {
    const obj = reactive({prop: 0})
    let dummy
    const runner = effect(() => {
      dummy = obj.prop
    })

    stop(runner)

    obj.prop++

    expect(dummy).not.toBe(obj.prop)
  })

  // computed
  it('shoudler complier computed', () => {
    
  })

})