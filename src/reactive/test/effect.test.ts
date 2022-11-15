import { effect } from '../effect'
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

  // computed
  it('shoudler complier computed', () => {
    
  })

})