import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'
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
        access_token:"bffcd8b4c9dc379e0160f6b3a207439262337912d46972001f6240a4f281b8282cea756ed28370284a68d6008170e719f823f8b444331b056f442bafbeaef19b4e19151c99df495ce7375819c31af2fa587a2947bd000560de0d9ef3dd74084c2213b27ee095da084b303f0ed9050d90"
      },
		  shiki:{
	  	  client_id : "lj2l2B_QDAZfO8YBqHzaw2Ue9BC9-EKvuXpChn-29X4",
	  	  client_secret : "XoUXYyfp8bfPMlZGpv6lkRH55HxK56i_ua6izGR23a4",
	  	  access_token : "Gi62_qIQt7rx3aXEnY-nBTqPu6oemtk5iiAhwXbAzgU",
	  	  refresh_token : "6MlRWzbMM3mVMrkDduoLYpGUODpFlpkrM1aaEmpnU2E",
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
    searchData:undefined,
    status:{
      animeInfo:true,
      shikimoriLogin:true,
      smotretAnimeLogin:true,
      activeStatsPage:0,
      dataDownloadReady:false,
      searchIsReady:false,
      categoriesIsReady:false
    },
    globalNotification:undefined,
    searchRequestString:"",
    keyboardLang:"eng",


  },
  mutations: {
    changeKeyboardLang(state){
      if (state.keyboardLang === "eng") state.keyboardLang = "ru"
      else if (state.keyboardLang === "ru") state.keyboardLang = "eng"
    },
    updateSearchIsReady(state,value){
      state.status.searchIsReady = value
    },
    updateCategoriesIsReady(state,value){
      state.status.categoriesIsReady = value
    },
    updateSearchrequestString(state,value){
      //console.log(value)
      if (value[0] === undefined){
        state.searchRequestString += value[1]
      }
      else{
        if (value[0] === "backspace"){
          state.searchRequestString = state.searchRequestString.slice(0, -1);
        }
        else if (value[0] === "space"){
          state.searchRequestString += " "
        }
      }
      //state.searchRequestString
    },
    updateSearchData(state,value){
      state.searchData = value
    },
    changedataDownloadReady(state,value){
      state.status.dataDownloadReady = value
      //console.log("commit")
      //console.log(value)
    },
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
    shikiGetAccessToken({ commit,dispatch,state },value){
      fetch('https://shikimori.one/oauth/token', {
        method:'POST',
        origin:'https://shikimori.one',
        headers:{
          'content-type': 'application/json;charset=UTF-8'
        },
        body:JSON.stringify({
          "grant_type":"authorization_code",
          "client_id" : state.memory.shiki.client_id,
          "client_secret" : state.memory.shiki.client_secret,
          "code" :value,
          "redirect_uri":"urn:ietf:wg:oauth:2.0:oob"
        })}).then(res => {
          if (!res.ok) throw res
          return res.json()
        }).then(json => {
          console.log(json)
          state.memory.shiki.access_token = json.access_token
          state.memory.shiki.refresh_token = json.refresh_token
          commit('changeGlobalNatification',{
            type:"success",
            message:"Токен доступа успешно получен",
            code:"Access token"
          })
          commit('updateShikimoriLoginStatus',true)
          // записать в файл
        }).catch(err => {
          //console.log(err.json())
          let code = err.status
          err.json().then(json => {
            commit('changeGlobalNatification',{
              type:"error",
              message:json.error,
              code:code
            })
          })
        })
    },

    shikiRefreshAccessToken({ commit,dispatch,state }){
      fetch('https://shikimori.one/oauth/token', {
        method:'POST',
        origin:'https://shikimori.one',
        headers:{
            'content-type': 'application/json;charset=UTF-8'
        },
        body:JSON.stringify({
          "client_id" : state.memory.shiki.client_id,
          "client_secret" : state.memory.shiki.client_secret,
          "refresh_token" : state.memory.shiki.refresh_token,
          "grant_type":"refresh_token"
        })}).then(res => {
          if (!res.ok) throw res
          return res.json()
        }).then(json => {
          console.log(json)
          state.memory.shiki.access_token = json.access_token;
          state.memory.shiki.refresh_token = json.refresh_token;
          commit('changeGlobalNatification',{
            type:"success",
            message:"Токен доступа успешно обновлен",
            code:"Refresh token"
          })
          //Записать в память устройства
        }).catch(err =>{
          // в случае неудачи обновить токен удаляем его из памяти
          // и перенаправляем пользователя на страницу авторизации
          let code = err.status
          err.json().then(json => {
            commit('changeGlobalNatification',{
              type:"error",
              message:json.error,
              code:code
            })
            commit('changeGlobalNatification',{
              type:"warn",
              message:"Не удалось получить новый токен доступа",
              code:"Необходима авторизация"
            })
            commit('exitShikimori')
            router.push("/mainPage/login")

          })


        })
    },

    shikiWhoAmI({ commit,dispatch,state },repeatReq){
      //console.log(repeatReq)
  	  fetch('https://shikimori.one/api/users/whoami', {
  		  method:'GET',
			  headers:{
			    "Authorization" : "Bearer " + state.memory.shiki.access_token
			  }
		    }).then(res => {
          if (!res.ok) throw res
		      return res.json();
		    }).then(json => {
				 //console.log(json);
         commit('updateShikimoriUserData',json)
         dispatch('shikiFullUserData',json.id)
         commit('updateShikimoriLoginStatus',true)
         commit('changedataDownloadReady',true)

			 }).catch(err => {
         let code = err.status
         if (code == 401){
           err.json().then(json => {
             commit('changeGlobalNatification',{
               type:"error",
               message:json.error,
               code:code
             })
             //обновляю токен
             dispatch('shikiRefreshAccessToken').then(()=>{
               setTimeout(()=>{
                 if (repeatReq < 2) dispatch('shikiWhoAmI',++repeatReq)
               },1000)
             })
           })
         }
         else if (code == 429){
           setTimeout(()=>{
             if (repeatReq < 2) dispatch('shikiWhoAmI',++repeatReq)
           },1000)
         }
         else{
           err.json().then(json => {
             commit('changeGlobalNatification',{
               type:"error",
               message:json.error,
               code:code
             })
           })
         }
       })
  	 },


     getSearchData({ commit,state },{url,repeatReq}){
       console.log(repeatReq)
       fetch(url[0], {
         method:'GET',
         headers:{
           "Authorization": "Bearer " + state.memory.shiki.access_token
         },
       }).then(r => {
         if (!r.ok) throw r
         return r.json()
       }).then(json => {
         if (url[1]) {
           json.sort(function(a,b){
             return parseFloat(b.score) - parseFloat(a.score)
           })
         }
         commit('updateSearchData',json)
       }).catch(err => {
         let code = err.status
         if (code == 401){
           err.json().then(json => {
             commit('changeGlobalNatification',{
               type:"error",
               message:json.error,
               code:code
             })
             //обновляю токен
             dispatch('shikiRefreshAccessToken').then(()=>{
               setTimeout(()=>{
                 if (repeatReq < 2) dispatch('getSearchData',{url:url,repeatReq:++repeatReq})
               },1000)
             })
           })
         }
         else if (code == 429){
           setTimeout(()=>{
             if (repeatReq < 2) dispatch('getSearchData',{url:url,repeatReq:++repeatReq})
           },1000)
         }
         else{
           err.json().then(json => {
             commit('changeGlobalNatification',{
               type:"error",
               message:json.error,
               code:code
             })
           })
         }
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

    getFullAnimeData({dispatch,state},id){
      /*dispatch('getAnimePersonalData',id).then(()=>{
        dispatch('getFullOneAnimeData',id)
      })*/
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
      })

    },

    getAllAnimeCategoryData({dispatch,state}){
      //delay = 350
      let categories = ['watching','ongoing','planned','dropped']
      for (let i=0; i < categories.length; i++) {
        setTimeout(dispatch,350*i,'getOneAnimeCategoryData',{category:categories[i],repeatReq:0})
      }
      /*dispatch('getOneAnimeCategoryData','watching').then(()=>{
        dispatch('getOneAnimeCategoryData','ongoing').then(()=>{
          dispatch('getOneAnimeCategoryData','planned').then(()=>{
            dispatch('getOneAnimeCategoryData','dropped')
          })
        })
      })*/
    },

    getOneAnimeCategoryData({ commit,state,dispatch },{category,repeatReq}){
      //console.log(tempData)
      let URL = `https://shikimori.one/api/animes/?mylist=${category}&censored=true&limit=50`
      if (category == "ongoing"){
        URL = `https://shikimori.one/api/animes/?status=ongoing&censored=true&limit=50&order=ranked`
      }

      fetch(URL, {
        method:'GET',
        headers:{
          "Authorization": "Bearer " + state.memory.shiki.access_token
        },
      }).then(r => {
        if (!r.ok) throw r
        return r.json()
      }).then(json => {

        commit({
          type: 'addAnimeData',
          data: json,
          category:category
        })
        //state.animeData[category] = json
        //console.log(state.animeData)
      }).catch(err => {
        let code = err.status
        if (code == 401){
          err.json().then(json => {
            commit('changeGlobalNatification',{
              type:"error",
              message:json.error,
              code:code
            })
            //обновляю токен
            dispatch('shikiRefreshAccessToken').then(()=>{
              setTimeout(()=>{
                if (repeatReq < 2) dispatch('getOneAnimeCategoryData',{category:category,repeatReq:++repeatReq})
              },1000)
            })
          })
        }
        else if (code == 429){
          setTimeout(()=>{
            if (repeatReq < 2) dispatch('getOneAnimeCategoryData',{category:category,repeatReq:++repeatReq})
          },1000)
        }
        else{
          err.json().then(json => {
            commit('changeGlobalNatification',{
              type:"error",
              message:json.error,
              code:code
            })
          })
        }
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
