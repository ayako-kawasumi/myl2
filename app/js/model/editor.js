var _ = require('lodash');
var alphaMatch = /^[A-Z]$/;
var evHub = require('./ev-hub');
var iconGetter = require('../icon-getter');
module.exports = {
  name:'ItemEditorModel',
  template:'<transition name="editor">'+
    '<div v-show="show" class="item-editor-wrap" @drop.stop.prevent="replaceIcon">'+
      '<div class="item-editor">'+
        '<div><div class="editor-icon-wrap item-icon" :style="{\'background-image\':\'url(\'+item.icon+\')\'}"></div><div class="editor-icon-caption">{{$parent.mess.DROP_REPLACE_ICON}}</div></div>' + 
        '<div class="editor-line"><span class="editor-name">{{$parent.mess.NAME}}</span><input class="editor-field" v-model="item.name"></div>'+
        '<div class="editor-line"><span class="editor-name">{{$parent.mess.PATH}}</span><input class="editor-field" v-model="item.path"></div>'+
        '<div class="editor-line"><span class="editor-name">{{$parent.mess.BY}}</span><input class="editor-field" v-model="item.by"></div>'+
        '<div class="editor-line"><span class="editor-name">{{$parent.mess.CMD}}</span><input class="editor-field" v-model="item.cmd"></div>'+
        '<div class="editor-line"><span class="editor-name">{{$parent.mess.SHORTCUTKEY}}</span>'+
          '<div class="editor-field" style="text-align:center">'+
          '<label><input class="sc-key" v-model="item.scKey.ctrl" type="checkbox"><span class="sc-key-ui">Ctrl</span></label>'+
          '<label><input class="sc-key" v-model="item.scKey.alt" type="checkbox"><span class="sc-key-ui">Alt</span></label>'+
          '<label><input class="sc-key" v-model="item.scKey.shift" type="checkbox"><span class="sc-key-ui">Shift</span></label>'+
          '<input maxlength="10" v-model="item.scKey.key" class="sc-ikey" type="text" @keydown.prevent.stop="inputKey"><input class="clear-shortcut" :title="$parent.mess.CLEAR_SHORTCUT" type="button" value="x" @click="clearShortCut"></div>'+
        '<div class="editor-btns">'+
          '<input class="editor-regist" type="button" value="Save(Ctrl+S)" @click="regist">'+
          '<input class="editor-cancel" type="button" value="Cancel(ESC)" @click="closeEditor" >'+
        '</div>'+ 
      '</div>' +
    '</div>'+
  '</transition>',
  data(){
    return {
      show:false,
      itemVm:null,
      item:{scKey:{}}
    };
  },
  created(){
    evHub.$on('edit-item', this.editItem);
    evHub.$on('press-key', this.pressKey);
  },
  methods:{
    editItem(vm){
      this.show = true;
      this.itemVm = vm;
      this.item = JSON.parse(JSON.stringify(vm.item));
    },
    scCheck(){
      var sc = this.item.scKey;
      var key = sc.key;
      if(!key){
        return true;
      }
      if(alphaMatch.test(key)){
        key = key.toLowerCase();
      }
      sc.key = key;
      var alt = sc.alt;
      var ctrl = sc.ctrl;
      var shift = sc.shift;
      var some = [alt, ctrl, shift].some(k=>k);
      if(!some){
        evHub.$emit('notify-message', this.$parent.mess.REQUIRE_CTRL_KEY);
        return false;
      }
      return true;
    },
    pressKey(ev){
      if(!this.show){
        return;
      }
      var kc = ev.which;
      if(kc === 27){
        return this.closeEditor();
      }
      if(ev.ctrlKey && kc === 83/*S*/){
        this.regist();
      }
    },
    regist(){
      if(!this.scCheck()){
        return;
      }
      var scm = require('../shortcut-manager');
      scm.removeItem(this.itemVm.item);
      _.merge(this.itemVm.item,this.item);
      scm.importItem(this.itemVm.item);
      evHub.$emit('notify-message', this.$parent.mess.SAVED);
      this.closeEditor();
    },
    closeEditor(){
      this.show = false;
    },
    replaceIcon(ev){
      var files = ev.dataTransfer.files;
      if(files.length === 0){
        return;
      }
      if(files.length >= 2){
        return evHub.$emit('notify-message', this.$parent.mess.ALLOW_ONLY_ONE_FILE);
      }
      var file = files[0];
      iconGetter(file.path)
      .then(iconString=> this.item.icon = iconString);
    },
    inputKey(ev){
      var key = ev.key;
      if(!key){
        return;
      }
      var scKey = this.item.scKey;
      if(key === 'Shift'){
        return scKey.shift = !scKey.shift;
      }
      if(key === 'Alt'){
        return scKey.alt = !scKey.alt;
      }
      if(key === 'Control'){
        return scKey.ctrl = !scKey.ctrl;
      }
      this.item.scKey.key = key;
    },
    clearShortCut(){
      this.item.scKey = {
        alt:'',
        ctrl:'',
        shift:'',
        key:''
      };
    }
  }
};