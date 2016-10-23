var ipcRenderer = require('electron').ipcRenderer;

module.exports = (keypath, action)=>{
  ipcRenderer.on('call-global', action);
  ipcRenderer.send('set-global-shortcut', keypath);
};