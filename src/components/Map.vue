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

        <vl-layer-tile>
          <!-- <vl-source-osm></vl-source-osm> -->
          <vl-source-xyz :url="'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png'"  :crossOrigin="'anonymous'"></vl-source-xyz>
        </vl-layer-tile>

        
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
          :component="this.softkeysComponent"
          @softkey-left-pressed="onZoomOut"
          @softkey-right-pressed="onZoomIn"
          @softkey-center-pressed="onFunctionKey"
        />

    </div>
</template>


<script>
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import GPX from 'ol/format/GPX'; 
import XYZ from 'ol/source/XYZ';
import TileLayer from 'ol/layer/Tile' 


export default {
  name: 'MapComponent',
  props: {
    showSettings: Boolean,
    msg: String,
    settings: Object
  },
  data: () => ({
    gpxLayer: null,
    showMenu: false,
    center: [11.061859, 49.460983],
    position: [0,0],
    zoom: 16,
    onNavigation: false,
    titleNavigation: "Starte Navigation",
    delta: 0.0008,
    rotation: 0,
    lalala: 99,
    url: '/sdcard/happurg.gpx',
    softkeys: {
          left: "-",
          center: 'Auswahl',
          right: "+",
    },
    softkeysComponent: {},
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
    createTileLayer(){
      let tileLayer = new TileLayer({
        source: new XYZ({
          //url: "http://dohren.synology.me/proxy.php?tile={z}/{x}/{y}",
          url: "https://b..openstreetmp.org/{z}/{x}/{y}.png",
          alpha: true, 
          isBaseLayer: false,
          tileOptions: {
            crossOriginKeyword: 'anonymous',
            transitionEffect: null
    }
        })
      })
      let map = this.$refs.map;
      map.addLayer(tileLayer);
  },
    createNavigationLayer() {
    let style = {
      'Point': new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: 'rgba(255,255,0,0.4)'
          }),
          radius: 5,
          stroke: new Stroke({
            color: '#f60404 	',
            width: 1
          })
        })
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: '#f60404 	',
          width: 3
        })
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: '#f60404 	',
          width: 3
        })
      })
    };

    this.gpxLayer = new VectorLayer({
    source: new VectorSource({
      format: new GPX(),
        url: 'assets/leer.gpx',
    }),
      style: function(feature) {
        return style[feature.getGeometry().getType()];
      }
    });
    this.gpxLayer.setZIndex(20);
    let map = this.$refs.map;
    map.addLayer(this.gpxLayer);
    }
  },
  mounted() {
    
    let $vm = this;
    this.softkeysComponent = this.$refs.kaiuisoftkeys;

    window.addEventListener("keydown", function(e) {
      if (!$vm.showSettings && !$vm.showMenu) {
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
      }
    });
    this.createTileLayer();
    this.createNavigationLayer();



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
    },
    settings: function (value) {
      let feature = (new GPX()).readFeatures(value.gpxData, {featureProjection: 'EPSG:3857'})
      console.log(feature);
      this.gpxLayer.getSource().clear();
      this.gpxLayer.getSource().addFeatures(feature);

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


    .ap-dialogm .kaiui-softkeys 
      position: absolute
      bottom: 0
      left: 0
      right: 0
      background: var(--secondary-dark-color)
      min-height: 30px
      max-height: 30px
      border-top: 2px var(--softkeys-border-color) solid
      display: flex
      flex-shrink: 0
      white-space: nowrap
      padding: 0 5px
      line-height: 26px

    .map-dialog .ol-zoom
      display: none

    .map-dialog .kaiui-softkeys .kaiui-left,
      .kaiui-dialog .kaiui-softkeys .kaiui-right 
      color: var(--softkeys-text-color)
      overflow: hidden
      width: 100%
      letter-spacing: -0.5px
      box-sizing: border-box
      text-overflow: ellipsis

</style>