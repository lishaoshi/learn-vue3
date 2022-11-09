import { reactive } from "../reactive"

describe('reactive path', () => {
  it('reactive test', () => {
    const obj = { name: 'liss' }

    const proxyObj = reactive(obj)

    expect(obj).not.toBe(proxyObj)
  })
})