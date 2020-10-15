<template>
  <kaiui-content>
    <kaiui-header title="Kezado Maps"/>
    <settings :settings="settings" v-if="this.inSettings"  v-on:closeSettings="onCloseSettings"/>
    <map-component :settings="settings" :ShowSettings="inSettings" v-on:openSettings="onOpenSettings"/>
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
  data: () =>({
    inSettings: false,
    settings: {
      gpxData: ""
    }
  }),
  methods: {
    onCloseSettings(settings) {
      this.settings = settings;
      this.inSettings = false;
    },
    onOpenSettings() {
      this.inSettings = true;
    }
  },
  mounted() {
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
