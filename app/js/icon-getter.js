var el = require('electron');
var ipcRender = el.ipcRenderer;
var appVars = require('./app-vars');
var path = require('path');
var tmpResolve;
ipcRender.on('return-icon', (ev,arg)=>{
  tmpResolve(arg);
});
var isUrlReg = /^http/;
module.exports = itemPath=>{
  if(isUrlReg.test(itemPath)){
    itemPath = path.join(appVars.HTMLDIR, 'main.html');
  }
  return new Promise(res=>{
    tmpResolve = res;
    ipcRender.send('get-icon', itemPath);
  });
};