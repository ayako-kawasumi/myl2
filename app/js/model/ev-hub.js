module.exports = new Vue({
  data(){
    return {
      layers:[]
    };
  },
  computed:{
    top(){
      return this.layers[this.layers.length-1];
    }
  },
  created(){
    this.$on('press-key',this.sendKeyToTop);
  },
  methods:{
    addLayer(vm){
      this.layers.push(vm);
    },
    removeLayer(){
      this.layers.pop();
    },
    sendKeyToTop(ev){
      this.top.$emit('press-key', ev);
    }
  }
});