<template>
  <div class="mainComponent">
    <router-view></router-view>
  </div>
</template>

<script>
import { application,ApplicationControl,ApplicationControlData } from 'tizen-common-web';
import VueNotifications from 'vue-notifications'
export default {
  name: 'mainComponent',
  components: {

  },
  computed:{
    globalNotification:function(){
      //console.log(this.$store.state.globalNotification)
      return this.$store.state.globalNotification
    },
    dataDownloadReady:function(){
      return this.$store.state.status.dataDownloadReady
    },
  },
  watch:{
    dataDownloadReady:function(val){
      this.$store.dispatch('getAllAnimeCategoryData').then(()=>{
        setTimeout(()=>{
          this.$store.commit('updateCategoriesIsReady',true)
        },700)
      })
    },
    globalNotification:function(val){
      if (val.type === "error"){
        this.showMsg({
          type: VueNotifications.types.error,
          message:val.message,
          title:val.code
        })
      }
      if (val.type === "success"){
        this.showMsg({
          type: VueNotifications.types.success,
          message:val.message,
          title:val.code
        })
      }
      if (val.type === "warn"){
        this.showMsg({
          type: VueNotifications.types.warn,
          message:val.message,
          title:val.code
        })
      }
    }
  },
  mounted:function(){
    this.$store.dispatch('listDirectory').then(()=>{
      this.$store.dispatch('refreshAccesTokenIfNeeded').then(()=>{
        this.loadingAppData()
      })
    })
  },
  methods:{
    /*applicationControlTest:function(){
      var appControl = new ApplicationControl('http://tizen.org/appcontrol/operation/view',
                                                    'https://shikimori.one/oauth/authorize?client_id=lj2l2B_QDAZfO8YBqHzaw2Ue9BC9-EKvuXpChn-29X4&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&response_type=code&scope=user_rates+comments+topics', null, null, null, null);

      application.launchAppControl(appControl, null, function(s) {
        setTimeout(()=>{
          var reqAppControl = application.getCurrentApplication().getRequestedAppControl();
          console.log(reqAppControl)

          //console.log('launch application control succeed')
        },10000)

      }, function(e) {
          //console.log('launch application control failed. reason: ' + e.message)
      }, null)


    },*/
    loadingAppData:function(){
      //1. загрузить данные из памяти уустройства
      //2. проверить авторизацию на сервисах
      if (this.$store.state.memory.smotretAnimeRU.access_token === undefined){
        //значить ключ присутствует,но не понятно работает он или нет.
        this.$store.commit('updateSmotretAnimeLoginStatus',false)

      }

      if (this.$store.state.memory.shiki.access_token !== undefined){
        //значить ключ присутствует,но не понятно работает он или нет.
        this.$store.dispatch('shikiWhoAmI',0).then(()=>{
          //console.log(this.dataDownloadReady)
          /*setTimeout(()=>{
            if (this.dataDownloadReady) this.$store.dispatch('getAllAnimeCategoryData')
          },1000)*/

        })
      }
    }

  },
  notifications:{
    showMsg:{
      type: VueNotifications.types.success,
      title: 'Hello there',
      message: 'That\'s the success!'
    },
  }

}
</script>


<style lang="scss" src="./mainComponent.scss"></style>
