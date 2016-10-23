var OFFSET = 5;
var evHub = require('./ev-hub');
module.exports = {
  template:'<transition name="cxtmenu">'+
    '<div v-show="show" class="item-menu" :style="{top,left}" @mouseleave="closeMe" ref="menu">'+
      '<div class="menu-item" v-text="$parent.mess.EDIT" @click="edit"></div>'+
      '<div class="menu-item" v-text="$parent.mess.OPEN_PARENT" @click="openParent"></div>'+
      '<div class="menu-item" v-text="$parent.mess.COPY_PATH" @click="copyPath"></div>'+
      '<div class="menu-item" v-text="$parent.mess.DELETE" @dblclick="remove"></div>'+
    '</div>' + 
  '</transition>',
  data(){
    return {
      show:false,
      targetVm:{item:''},
      x:0,
      y:0
    };
  },
  created(){
    evHub.$on('show-item-menu', this.showMe);
  },
  computed:{
    top(){
      return this.y +'px';
    },
    left(){
      return this.x-5 + 'px';
    }
  },
  methods:{
    showMe(ev, targetVm){
      this.targetVm = targetVm;
      this.x = ev.clientX - OFFSET;
      this.y = ev.clientY;
      Vue.nextTick(()=>{
        var de = document.documentElement;
        var limitY = de.clientHeight - this.$refs.menu.clientHeight;
        var limitX = de.clientWidth - this.$refs.menu.clientWidth;
        var tp = this.y;
        var tx = this.x;
        this.y = Math.min(limitY, tp) - OFFSET;
        this.x = Math.min(limitX, tx) - OFFSET;
      });
      this.show = true;
    },
    closeMe(){
      this.show = false;
    },
    edit(){
      this.closeMe();
      evHub.$emit('edit-item', this.targetVm);
    },
    openParent(){
      this.closeMe();
      evHub.$emit('open-parent', this.targetVm.item);
    },
    remove(){
      this.closeMe();
      evHub.$emit('remove-item', this.targetVm.item);
    },
    copyPath(){
      this.closeMe();
      var cb = require('electron').clipboard;
      cb.writeText(this.targetVm.item.path);
    }
  }
};