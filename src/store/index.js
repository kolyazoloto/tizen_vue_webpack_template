import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    memory:{
      animes:{},
		  shiki:{
        user_id : '469502',
	  	  client_id : "XP9wFJFEQWuvTOtrloRll38YAegN-EHgb_Q1LnimF9E",
	  	  client_secret : "Sq4ig3lg3gwDn6AtCIdwAiY0655K0SKMka6xRxzxPp0",
	  	  authorization_token : "wg01Oliw5SD04o9tuYfQUVL_tdvsOgZ59-JN1WjYmVM",
	  	  access_token : "QkPrddb84S5zdEla5mragj6LFt1p4CPUu2jX7_VCrM8",
	  	  refresh_token : "",
	  	  avatarimg : "",
			  nickname : "",
		  }
    },
    animeFullData:{
      watching:[],
      planned:[],
      ongoing:[],
      dropped:[],
    },
    loadingDataProgress:{
      currentStep:0,
      totalSteps:0
    },

  },
  mutations: {
    addAnimeData(state,data){

      state.animeFullData[data.status].push(data)
      //console.log(state.animeFullData)
    },
    clearAnimeData(state){
      for (category in state.animeFullData){
        category.clear()
      }
    },
    loadingDataProgressChange(state,{currentStep,totalSteps}){
      state.loadingDataProgress.currentStep = currentStep
      state.loadingDataProgress.totalSteps = totalSteps
    }
  },
  actions: {

    getAnimePersonalList({ commit,dispatch,state },categoryName){
      fetch(`https://shikimori.one/api/v2/user_rates?status=${categoryName}&user_id=${state.memory.shiki.user_id}`, {
        method:'GET',
        headers:{
          "Authorization": "Bearer " + state.memory.shiki.access_token
        },
      }).then(r => {
        return r.json()
      }).then(json => {
        //this.animeList = json
        //console.log(json)

        for (let i=0;i < json.length;i++){
          setTimeout(() => {
            let tempData = json[i]
            //console.log(categoryName)
            commit({
              type:'loadingDataProgressChange',
              currentStep:i+1,
              totalSteps:json.length
            })
            dispatch('getFullAnimeData',tempData)
          },300*i)
        }

      })
    },

    getFullAnimeData({ commit,state },tempData){
      //console.log(tempData)
      fetch(`https://shikimori.one/api/animes/${tempData.target_id}`, {
        method:'GET',
        headers:{
          "Authorization": "Bearer " + state.memory.shiki.access_token
        },
      }).then(r => {
        return r.json()
      }).then(json => {

        tempData.fullData = json
        commit('addAnimeData',tempData)

      })

    }
  },
  modules: {
  }
})
