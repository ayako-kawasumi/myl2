
var evHub = require('./ev-hub');
var appVars = require('../app-vars');
const cateDrag = appVars.cateDrag;
const itemDrag = appVars.itemDrag;
module.exports = {
  name:'CateMenuModel',
  props:{
    cate:Object,
    selected:{
      type:Boolean,
      default:false
    }
  },
  data(){
    return {
      editmode:false,
      tmpName:'',
      importEffect:false
    };
  },
  template:'<div ref="cate" :class="{selected:selected,impitem:importEffect}" @click="selectIt" '+
    '@animationend="importedItem" @contextmenu="showMenu" draggable="true" @dragstart="dragCate" @drop="dropCate" ' + 
  'class="cate" >'+
    '<span v-if="!editmode" v-text="cate.name"></span>' +
    '<input v-else ref="nameinput"  @focusout="renameDone" @keydown.enter="renameDone" @keydown.stop '+
    'class="cate-name-input" v-model="tmpName">' +
  '</div>',
  methods:{
    selectIt(){
      evHub.$emit('select-cate', this.cate);
    },
    showMenu(ev){
      evHub.$emit('show-cate-menu', ev, this);
    },
    rename(){
      this.tmpName = this.cate.name;
      this.editmode = true;
      Vue.nextTick(()=>{
        this.$refs.nameinput.select();
      });
    },
    renameDone(){
      if(!this.tmpName){
        evHub.$emit('notify-message', this.$parent.mess.REQUIRE_NAME);
      }
      this.cate.name = this.tmpName || this.cate.name;
      this.editmode = false;
    },
    remove(){
      evHub.$emit('remove-cate', this.cate);
    },
    dragCate(ev){
      var df = ev.dataTransfer;
      df.setData(cateDrag, cateDrag);
      appVars.dragCate = this.cate;
    },
    dropCate(ev){
      var df = ev.dataTransfer;
      var isCateDrag = df.getData(cateDrag);
      var isItemDrag = df.getData(itemDrag);
      if(!isCateDrag && !isItemDrag){
        return;
      }
      ev.stopPropagation();
      if(isCateDrag){
        var cateEl = this.$refs.cate;
        var after;
        var ch = cateEl.clientHeight / 2;
        var evY = ev.offsetY;
        after = (evY > ch);
        var targetCate = appVars.dragCate;
        appVars.dragCate = null;
        evHub.$emit('dd-cate',targetCate,  this.cate,after);
      }else if(isItemDrag){
        if(this.selected){
          return;
        }
        var dragItem = appVars.dragItem;
        evHub.$emit('dd-item-to-cate', dragItem, this.cate);
        //for only effect
        this.importItem();
      }
    },
    importItem(){
      this.importEffect = true;
    },
    importedItem(){
      this.importEffect = false;
    }
  }
};