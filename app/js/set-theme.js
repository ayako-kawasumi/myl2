var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var cssDir = require('./app-vars').CSSDIR;
var templFile = path.join(cssDir, 'theme.css');
var cssTemple = _.template(fs.readFileSync(templFile, 'utf8'));

var defaultTheme = {
  header:'rgb(255,233,233)',
  cateSection:'rgb(25,255,255)',
  itemSection:'rgb(125,155,255)',
  cate:'rgb(255,255,255)',
  cateHover:'rgb(255,200,255)',
  cateEven:'rgb(235,255,233)',
  cateSelected:'rgb(255,133,200)',
  item:'rgb(255,255,253)',
  itemHover:'rgb(205,125,203)',
  itemEven:'rgb(222,255,253)'
};
var setTheme = conf=>{
  if(conf.theme){
    conf.theme = {};
  }
  var theme = _.defaults(conf.theme,defaultTheme);
  var style = cssTemple(theme);
  var styleEl = document.createElement('style');
  styleEl.innerText = style;
  document.head.appendChild(styleEl);
};


module.exports = setTheme;