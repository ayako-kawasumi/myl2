var el = require('electron');
var {app,ipcMain} = el;
var path = require('path');
var mainWindow;

var already = app.makeSingleInstance(()=>{
  if(!mainWindow){
    return;
  }
  if(mainWindow.isMinimized()){
    mainWindow.restore();
  }
  mainWindow.focus();
});
if(already){
  app.quit();
}

var gip = require('./js/gip-wrapper');

ipcMain.on('get-icon',(()=>{
  var fromCharCode = String.fromCharCode;
  function btoa(str){
    return new Buffer(str.toString(), 'binary').toString('base64');
  }
  return (ev,itemPath)=>{
    var iconStr, iconBuf;
    try{
      iconBuf = gip.getSmallIcon(itemPath);
      iconStr = `data:image/png;base64,${btoa(fromCharCode.apply(null, iconBuf))}`;
    }catch(e){
      console.error(e);
    }
    ev.sender.send('return-icon', iconStr);
  };
})());

var gsh =el.globalShortcut;
ipcMain.on('set-global-shortcut', (ev, keypath)=>{
  gsh.unregisterAll();
  if(!keypath){
    return;
  }
  var sender = ev.sender;
  gsh.register(keypath,()=>sender.send('call-global'));
});

global.ROOTDIR = __dirname;

app.on('ready', ()=>{
  var wopt = {
    height:230,
    width:320,
    show:false,
    frame:false,
    resizable:false,
    icon:path.join(__dirname, 'img/myl.ico')
  };
  var BrowserWindow = el.BrowserWindow;
  mainWindow = new BrowserWindow(wopt);
  mainWindow.loadURL(path.join(__dirname, 'html', 'main.html'));
  mainWindow.on('close',()=>app.quit());
});

