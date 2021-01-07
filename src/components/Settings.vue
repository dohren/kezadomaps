<template>
  <div class="settings">
   <kaiui-tabs>

      <kaiui-tab-item name="Einstellungen" selected>
        <kaiui-button
          v-bind:softkeys="softkeys"
          v-on:softCenter="phoneButtonSoftCenterClicked"
          title="Zurück zur Karte"
        />

        <kaiui-button 
          v-bind:softkeys="softkeys"
          v-on:softCenter="onFileBrowser" 
          title="Route importieren" 
        />

        <kaiui-dialog
          title="Auswahl"
          v-model="showFileBrowser"
          v-bind:softkeys="softkeysDialog"
        >

          <kaiui-list-item 
            :primaryText="file" 
            v-bind:softkeys="softkeysDialog"
            v-bind:key="file.name"
            v-on:softCenter="onFileSelect(file)"
            v-for="file in files" 
          />

        </kaiui-dialog>
      </kaiui-tab-item>

 
    </kaiui-tabs>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  data: () => ({
    shouldShowDialog: false,
    showFileBrowser: false,
    selectedInputValue: "Two",
    files: [],
    sdcard: null,
    softkeys: {
      left: "-",
      center: 'Auswahl',
      right: "+",
    },
    softkeysDialog: {
      left: "abbr",
      center: 'Auswahl',
      right: "",
    },
    settings: {
      gpxData: null
    }
  }),
  methods: {
    phoneButtonSoftCenterClicked() {
      this.$emit('closeSettings', this.settings);

    },
    onFileSelect(filename) {
      this.showFileBrowser = !this.showFileBrowser;
        
      var request = this.sdcard.get(filename);
      
      let $vm = this;
      
      request.onsuccess = function () {
        var file = this.result;
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
          console.log("start " + $vm.settings);
          $vm.settings.gpxData = event.target.result;
          console.log($vm.settings);
        }
        fileReader.readAsText(file);
      }

      request.onerror = function () {
        console.warn("Unable to get the file: " + this.error);
      }
    },
    onFileBrowser() {
      
      try{
         this.sdcard = navigator.getDeviceStorage('sdcard');
      }
      catch(err){
        this.showToast(err.mesage);
        console.log(err.message);
        return;
      }
      // var request = sdcard.get("happurg.gpx");
      
      var param = {
          since: new Date((+new Date()) - 7*24*60*60*1000),
      }

      var cursor = this.sdcard.enumerate(param);

      cursor.onerror = function (event) {
        this.showToast("SDCard nicht gefunden!");
        console.log(event);
      }

      var temp = [];
      cursor.onsuccess = function () {
          if (this.result) {
              var file = this.result;
              console.log("File updated on: " + file.lastModifiedDate);
              console.log(file.name);
              var filename = file.name.substring(file.name.lastIndexOf("/") + 1, file.name.length);
              
              if (filename.includes(".gpx")){
                temp.push(filename);
              }

              this.continue();
          }
      }
      this.files = temp;

      if ( temp.length < 1 ) {
        this.showFileBrowser = !this.showFileBrowser;
      }
      else {
          this.showToast("Keine Karten gefunden.");
      }

       /*
      this.showNotice(
        "ion-battery-charging",
        "Battery Full",
        "Battery is fully charged"
      );
      */
    }
  },
  mounted() {
    
  }
};
</script>

<style>

:root {
  --primary-color: red;
  --primary-dark-color: darkred;
}

.settings {
  position: fixed;
  z-index: 5;
  width: 100%;
  height:100%;
  background-color: rgba(0,0,0,0.9);
}

.kaiui-dialog-wrapper {
  padding-bottom: 30px;
}

</style>
