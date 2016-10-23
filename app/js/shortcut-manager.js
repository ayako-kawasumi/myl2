var evHub = require('./model/ev-hub');
const CTRL = 'ctrl';
const ALT = 'alt';
const SHIFT = 'shift';
const PLUS = '+';
var scStore = {};
var ShortcutManager = {
  removeItem(item){
    var scKey = item.scKey;
    if(!scKey.key){
      return;
    }
    var ks = createKeyStrByItem(scKey);
    var set = scStore[ks];
    if(!set){
      return;
    }
    set.delete(item);
  },
  importAll(categories){
    categories.forEach(c=>{
      c.items.forEach(i=> this.importItem(i));
    });
  },
  importItem(item){
    var scKey = item.scKey;
    if(!scKey.key){
      return;
    }
    var set;
    var keyStr = createKeyStrByItem(scKey);
    if(!scStore[keyStr]){
      set = new Set();
      scStore[keyStr] = set;
    }else{
      set = scStore[keyStr];
    }
    set.add(item);
  },
  emit(ev){
    var ks = createKeyStrByEvent(ev);
    if(!scStore[ks]){
      return;
    }
    var keySet = scStore[ks];
    keySet.forEach(i=>{
      evHub.$emit('open-item',i);
    });
  }
};
evHub.$on('key-press', ShortcutManager.emit);

function createKeyStrByItem(sc){
  var sig = [];
  (sc.ctrl) && (sig.push(CTRL));
  (sc.alt) && (sig.push(ALT));
  (sc.shift) && (sig.push(SHIFT));
  sig.push(sc.key);
  return sig.join(PLUS);
}
function createKeyStrByEvent(ev){
  var sig = [];
  (ev.ctrlKey) && (sig.push(CTRL));
  (ev.altKey) && (sig.push(ALT));
  (ev.shiftKey) && (sig.push(SHIFT));
  var key =  ev.key;
  if(key.length === 1){
    key = key.toLowerCase();
  }
  sig.push(key);
  return sig.join(PLUS);
}
module.exports = ShortcutManager;