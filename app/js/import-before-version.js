var fs = require('fs');
var path = require('path');
var app = require('electron').remote.app;
module.exports = ()=>{
  var appData = app.getPath('appData');
  var mylItemPath = path.join(appData, 'myl', 'items.json');
  if(!fs.existsSync(mylItemPath)){
    return null;
  }
  try{
    var json =fs.readFileSync(mylItemPath, 'utf8');
    var items = JSON.parse(json);
    return convert(items);
  }catch(e){
    console.error(e);
    return null;
  }
};

function convert(cates){
  return cates.map(cate=>{
    return {
      name:cate.name || 'Migrate Fail',
      scKey:'',
      items:cate.items.map(item=>{
        var isUrl = (item.path || '').indexOf('http') === 0;
        return {
          name:item.name || 'Migrate Fail',
          path:item.path || '',
          icon:item.icon || '',
          cmd:'',
          by:'',
          scKey:{},
          isUrl
        };
      })
    };
  });
}