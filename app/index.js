var el = require('electron');
var app = el.app;
var path = require('path');
var already = app.makeSingleInstance(()=>{});
var gip = require('./js/gip-wrapper');

var ipcMain = el.ipcMain;
var fromCharCode = String.fromCharCode;
function btoa(str){
  return new Buffer(str.toString(), 'binary').toString('base64');
}
ipcMain.on('get-icon', (ev,itemPath)=>{
  var iconStr, iconBuf;
  try{
    iconBuf = gip.getSmallIcon(itemPath);
    iconStr = `data:image/png;base64,${btoa(fromCharCode.apply(null, iconBuf))}`;
  }catch(e){
    console.error(e);
  }
  ev.sender.send('return-icon', iconStr);
});
var globalShortcut =el.globalShortcut;
ipcMain.on('set-global-shortcut', (ev, keypath)=>{
  globalShortcut.unregisterAll();
  if(!keypath){
    return;
  }
  var sender = ev.sender;
  globalShortcut.register(keypath,()=>sender.send('call-global'));
});

if(already){
  app.quit();
}
global.ROOTDIR = __dirname;
var mainWindow;

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

