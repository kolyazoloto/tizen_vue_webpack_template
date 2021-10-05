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
	  	  access_token : "RrZaQQN2fO3D-N5q5BYqOmDISoZ-qQ_80AgbARZW8WM",
	  	  refresh_token : "",
	  	  avatarimg : "",
			  nickname : "",
		  }
    },
    activeAnimeData:{
      fullData:[],
      userRates:[]
    },
    animeData:{
      watching:[],
      planned:[],
      ongoing:[],
      dropped:[],
    },
    status:{
      animeInfo:true
    }

  },
  mutations: {
    changeAnimeInfoStatus(state,value){
      state.status.animeInfo = value
    },
    addActiveAnimeData(state,{data,category}){
      state.activeAnimeData[category] = data
    },
    clearAnimeData(state){
      for (category in state.activeAnimeData){
        category.clear()
      }
    },
    addAnimeData(state,{data,category}){

      state.animeData[category] = data
      //console.log(state.animeData)
    },
    clearAnimeData(state){
      for (category in state.animeFullData){
        category.clear()
      }
    },

  },
  actions: {

    getFullAnimeData({commit,dispatch,state},id){
      dispatch('getAnimePersonalData',id)
      dispatch('getFullOneAnimeData',id)
    },

    getAnimePersonalData({ commit,dispatch,state },id){
      fetch(`https://shikimori.one/api/v2/user_rates?target_type=Anime&target_id=${id}&user_id=${state.memory.shiki.user_id}`, {
        method:'GET',
        headers:{
          "Authorization": "Bearer " + state.memory.shiki.access_token
        },
      }).then(r => {
        return r.json()
      }).then(json => {

        commit({
          type: 'addActiveAnimeData',
          data: json,
          category:'userRates'
        })

      })
    },

    getFullOneAnimeData({ commit,state },id){
      //console.log(tempData)
      fetch(`https://shikimori.one/api/animes/${id}`, {
        method:'GET',
        headers:{
          "Authorization": "Bearer " + state.memory.shiki.access_token
        },
      }).then(r => {
        return r.json()
      }).then(json => {
        commit({
          type: 'addActiveAnimeData',
          data: json,
          category:'fullData'
        })
        if (state.status.animeInfo === false){
          commit('changeAnimeInfoStatus',true)
        }
      })

    },

    getAllAnimeCategoryData({dispatch,state}){
      //delay = 350
      let categories = ['watching','ongoing','planned','dropped']
      for (let i=0; i < categories.length; i++) {
        setTimeout(dispatch,350*i,'getOneAnimeCategoryData',categories[i])
      }
    },

    getOneAnimeCategoryData({ commit,state },category){
      //console.log(tempData)
      let URL = `https://shikimori.one/api/animes/?mylist=${category}&censored=true&limit=30`
      if (category == "ongoing"){
        console.log("asdadsa")
        URL = `https://shikimori.one/api/animes/?status=ongoing&censored=true&limit=30&order=ranked`
      }

      fetch(URL, {
        method:'GET',
        headers:{
          "Authorization": "Bearer " + state.memory.shiki.access_token
        },
      }).then(r => {
        return r.json()
      }).then(json => {

        commit({
          type: 'addAnimeData',
          data: json,
          category:category
        })
        //state.animeData[category] = json
        //console.log(state.animeData)

      })

    }
  },
  modules: {
  }
})
