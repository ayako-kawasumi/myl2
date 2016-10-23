var evHub = require('./ev-hub');
var DURING = 3500;
module.exports = {
  template:'<transition name="notify">'+
    '<div v-if="show" class="notify" v-text="m" :class="cls"></div>'+
    '</transition>',
  data(){
    return {
      show:false,
      m:'',
      cls:'',
      ev:null
    };
  },
  created(){
    evHub.$on('notify-message',this.notify);
  },
  methods:{
    notify(m, cls = 'info'){
      clearTimeout(this.ev);
      this.m =m;
      this.cls = cls;
      this.show = true;
      this.ev = setTimeout(this.close,DURING);
    },
    close(){
      this.show = false;
    }
  }
};