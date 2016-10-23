var path = require('path');
var urlReg = /^http.+/;
module.exports = itemPath =>{
  var isUrl = false;
  if(urlReg.test(itemPath)){
    isUrl = true;
  }
  var name;
  if(isUrl){
    name = itemPath.replace(/https?:\/\//, '').replace(/\/.+/,'');
  }else{
    name = path.basename(itemPath) || itemPath;
  }
  return {
    name,
    path:itemPath,
    isUrl
  };
};