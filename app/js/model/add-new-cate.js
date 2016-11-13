var evHub = require('./ev-hub');
module.exports = {
  template:'<transition name="add-new-cate">'+
    '<div v-if="show" class="add-new-cate-modal modal-layer">'+
      '<div><input @keydown.enter="addNewCategory" ref="input" v-model="newName" class="new-cate-input" '+
      ':placeholder="$parent.mess.INPUT_NEW_CATEGORY"></div>'+
    '</div>'+
    '</transition>',
  data(){
    return {
      newName:'',
      show:false
    };
  },
  created(){
    evHub.$on('show-add-new-cate-dialog', this.showMe);
    this.$on('press-key', this.shortCut);
  },
  watch:{
    show(v){
      if(v){
        evHub.addLayer(this);
      }else{
        evHub.removeLayer(this);
      }
    }
  },
  methods:{
    focusInput(){
      Vue.nextTick(()=>{
        this.$refs.input.focus();
      });
    },
    shortCut(ev){
      var key = ev.which;
      if(key === 27/*ESC*/){
        this.show = false;
      }
    },
    addNewCategory(){
      if(!this.newName){
        return;
      }
      evHub.$emit('add-new-cate', this.newName);
      this.show = false;
    },
    showMe(){
      this.newName = '';
      this.show = true;
      this.focusInput();
    }
  }
};