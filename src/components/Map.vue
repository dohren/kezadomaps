<template>

    <div class="map-dialog" >

        <div class="menu" v-if="this.showMenu">
            <kaiui-button ref="first" title="Karte" v-on:softCenter="toggleMenu" v-bind:softkeys="softkeys" />
            <kaiui-button title="Zeige Position" v-on:softCenter="showPosition" v-bind:softkeys="softkeys"/>
            <kaiui-button :title="this.titleNavigation" v-on:softCenter="startNavigation" v-bind:softkeys="softkeys"/>
            <kaiui-button title="Einstellungen" v-on:softCenter="openSettings" v-bind:softkeys="softkeys"/>
        </div>

        <vl-map class="map" ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326" >
          <vl-view 
            ref="view" 
            :center.sync="center" 
            :zoom.sync="zoom" >
          </vl-view>
          <route :route="settings.gpxData"/>

          <vl-layer-tile>
            <!-- vl-source-xyz url="https://b.tile.openstreetmap.org/{z}/{x}/{y}.png" crossOrigin="anonymous"></vl-source-xyz -->
            <vl-source-xyz url="http://dohren.synology.me/proxy.php?tile={z}/{x}/{y}" crossOrigin="anonymous"></vl-source-xyz>
          </vl-layer-tile>

          <!-- vl-layer-tile>
            <component :is="'vl-source-osm'" v-bind="layer"></component>
          </vl-layer-tile -->  

          <!-- vl-feature>
            <vl-geom-point :coordinates="this.center"></vl-geom-point>
          </vl-feature -->
    
          <vl-layer-vector> 
              <vl-feature>
                <vl-geom-line-string :coordinates="this.tracking"></vl-geom-line-string>
              </vl-feature>
              <vl-style-box>
                <vl-style-fill color="rgba(255, 255, 255, 0.2)"></vl-style-fill>
                <vl-style-stroke color="green" :width="3"></vl-style-stroke>
              </vl-style-box>
          </vl-layer-vector>

        
          <vl-geoloc @update:position="onUpdatePosition">
            <template slot-scope="geoloc">
              <vl-feature v-if="geoloc.position" id="position-feature">
                <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>

                <vl-style-box>
                  <!-- vl-style-circle  radius=5>
                      <vl-style-fill color="rgba(255, 255, 255, 0.2)"></vl-style-fill>
                      <vl-style-stroke color="green" :width="3"></vl-style-stroke>
                  </vl-style-circle -->
                  <vl-style-icon  src="./assets/marker.png" :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
                </vl-style-box>
              </vl-feature>
            </template>
          </vl-geoloc>
        </vl-map> 

        <kaiui-softkeys
          ref="kaiuisoftkeys"
          :softkeys="softkeys"
          :component="softkeysComponent"
          @softkey-left-pressed="onZoomOut"
          @softkey-right-pressed="onZoomIn"
          @softkey-center-pressed="onFunctionKey"
        />

    </div>
</template>


<script>
import Route from './Route.vue';

export default {
  name: 'MapComponent',
  components: {
    Route
  },
  props: {
    showSettings: Boolean,
    msg: String,
    settings: Object
  },
  data: () => ({
    showMenu: false,
    center: [11.061859, 49.460983],
    position: [0,0],
    zoom: 16,
    onNavigation: false,
    titleNavigation: "Starte Navigation",
    delta: 0.0008,
    rotation: 0,
    lalala: 99,
    softkeys: {
          left: "-",
          center: 'Auswahl',
          right: "+",
    },
    softkeysComponent: {},
    softkeysDialog: {
      left: "abbr",
      center: "",
      right: "ok",
    },
    layer: [],
    features: [],
    tracking: [ [11.061859, 49.460983] ],
  }),
  created: function () {
  },
  updated: function () {
  },
  methods: {
    onZoomIn() {
      this.zoom++;
    },
     onZoomOut() {
       this.zoom--;
    },
    toggleMenu() {
      this.showMenu = false; 
    },
    showPosition(){
      this.showMenu = false;
      if (this.position[1] == 0) {
        alert("Position konnte nicht ermittelt werden. Bitte versuche es erneut.");
      }
      else {
        this.center = this.position;
        this.zoom = 16;
      }
    },
    openSettings() {
      this.showMenu = false;
      this.$emit('openSettings');
    },
    startNavigation(){
      this.showMenu = false;
      if (this.position[1] == 0) {
        alert("Position konnte nicht ermittelt werden. Bitte versuche es erneut.");
      }
      else if (!this.onNavigation) {
        this.onNavigation = true;
        this.titleNavigation = "Stoppe Navigation";
        this.vueInsomnia().on()
        this.showToast("Navigation gestartet");
      } 
      else {
        this.onNavigation = false;
        this.titleNavigation = "Starte Navigation";
        this.vueInsomnia().off();
        this.showToast("Navigation gestoppt");
      }
    },
    onFunctionKey() {     
      if (!this.showMenu){
          this.showMenu = true;
          this.selectFirstElement();
        }       
      
    },
    onUpdatePosition(coordinate) {
      this.position = coordinate;
      
      if (this.onNavigation) {
        this.tracking.push(coordinate);
        this.center = this.position;
      }
    },

  },
  mounted() {
    
    let $vm = this;
    this.softkeysComponent = this.$refs.kaiuisoftkeys;

    window.addEventListener("keydown", function(e) {
      if (!$vm.showSettings && !$vm.showMenu && !$vm.showCloseDialog) {
        switch (e.key) {
          case "ArrowLeft":
              $vm.center = [$vm.center[0] - $vm.delta, $vm.center[1]];
              break;
          case "ArrowRight":
              $vm.center = [$vm.center[0] + $vm.delta, $vm.center[1]];
              break;
          case "ArrowUp":
              $vm.center = [$vm.center[0], $vm.center[1] + $vm.delta];
              break;
          case "ArrowDown":
              $vm.center = [$vm.center[0], $vm.center[1] - $vm.delta];
              break;
          
        }
      }
      switch (e.key) {
          case "Backspace":
              if ($vm.showMenu) {
                e.preventDefault();
                $vm.showMenu = false;
              }
              break;
          case "EndCall": 
            e.preventDefault();
            this.showToast("Bitte Zurück Button nutzen.");
            break;
      }
    });
  },
  watch: {
    zoom: function() {
      this.delta = 52.4288 / parseFloat(2 ** this.zoom);
    },
    showSettings: function (value) {
      this.showSettings = value;
      if (!this.showSettings) {
        this.showMenu = false;
      }
    }

  }
}
</script>

<style lang="sass">
  @import ~bulma/sass/utilities/_all

  html, body, #app
    width: 100%
    height: 100%
    margin: 0
    padding: 0

    .map
      height: 100%
      width: 100%

    .map-dialog
      height: 100%
      width: 100%

    .map-dialog .menu
      position: fixed 
      z-index: 2
      width: 100%
      height:100%
      background-color: rgba(0,0,0,0.5)

    .map-dialog .ol-zoom
      display: none

</style>