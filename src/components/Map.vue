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
            <component :is="'vl-source-osm'" v-bind="layer"></component>
          </vl-layer-tile>  

          <vl-feature>
            <vl-geom-point :coordinates="this.center"></vl-geom-point>
          </vl-feature>

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
          @softkey-center-pressed="onFunctionKey"
        />


    </div>
</template>


<script>
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import GPX from 'ol/format/GPX'; 

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
    lalala: 99,
    url: 'assets/ruppertsklamm.gpx',
    softkeys: {
          left: "-",
          center: 'Position',
          right: "+",
    },
    softkeysComponent: {},
    layer: [],
    features: [],
    tracking: [                 
    ],
  }),
  created: function () {
  },
  methods: {
    onZoomIn() {
      this.zoom++;
    },
     onZoomOut() {
       this.zoom--;
    },
    onFunctionKey() {
      console.log(this.position);
      if (this.position[1] == 0) {
        alert("Postiion konnte nicht ermittelt werden. Bitte versuche es erneut.");
      }
      else {
        if (this.softkeys.center == "POSITION") {
          this.softkeys.center = "Start";
          this.center = this.position;
          this.zoom = 16;
        }
        else if (this.softkeys.center == "Start") {
          this.softkeys.center="Stop";
        }
        else {
          this.softkeys.center = "POSITION";
        }
      }
    },
    onUpdatePosition(coordinate) {
      this.tracking.push(coordinate);
      this.position = coordinate;
      if (this.softkeys.center == "Stop") {
        this.center = this.position;
        this.zoom = 16;
      }

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

    var layer = new VectorLayer({
    source: new VectorSource({
        format: new GPX(),
        url: 'assets/test.gpx',
      }),
      style: function(feature) {
        return style[feature.getGeometry().getType()];
      }
    });
    layer.setZIndex(20);

    let map = this.$refs.map;
    map.addLayer(layer);
  },
  watch: {
    zoom: function() {
      this.delta = 52.4288 / parseFloat(2 ** this.zoom);
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