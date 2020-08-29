<template>
    <div class="map-dialog" >
        <vl-map class="map" ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326" >
          <!-- map view aka ol.View -->
          <vl-view 
            ref="view" 
            :center.sync="center" 
            :zoom.sync="zoom" >
          </vl-view>

          <vl-layer-tile>
            <component :is="'vl-source-osm'" v-bind="layer">rwar</component>
          </vl-layer-tile>   

          <vl-geoloc @update:position="onUpdatePosition">
            <template slot-scope="geoloc">
              <vl-feature v-if="geoloc.position" id="position-feature">
                <vl-geom-point :coordinates="geoloc.position"></vl-geom-point>
                <vl-style-box>
                  <vl-style-icon src="./assets/marker.png" :scale="0.4" :anchor="[0.5, 1]"></vl-style-icon>
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
          @softkey-center-pressed="onPosition"
        />
    </div>
</template>

<script>

export default {
  name: 'MapComponent',
  props: {
    msg: String,
    
  },
  data: () => ({
    center: [11.061859, 49.460983],
    position: [0,0],
    zoom: 16,
    delta: 0.0008,
    rotation: 0,
    softkeys: {
          left: "-",
          center: 'Position',
          right: "+",
    },
    softkeysComponent: {},
    geolocation: [0,0],
    layer: []
  }),
  created: function () {
  },
  methods: {
    softkeyLeftPressed() {
      alert("es funktioniert");
    },
    onZoomIn() {
      this.zoom++;
    },
     onZoomOut() {
       this.zoom--;
    },
    onPosition() {
      this.center = this.position;
      this.zoom = 16;
    },
    onUpdatePosition(coordinate) {
      this.position = coordinate;
    }
  },
  mounted() {
    let $vm = this;
    this.softkeysComponent = this.$refs.kaiuisoftkeys;
    window.addEventListener("keydown", function(e) {
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
    });
  },
  watch: {
    zoom: function() {
      this.delta = 52.4288 / parseFloat(2 ** this.zoom)
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
      margin-top: -18px

    .map-dialog .kaiui-softkeys 
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


    .map-dialog .kaiui-softkeys .kaiui-left,
      .kaiui-dialog .kaiui-softkeys .kaiui-right 
      color: var(--softkeys-text-color)
      overflow: hidden
      width: 100%
      letter-spacing: -0.5px
      box-sizing: border-box
      text-overflow: ellipsis

    .map-dialog .ol-zoom-in, .map-dialog .ol-zoom-out
      display: none


</style>