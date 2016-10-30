var evHub = require('./ev-hub');
var appVars = require('../app-vars');
const itemDrag = appVars.itemDrag;
module.exports = {
  props:{
    item:Object
  },
  template:'<div ref="item" class="item"  draggable="true" @dragstart="dragItem" @drop="dropItem" @contextmenu="showItemMenu">'+
    '<div class="item-icon" :style="{\'background-image\':\'url(\'+item.icon+\')\'}"></div>'+
    '<div class="item-body" v-text="item.name" @dblclick="openItem" ></div>'+
  '</div>',
  methods:{
    openItem(){
      evHub.$emit('open-item', this.item);
    },
    showItemMenu(ev){
      evHub.$emit('show-item-menu', ev, this);
    },
    deleteItem(){
      evHub.$emit('delete-item', this.item);
    },
    dragItem(ev){
      var df = ev.dataTransfer;
      df.setData(itemDrag, itemDrag);
      df.setData('text/plain', this.item.path);
      appVars.dragItem = this.item;
    },
    dropItem(ev){
      if(!ev.dataTransfer.getData(itemDrag)){
        return;
      }
      ev.stopPropagation();
      var dragItem = appVars.dragItem;
      appVars.dragItem = null;
      var after;
      var ih = this.$refs.item.clientHeight /2;
      var point = ev.offsetY;
      after = (ih < point);
      evHub.$emit('dd-item', dragItem, this.item, after);
    }
  }
};