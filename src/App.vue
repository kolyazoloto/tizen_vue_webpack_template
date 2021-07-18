<template>
  <div>
    <mainComponent></mainComponent>
  </div>
</template>

<script>

import mainComponent from './Components/MainComponent/v_main_component.vue'
export default {
  name: 'App',
  components: {
    mainComponent
  },
  mounted:function(){

  },
  methods:{
    getShikiAccessToken:function(){
      fetch('https://shikimori.one/oauth/token', {
        method:'POST',
        origin:'https://shikimori.one',
        headers:{
          'content-type': 'application/json;charset=UTF-8'
        },
        body:JSON.stringify({
          "grant_type":"authorization_code",
          "client_id" : this.$store.state.memory.shiki.client_id,
          "client_secret" : this.$store.state.memory.shiki.client_secret,
          "code" : this.$store.state.memory.shiki.authorization_token,
          "redirect_uri":"urn:ietf:wg:oauth:2.0:oob"
        })
      })
    }
  }
}
</script>
