<template>
    <div class="map-dialog">
        <vl-map  class="map" ref="map" :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:4326" >
          <!-- map view aka ol.View -->
          <vl-view ref="view"  ></vl-view>

          <vl-layer-tile>
            <component :is="'vl-source-osm'" v-bind="layer"></component>
          </vl-layer-tile>   
        </vl-map>
        <div class="kaiui-softkeys">
            <span class="kaiui-h5 kaiui-left" v-on:click="onClickLeft">{{
            left
            }}</span>
            <span class="kaiui-p_link kaiui-center-spacer"></span>
            <span class="kaiui-h5 kaiui-right" v-on:click="onClickRight">{{
            right
            }}</span>
        </div>       
    </div>
</template>

<script>

  const methods = {
    onClickLeft() {
        alert('left');
    },
     onClickRight() {
        alert('right');
    }
  }

export default {
  name: 'MapComponent',
  props: {
    msg: String
  },
  data: () => ({
      left: "links",
      right: "rechts"
  }),
  created: function () {
  },
  layers: [
    
  
  ],
  methods: methods

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
    
</style>