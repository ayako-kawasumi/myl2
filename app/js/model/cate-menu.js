var OFFSET = 5;
var evHub = require('./ev-hub');
module.exports = {
  template:'<transition name="cxtmenu">'+
    '<div v-show="show" class="cate-menu" :style="{top,left}" @mouseleave="closeMe" ref="menu">'+
      '<div class="cate-menu-name" v-text="targetVm.cate.name"></div>'+
      '<div class="menu-item" v-text="$parent.mess.RENAME" @click="rename"></div>'+
      '<div class="menu-item" v-text="$parent.mess.DELETE" @dblclick="remove"></div>'+
    '</div>' + 
  '</transition>',
  data(){
    return {
      show:false,
      targetVm:{cate:''},
      x:0,
      y:0
    };
  },
  created(){
    evHub.$on('show-cate-menu', this.showMe);
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
        var limitY = document.documentElement.clientHeight - this.$refs.menu.clientHeight;
        var tp = this.y;
        this.y = Math.min(limitY, tp) - OFFSET;
      });
      this.show = true;
    },
    closeMe(){
      this.show = false;
    },
    rename(){
      this.targetVm.rename();
      this.closeMe();
    },
    remove(){
      evHub.$emit('remove-cate', this.targetVm.cate);
      this.closeMe();
    }
  }
};