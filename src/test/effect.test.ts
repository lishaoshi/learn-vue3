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
})