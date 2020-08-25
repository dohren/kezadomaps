<template>
  <kaiui-content>
    <kaiui-header title="Kezado Maps" />
    <map-component/>
  </kaiui-content>
</template>

<script>

import MapComponent from './components/MapComponent.vue'

export default {
  name: 'App',
  components: {
    MapComponent
  },
  data: () => ({
    softkeysPhone: { left: "What's App", center: "Call", right: "SMS" },
  })
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

:root{

 --primary-dark-color: #02b51e;
} 

</style>
