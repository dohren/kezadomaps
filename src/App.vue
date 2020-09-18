<template>
  <kaiui-content>
    <kaiui-header title="Kezado Maps" />
    <map-component v-if="!this.inSettings" />
    <settings v-else v-on:closeSettings="onCloseSettings"/>
  </kaiui-content>
</template>

<script>

import MapComponent from './components/Map.vue'
import Settings from './components/Settings.vue'

export default {
  name: 'App',
  components: {
    MapComponent,
    Settings
  },
  data: () => ({
    inSettings: false,
    settings: ""
  }),
  methods: {
    onCloseSettings(settings) {
      this.settings = settings;
      this.inSettings = false;
    }
  },
  mounted() {
    let $vm = this;
    window.addEventListener("keydown", function(e) {
      
      switch (e.key) {
        case "Backspace":
            e.preventDefault();
            $vm.inSettings = true;
            break;
      }
    });
   }
}
</script>

<style>
html {
  min-width: 240px;
}

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
