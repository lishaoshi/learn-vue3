import {  track, trigger } from './effect'

function reactive(raw) {
  return new Proxy(raw, {
    get: (target, key) => {
      /// TODO track
      track(target, key)
      return target[key]
    },
    set: (target, key, value) => {
      /// TODO trigger
      target[key] = value
      trigger(target, key)
      return true
      
    }
  })
}

export {
  reactive
}