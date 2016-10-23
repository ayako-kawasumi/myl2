var el = require('electron');
var appVers = require('./app-vars');
var remote = el.remote;
var thisWindow = remote.getCurrentWindow();
var messages = require('./messages');
thisWindow.on('pass-config', vueInit);
function vueInit(_config){
  var config = JSON.parse(JSON.stringify(_config));
  new Vue({
    el:'#content',
    data:{
      version:appVers.VERSION,
      mess:{},
      config
    },
    mounted(){
      this.mess = messages[this.config.lang];
      thisWindow.show();
    },
    watch:{
      'config.lang'(v){
        this.mess = messages[v];
      }
    },
    methods:{
      save(){
        thisWindow.emit('update-config', this.config);
        this.close();
      },
      close(){
        window.close();
      }
    }
  });
}