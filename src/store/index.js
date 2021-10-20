import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shikimori:{
      user_id : undefined,
      avatarimg : undefined,
      nickname : undefined,
      stats : undefined
    },
    memory:{
      animes:{},
      smotretAnimeRU:{
        //access_token:undefined,
        access_token:"bffcd8b4c9dc379e0160f6b3a207439262337912d46972001f6240a4f281b8282cea756ed28370284a68d6008170e719f823f8b444331b056f442bafbeaef19b4e19151c99df495ce7375819c31af2fa587a2947bd000560de0d9ef3dd74084c2213b27ee095da084b303f0ed9050d90"
      },
		  shiki:{
	  	  client_id : "XP9wFJFEQWuvTOtrloRll38YAegN-EHgb_Q1LnimF9E",
	  	  client_secret : "Sq4ig3lg3gwDn6AtCIdwAiY0655K0SKMka6xRxzxPp0",
	  	  authorization_token : "wg01Oliw5SD04o9tuYfQUVL_tdvsOgZ59-JN1WjYmVM",
	  	  access_token : "PuzCrKWv77NJpZ-gonE63wHS4cKCPgr6FnV0n8dpfk0",
	  	  refresh_token : undefined,
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
      animeInfo:true,
      shikimoriLogin:true,
      smotretAnimeLogin:true,
      activeStatsPage:0
    },
    globalNotification:undefined

  },
  mutations: {
    changeGlobalNatification(state,value){
      state.globalNotification = value
      //console.log("commit")
      //console.log(value)
    },
    exitSmotretAnime(state){
      state.memory.smotretAnimeRU.access_token = undefined
      state.status.smotretAnimeLogin = false
    },
    exitShikimori(state){
      state.memory.shiki.access_token = undefined
      state.memory.shiki.authorization_token = undefined
      state.memory.shiki.refresh_token = undefined
      state.status.shikimoriLogin= false
    },
    addActiveStatsPage(state){
      if (state.status.activeStatsPage < 1){
        state.status.activeStatsPage++
      }
      else{
        state.status.activeStatsPage = 0;
      }
    },
    changeAnimeInfoStatus(state,value){
      state.status.animeInfo = value
    },
    addActiveAnimeData(state,{data,category}){
      state.activeAnimeData[category] = data
      //console.log(data)
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
    updateShikimoriUserData(state,value){
      //console.log(value.avatar)
      state.shikimori.avatarimg = value.avatar
      state.shikimori.nickname = value.nickname
      state.shikimori.user_id = value.id
      //console.log(value)
    },
    updateShikimoriFullUserData(state,value){
      state.shikimori.stats = value.stats
    },
    updateShikimoriLoginStatus(state,value){
      state.status.shikimoriLogin = value
    },
    updateSmotretAnimeLoginStatus(state,value){
      state.status.smotretAnimeLogin = value
    },


  },
  actions: {
    shikiWhoAmI({ commit,dispatch,state }){
  	  fetch('https://shikimori.one/api/users/whoami', {
  		  method:'GET',
			  headers:{
			    "Authorization" : "Bearer " + state.memory.shiki.access_token
			  }
		    }).then(res => {
		      return res.json();
		    }).then(json => {
				 //console.log(json);
         commit('updateShikimoriUserData',json)
         dispatch('shikiFullUserData',json.id)
         commit('updateShikimoriLoginStatus',true)
			 })
  	 },

     shikiFullUserData({ commit,state },user_id){
      fetch(`https://shikimori.one/api/users/${user_id}`, {
        method:'GET',
        headers:{
          "Authorization" : "Bearer " + state.memory.shiki.access_token
        }
        }).then(res => {
          if (res.status == 200) return res.json();
        }).then(json => {
         //console.log(json);
          commit('updateShikimoriFullUserData',json)
       })
     },

    getFullAnimeData({commit,dispatch,state},id){
      dispatch('getAnimePersonalData',id)
      dispatch('getFullOneAnimeData',id)
    },

    getAnimePersonalData({ commit,dispatch,state },id){
      fetch(`https://shikimori.one/api/v2/user_rates?target_type=Anime&target_id=${id}&user_id=${state.shikimori.user_id}`, {
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

    },
    smotretAnimeRuAutorisation({ commit,dispatch,state },{email,password}){

        fetch(`https://smotret-anime.online/api/login?app=kolyazoloto&email=${email}&password=${password}`, {
          method:'GET',
          }).then(res => {
            return res.json();
          }).then(json => {
            //console.log(Object.keys(json));
            if (Object.keys(json).includes("error")){
              console.log("error")
              throw json
            }
            return json.data
          }).then(data => {
            // Успешно авторизировались
            state.memory.smotretAnimeRU.access_token = data.access_token
            commit("updateSmotretAnimeLoginStatus",true)

          }).catch(err =>{
            //console.log(err)
            // показывает уведомление
            commit('changeGlobalNatification',{
              type:"error",
              message:err.error.message,
              code:err.error.code
            })
          })

     },

  },

  modules: {
  }
})
