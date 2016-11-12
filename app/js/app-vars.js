var el = require('electron');
var remote = el.remote;
var app = el.remote.app;
var path = require('path');
var DATADIR = app.getPath('userData');
var ROOTDIR = remote.getGlobal('ROOTDIR');
var HTMLDIR = path.join(ROOTDIR, 'html');
var CSSDIR = path.join(ROOTDIR, 'css');
var SAVEFILE = path.join(DATADIR, 'myl-data.json');
var CONFIGFILE = path.join(DATADIR, 'myl-config.json');
var VERSION = app.getVersion();
var itemDrag = 'myl-item-drag';
var cateDrag = 'myl-cate-drag';
module.exports = {
  VERSION,
  DATADIR,
  ROOTDIR,
  HTMLDIR,
  CSSDIR,
  SAVEFILE,
  CONFIGFILE,
  cateDrag,
  itemDrag
};