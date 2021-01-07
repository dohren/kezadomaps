import Vue from 'vue'

Vue.mixin({
  methods: {
    
    selectFirstElement() {
        let keydown = new KeyboardEvent("keydown", {
            key: 'ArrowUp', 
            bubbles: true,
            cancelable: true
          })
          setTimeout(() => document.body.dispatchEvent(keydown), 250);
        }
  }
})