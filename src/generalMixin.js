import Vue from 'vue'

Vue.mixin({
  methods: {
    
    setFirstIndexActive() {
        let keydown = new KeyboardEvent("keydown", {
            key: 'ArrowUp', 
            bubbles: true,
            cancelable: true
          })
          setTimeout(() => document.body.dispatchEvent(keydown), 50);
        }
  }
})