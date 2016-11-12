const MINHEIGHT = 230;
var shortcutReg = /.lnk$/i;
var _ = require('lodash');
var openItem = require('../open-item');
var iconGetter = require('../icon-getter');
var appMessages = require('../messages');
var fs = require('fs');
var path = require('path');
var callGlobal = require('../call-global');
class Category{
  constructor(_name){
    this.name = _name;
    this.items = [];
    this.scKey = '';
  }
}
class Item{
  constructor(opts){
    this.name = opts.name;
    this.path = opts.path;
    this.icon = '';
    this.cmd = '';
    this.isUrl = opts.isUrl;
    this.by = '';
    this.scKey = {};
  }
}
class MylConfig{
  constructor(opts){
    this.lang = 'en';
    this.alwaysOnTop = false;
    this.minimize = false;
    this.fontSize = 13;
    this.globalSCKey = '';
    this.theme = {};
    if(opts){
      _.merge(this,opts);
    }
  }
}
var el = require('electron');
var shell = el.shell;
var convertItem = require('../convert-item');
var appVars = require('../app-vars');
var cateDrag = appVars.cateDrag;
var itemDrag = appVars.itemDrag;
var remote = el.remote;
var thisWindow = remote.getCurrentWindow();
var evHub = require('./ev-hub');
var model = {
  el:'#content',
  data:{
    cates:[],
    selectedCate:null,
    config:new MylConfig(),
    mess:{}
  },
  created(){
    evHub.$on('add-new-cate', this.addNewCate);
    evHub.$on('open-item', this.openItem);
    evHub.$on('open-parent', this.openParent);
    evHub.$on('select-cate', this.selectCate);
    evHub.$on('remove-item', this.removeItem);
    evHub.$on('remove-cate', this.removeCate);
    evHub.$on('dd-cate', this.DDCate);
    evHub.$on('dd-item', this.DDItem);
    evHub.$on('dd-item-to-cate', this.DDItemToCate);
    this.init();
  },
  watch:{
    'config.alwaysOnTop'(v){
      thisWindow.setAlwaysOnTop(v);
    },
    'config.lang'(v){
      this.mess = appMessages[v];
    },
    'config.theme'(v){
      var setTheme = require('../set-theme');
      setTheme(v);
    },
    selectedCate(v){
      var ind = _.indexOf(this.cates, v);
      localStorage.setItem('selected', ind);
      this.adjustWindow();
    }
  },
  computed:{
    selectedItems(){
      return this.selectedCate?this.selectedCate.items:[];
    }
  },
  methods:{
    pressKey(ev){
      evHub.$emit('press-key', ev);
    },
    addNewCateDialog(){
      evHub.$emit('show-add-new-cate-dialog');
    },
    addNewCate(_name){
      var newCate = new Category(_name);
      this.cates.push(newCate);
      this.selectedCate = newCate;
    },
    DDCate(src, dest, after){
      if(src === dest){
        return;
      }
      var si = this.cates.indexOf(src);
      this.cates.splice(si, 1);
      if(!dest){
        return this.cates.push(src);
      }
      var di = this.cates.indexOf(dest);
      if(after){
        di++;
      }
      this.cates.splice(di, 0, src);
    },
    DDCateWrap(ev){
      if(!ev.dataTransfer.getData(cateDrag)){
        return;
      }
      ev.stopPropagation();
      var dragCate = appVars.dragCate;
      if(!dragCate){
        return;
      }
      this.DDCate(dragCate);
    },
    DDItem(src, dest, after){
      if(src===dest){
        return;
      }
      var items = this.selectedCate.items;
      var si = items.indexOf(src);
      items.splice(si, 1);
      if(!dest){
        return items.push(src);
      }
      var di = items.indexOf(dest);
      if(after){
        di++;
      }
      items.splice(di, 0, src);
    },
    DDItemWrap(ev){
      var isItemDrag = ev.dataTransfer.getData(itemDrag);
      if(!isItemDrag){
        return;
      }
      ev.stopPropagation();
      this.DDItem(appVars.dragItem);
    },
    DDItemToCate(item, cate){
      var src = this.selectedCate.items;
      var si  =src.indexOf(item);
      src.splice(si, 1);
      cate.items.push(item);
    },
    dropFile(ev){
      var df = ev.dataTransfer;
      if(df.getData(cateDrag) || df.getData(itemDrag)){
        return;
      }
      var files = ev.dataTransfer.files;
      if(files.length){
        var paths = Array.prototype.map.call(files, file=> file.path);
        paths.forEach(f =>{
          if(shortcutReg.test(f)){
            if(!ev.ctrlKey){
              f = shell.readShortcutLink(f).target;
              evHub.$emit('notify-message', this.mess.WITH_CTRL_TARGET_SC);
            }
          }
          this.addFileToCate(f);
        });
        return;
      }
      var url = ev.dataTransfer.getData('text');
      this.addFileToCate(url);
    },
    addFileToCate(itemPath){
      if(!this.selectedCate){
        return evHub.$emit('notify-message', this.mess.CATEGORY_NOT_SELECTED, 'error');
      }
      var item = convertItem(itemPath);
      var newItem = new Item(item);
      this.selectedCate.items.push(newItem);
      iconGetter(item.path)
      .then(iconUrl=>newItem.icon = iconUrl);
    },
    init(){
      document.addEventListener('keydown',this.pressKey);
      this.loadConfig()
      .then(()=>{
        this.mess = appMessages[this.config.lang];
        callGlobal(this.config.globalSCKey, this.callGlobal);
      });
      this.loadCate().then(()=>{
        var ind = localStorage.getItem('selected');
        if(!ind){
          return;
        }
        ind = +ind;
        var lastSelect = this.cates[ind];
        if(!lastSelect){
          return;
        } 
        this.selectedCate = lastSelect;
        var scManager = require('../shortcut-manager');
        scManager.importAll(this.cates);
        evHub.$on('press-key', scManager.emit);
        return this.adjustWindow();
      }).then(()=>{
        var setTheme = require('../set-theme');
        setTheme(this.config);
        thisWindow.show();
      });
    },
    openSetting(){
      var wopt = {
        height:400,
        width:400,
        parent:thisWindow,
        modal:true,
        show:false,
        frame:false
      };
      var w = new remote.BrowserWindow(wopt);
      w.loadURL(path.join(appVars.HTMLDIR, 'setting.html'));
      w.once('ready-to-show', ()=>{
        var wpos = thisWindow.getPosition();
        w.setPosition(wpos[0], wpos[1]);
        w.emit('pass-config',this.config);
      });
      w.on('update-config',newConfig=>{
        _.merge(this.config,newConfig);
        this.saveConfig();
      });
    },
    closeApp(){
      window.close();
    },
    toggleAlwaysOnTop(){
      this.config.alwaysOnTop = !this.config.alwaysOnTop; 
    },
    removeItem(item){
      var ind = this.selectedCate.items.indexOf(item);
      this.selectedCate.items.splice(ind, 1);
    },
    removeCate(cate){
      var ind = this.cates.indexOf(cate);
      this.cates.splice(ind, 1);
    },
    loadCate(){
      var saveFile = appVars.SAVEFILE;
      return new Promise(res=>{
        fs.readFile(saveFile, 'utf8', (er,json)=>{
          if(!er){
            try{
              this.cates = JSON.parse(json);
            }catch(e){
              /*ignore*/
            }
          }else{
            var beforeVersionData = require('../import-before-version')();
            if(beforeVersionData){
              this.cates = beforeVersionData;
              this.saveCate();
            }
          }
          this.$watch('cates',()=>{
            this.saveCate();
            this.adjustWindow();
          },{
            deep:true
          });
          res();
        });
      });
    },
    saveCate(){
      var saveFile = appVars.SAVEFILE;
      fs.writeFile(saveFile, JSON.stringify(this.cates, 0, 1),'utf8', ()=>{});
    },
    selectCate(cate){
      this.selectedCate = cate;
    },
    loadConfig(){
      return new Promise(res=>{
        fs.readFile(appVars.CONFIGFILE, 'utf8',(er,  txt)=>{
          if(!er){
            _.merge(this.config,JSON.parse(txt));
          }
          res();
        });
      });
    },
    saveConfig(){
      fs.writeFile(appVars.CONFIGFILE, JSON.stringify(this.config, 0,1), 'utf8', _.noop);
    },
    openItem,
    openParent(item){
      this.openItem(path.dirname(item.path));
    },
    adjustWindow(){
      return new Promise(res=>{
        Vue.nextTick(()=>{
          var ch = this.$refs.catesec.scrollHeight;
          var ih = this.$refs.itemsec.scrollHeight;
          var h = Math.max(ch, ih);
          var hh = this.$refs.header.clientHeight;
          var thisWidth = thisWindow.getSize()[0];
          thisWindow.setSize(thisWidth, Math.max(h+hh,MINHEIGHT));
          res();
        });
      });
    },
    callGlobal(){
      /*window positioning to workarea*/
      var screen = el.screen;
      var point = screen.getCursorScreenPoint();
      var wSize = thisWindow.getSize();
      wSize = {
        w:wSize[0],
        h:wSize[1]
      };
      var dispArea = screen.getDisplayNearestPoint(point).workArea;
      var areaPoints = {
        x:dispArea.x,
        y:dispArea.y,
        xm:dispArea.x + (dispArea.width - wSize.w),
        ym:dispArea.y + (dispArea.height - wSize.h)
      };
      point.x -= wSize.w/2;
      point.y -= wSize.h/2;
      point.x = Math.max(point.x, areaPoints.x);
      point.y = Math.max(point.y, areaPoints.y);
      point.x = Math.min(point.x, areaPoints.xm);
      point.y = Math.min(point.y, areaPoints.ym);
      thisWindow.setPosition(point.x, point.y);
      thisWindow.focus();
    }
  },
  components:{
    'myl-cate':require('./cate'),
    'myl-item':require('./item'),
    'cate-menu':require('./cate-menu'),
    'item-menu':require('./item-menu'),
    'item-editor':require('./editor'),
    'br-selector':require('./bw-selector'),
    'notify-mess':require('./notify'),
    'add-new-cate':require('./add-new-cate')
  }
};
module.exports = new Vue(model);