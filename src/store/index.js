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
      smotretAnimeRU:{},
		  shiki:{
	  	  client_id : "XP9wFJFEQWuvTOtrloRll38YAegN-EHgb_Q1LnimF9E",
	  	  client_secret : "Sq4ig3lg3gwDn6AtCIdwAiY0655K0SKMka6xRxzxPp0",
	  	  authorization_token : "wg01Oliw5SD04o9tuYfQUVL_tdvsOgZ59-JN1WjYmVM",
	  	  access_token : "-SHcFTjLN4u0WbLUCLZoyHCzFkmZc3S5s4MxI5JVdzk",
	  	  refresh_token : "",
        created_at: 1634209557,
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
      shikimoriLogin:false,
      activeStatsPage:1
    }

  },
  mutations: {
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


  },
  actions: {
    shikiWhoAmI({ commit,dispatch,state }){
  	  fetch('https://shikimori.one/api/users/whoami', {
  		  method:'GET',
			  headers:{
			    "Authorization" : "Bearer " + state.memory.shiki.access_token
			  }
		    }).then(res => {
		      if (res.status == 200) return res.json();
		    }).then(json => {
				 //console.log(json);
         commit('updateShikimoriUserData',json)
         dispatch('shikiFullUserData',json.id)
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

    /*shikiAuthorisation:function({ commit,state },{nickname,password}){
    fetch("https://shikimori.one/users/sign_in",{
        method:"GET",

    }).then((r)=>{
          return r.text();
       }).then((text) => {
        let parser = new DOMParser();
        let token = parser.parseFromString(text,"text/html").getElementsByName("csrf-token")[0].content;
        const formData = new FormData();

        formData.append("authenticity_token",token);
        formData.append("user[nickname]",nickname);
        formData.append("user[password]",password);
        return fetch("https://shikimori.one/users/sign_in",{
                 method:"POST",
                 body:formData,
                 headers:{
                     credentials: 'include',
                 }

             }).then((r)=>{
                 // Проверка авторизировался или нет
                 console.log(r);
               })
        })
      },*/
  },

  modules: {
  }
})
