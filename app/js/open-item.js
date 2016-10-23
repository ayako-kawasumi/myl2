var el = require('electron');
var util = require('util');
var format = util.format;
var shell = el.shell;
var exec = require('child_process').exec;
var timeout = 10000;
module.exports = (item)=>{
  if(item.constructor === String){
    return shell.openItem(item);
  }
  if(item.by || item.cmd){
    var by = item.by;
    var cmdLine = item.path;
    if(cmdLine.indexOf(' ') !== -1){
      cmdLine = `"${cmdLine}"`;
    }
    if(by){
      if(by.indexOf(' ') !== -1){
        by = `"${by}"`;
      }
      cmdLine = `${by} ${cmdLine}`;
    }
    if(item.cmd){
      cmdLine = cmdLine.replace(/^""|""$/g, '"');
      if(item.cmd.indexOf('%s') !== -1){
        cmdLine= format(item.cmd, cmdLine);
      }else{
        cmdLine = item.path  + ' ' + item.cmd;
      }
    }
    exec(cmdLine, {timeout},()=>{}).unref();
    return;
  }
  if(item.isUrl){
    return shell.openExternal(item.path);
  }
  shell.openItem(item.path);
};