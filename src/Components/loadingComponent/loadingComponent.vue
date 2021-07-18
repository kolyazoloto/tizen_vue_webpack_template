  <template>
    <div class="loadingComponent">
      <div class="header">
        <h1>Loading...</h1>
      </div>
      <div class="progressBar">
        <radial-progress-bar :diameter="400"
                             :strokeWidth="20"
                             :innerStrokeWidth="20"
                             :animateSpeed="100"
                             :completed-steps="loadingDataProgress.currentStep"
                             :total-steps="loadingDataProgress.totalSteps">
         <p>{{ Math.round(loadingDataProgress.currentStep/loadingDataProgress.totalSteps*100) }} %</p>
        </radial-progress-bar>
      </div>
    </div>
  </template>

  <script>
  import RadialProgressBar from 'vue-radial-progress'
  export default {
    name: 'loadingComponent',
    components: {
      RadialProgressBar
    },
    computed:{
      loadingDataProgress:function(){
        return this.$store.state.loadingDataProgress
      }
    },
    mounted:function(){
      //this.$store.dispatch('getAnimePersonalList','watching')
    },
    methods:{
      loadData:function(){

      },



    }
  }
  </script>


  <style lang="scss" src="./loadingComponent.scss"></style>
