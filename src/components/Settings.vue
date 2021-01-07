<template>
  <div class="settings">
   <kaiui-tabs>

      <kaiui-tab-item name="Einstellungen" selected>
        <kaiui-button
          v-bind:softkeys="softkeys"
          v-on:softRight="phoneButtonSoftRightClicked"
          v-on:softCenter="phoneButtonSoftCenterClicked"
          title="Zurück zur Karte"
        />

        <kaiui-button 
          v-bind:softkeys="softkeys"
          v-on:softCenter="onFileBrowser" 
          title="Strecke importieren" 
        />

        <kaiui-dialog
          title="Auswahl"
          v-model="showFileBrowser"
          v-bind:softkeys="softkeysDialog"
          v-on:="valueSelectorDialogLeftSelected"
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

      <kaiui-tab-item name="Dialogs" selected>
        <kaiui-button title="Dialog" v-on:softCenter="showDialog" />

        <kaiui-button icon="ion-android-calendar" title="ToDo: Date/Time Selector" />

        <kaiui-dialog
          title="Congratulations"
          v-bind:softkey="softkeysDialog"
          v-model="shouldShowDialog"
          v-on:softLeft="dialogLeftSelected"
          v-on:softRight="dialogRightSelected"
        >
          <kaiui-text text="You have successfully signed in. Good Job!" />
        </kaiui-dialog>
      </kaiui-tab-item>

      <kaiui-tab-item name="Controls">
        <kaiui-separator title="Radio button" />
        <kaiui-radiogroup v-model="selectedInputValue">
          <kaiui-radiobutton value="One" primaryText="Radio button 'One'" />
          <kaiui-radiobutton
            value="Two"
            primaryText="Radio button 'Two'"
            secondaryText="Subtitle for Radio button"
          />
          <kaiui-radiobutton
            value="Three"
            primaryText="Radio button 'Three'"
            secondaryText="Subtitle for Radio button"
          />
        </kaiui-radiogroup>
        <kaiui-text v-bind:text="'> Selected: '+selectedInputValue" />

        <kaiui-separator title="Checkbox" />
        <kaiui-checkbox primaryText="Checkbox Item Title" />
        <kaiui-checkbox
          primaryText="Checkbox Item Title"
          secondaryText="Subtitle for Checkbox List Item Title"
        />
        <kaiui-checkbox
          primaryText="Checkbox Item Title"
          secondaryText="Subtitle for Checkbox List Item Title"
        />
      </kaiui-tab-item>

      <kaiui-tab-item name="List Items">
        <kaiui-list-item primaryText="List Item Title" />
        <kaiui-list-item primaryText="List Item Title" iconLeft="ion-android-download" />
        <kaiui-list-item
          primaryText="List Item Title"
          secondaryText="Subtitle for List Item Title"
        />
        <kaiui-list-item
          primaryText="List Item Title"
          secondaryText="Subtitle for List Item Title"
          iconLeft="ion-android-contacts"
          iconRight="none"
        />
        <kaiui-list-item primaryText="List Item Title" iconLeft="ion-android-favorite" />
        <kaiui-list-item
          primaryText="List Item Title"
          secondaryText="Subtitle for List Item Title"
          tertiaryText="Very very long Tertiary Text for List Item Title"
          iconLeft="ion-android-calendar"
          iconRight="ion-android-favorite"
        />
      </kaiui-tab-item>

      <kaiui-tab-item name="Inputs">
        <kaiui-separator title="Inputs" />
        <kaiui-input v-on:input="onInputChanged" label="Add a Task" placeholder="New Item" />
        <kaiui-text v-bind:text="inputFieldText" />

        <kaiui-separator title="Multiline Input" />
        <kaiui-input-multi v-on:input="onMultiInputChanged" label="Title" placeholder="More Items" />
        <kaiui-text v-bind:text="multiInputFieldText" />
      </kaiui-tab-item>

      <kaiui-tab-item name="Slider & Progress">
        <kaiui-separator title="Slider" />
        <kaiui-slider
          title="Alarm"
          v-bind:startValue="sliderStartValue"
          v-on:change="sliderValueChanged"
          v-bind:minValue="0"
          v-bind:maxValue="20"
          v-bind:step="0.5"
        />
        <kaiui-text v-bind:text="sliderTextValue" />

        <kaiui-separator title="Progress" />
        <kaiui-text text="ToDo.." />
      </kaiui-tab-item>
    </kaiui-tabs>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  data: () => ({
    softkeysPhone: { left: "What's App", center: "Call", right: "SMS" },
    inputFieldText: "...",
    multiInputFieldText: "...",
    sliderStartValue: 10,
    sliderTextValue: "Slider value is 10",
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
    toggleSoftkeys(input) {
      this.showToast(input);
    },
    phoneButtonSoftRightClicked() {
      this.showToast("SMS send!");
    },
    phoneButtonSoftCenterClicked() {
      this.$emit('closeSettings', this.settings);
    },
    toggleToastButtonSoftCenterClicked() {
      this.showToast("Hi, I'm a Toast!");
    },
    sliderValueChanged(value) {
      this.sliderTextValue = "Slider value is " + value;
    },
    onInputChanged(newValue) {
      this.inputFieldText = newValue;
    },
    onMultiInputChanged(newValue) {
      this.multiInputFieldText = newValue;
    },
 
    valueSelectorDialogRightSelected() {
      this.showToast("Dialog 'OK' selected");
    },
    valueSelectorDialogLeftSelected() {
      this.showToast("Dialog 'Cancel' selected");
    },
    showDialog() {
      this.shouldShowDialog = !this.shouldShowDialog;
    },
    dialogRightSelected() {
      this.showToast("Dialog 'OK' selected");
    },
    dialogLeftSelected() {
      this.showToast("Dialog 'Cancel' selected");
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
      this.selectFirstElement();

      request.onerror = function () {
        console.warn("Unable to get the file: " + this.error);
      }
      
    },
    onFileBrowser() {
      
      this.sdcard = navigator.getDeviceStorage('sdcard');
      // var request = sdcard.get("happurg.gpx");
      
      var param = {
          since: new Date((+new Date()) - 7*24*60*60*1000),
      }

      var cursor = this.sdcard.enumerate(param);

      cursor.onerror = function (event) {
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
