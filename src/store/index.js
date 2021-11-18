import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index.js'
import { filesystem } from 'tizen-common-web'
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
        access_token:undefined,
      },
		  shiki:{
	  	  client_id : "lj2l2B_QDAZfO8YBqHzaw2Ue9BC9-EKvuXpChn-29X4",
	  	  client_secret : "XoUXYyfp8bfPMlZGpv6lkRH55HxK56i_ua6izGR23a4",
	  	  access_token : "z5THVFZoGzvRgUljPame59zDGzNS08T0WFHPLQ7pvqA",
	  	  refresh_token : "84A2NoEYe8kmLpqsmkCU2WwZKjXvKFA_9WDJORROj6s",
        created_at : 	1637166311,
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
      animeInfo:false,
      shikimoriLogin:true,
      smotretAnimeLogin:true,
      activeStatsPage:0,
      dataDownloadReady:false,
      searchIsReady:false,
      categoriesIsReady:false,
      playerStatusMenuActive: false,
    },
    globalNotification:undefined,
    searchRequestString:undefined,
    keyboardLang:"eng",
    lastActiveAnimeCardId:undefined,
  },
  mutations: {
    updateLastActiveAnimeCard(state,value){
      state.lastActiveAnimeCardId = value
    },
    updatePlayerStatusMenuActive(state,value){
      state.status.playerStatusMenuActive = value
    },
    updateAnimeTransition(state,{animeId,translations}){
      state.memory.animes[animeId] = {translations:translations}
    },
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
    updateSearchrequestStringFull(state,value){
      state.searchRequestString = value
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

      state.animeData[category].push(...data)
      console.log(state.animeData)
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
    /*listDirectory({state,dispatch}){
      return new Promise((resolve,reject)=>{
        function onsuccess(files) {
          console.log(files)
  			  var flag = false;
  			  for (var i = 0; i < files.length; i++) {
  			      if (files[i].includes("smotretanimeRU.txt")){
  			    	  flag = true;
  			      }
  			  }
  			  if (!flag){
  				  dispatch('writeFile').then(()=>{
              resolve()
            })
  			  }
  			  else{
  				  dispatch('readFile').then(()=>{
              resolve()
            })
  			  }
  		  }
  		  function onerror(error) {
  			  console.log(error);
          reject()
  		  }
  		  filesystem.listDirectory('wgt-private', onsuccess, onerror);
      })
    },
    writeFile({state}){
      return new Promise((resolve,reject)=>{
        console.log("WRITEFILE")
        var fileHandleWrite = filesystem.openFile("wgt-private/smotretanimeRU.txt", "w");
        fileHandleWrite.writeString(JSON.stringify(state.memory));
        fileHandleWrite.close();
        resolve()
      })
    },
    readFile({state}){
      return new Promise((resolve,reject)=>{
        console.log("READFILE")
        var fileHandleRead = filesystem.openFile("wgt-private/smotretanimeRU.txt", "r");
        var fileContent = fileHandleRead.readString();
        fileHandleRead.close();
        console.log(fileContent);
        if (fileContent !== undefined){
          state.memory = JSON.parse(fileContent)
        }
        else console.log("В файле какая то хрень")
        resolve()
      })
    },*/
    listDirectory({state,dispatch}){
      return new Promise((resolve,reject)=>{
        function onsuccess(files) {
          dispatch('readFile').then(()=>{
            resolve()
          })
        }
        function onerror(error) {
          filesystem.resolve('wgt-private',
            function(obj) {
                obj.createFile('smotretanimeRU.txt')
                resolve()
            },
            function(error) {
              console.log(JSON.stringify(error))
              reject("Не удалось создать файл в памяти")
            },
            'rw')
        }
        //console.log("LISTDIR")
        filesystem.resolve('wgt-private/smotretanimeRU.txt', onsuccess, onerror);
      })
    },
    writeFile({state}){
      return new Promise((resolve,reject)=>{
        console.log("WRITEFILE")
        filesystem.resolve('wgt-private/smotretanimeRU.txt',
          function(files){
            let smotretanime_obj = files
            if (smotretanime_obj) {
              smotretanime_obj.openStream(
                'w',
                function(fileStream) {
                  fileStream.position = 0
                  //console.log("memory",state.memory)
                  let contents = fileStream.write(JSON.stringify(state.memory))
                  //console.log("writeFile",contents)
                  fileStream.close()
                  resolve()
                },
                function(error) {
                  console.log(JSON.stringify(error))
                  reject("Не удалось записать файл в память")
                }
              )
            }
          },
          function(error) {
              //console.log(JSON.stringify(error))
              reject("Не удалось записать файл в память")
          }
        )


      })
    },
    readFile({state}){
      return new Promise((resolve,reject)=>{
        console.log("READFILE")
        filesystem.resolve('wgt-private/smotretanimeRU.txt',
          function(files){
            let smotretanime_obj = files
            if (smotretanime_obj) {
              smotretanime_obj.openStream(
                'r',
                function(fileStream) {
                  fileStream.position = 0
                  //console.log(fileStream.bytesAvailable)
                  if (fileStream.bytesAvailable == 0){
                    console.log("Какая то хрень данных в файле нет")
                    //alert("Какая то хрень данных в файле нет")
                  }
                  else{
                    let contents = fileStream.read(fileStream.bytesAvailable)
                    console.log("readfile",contents)
                    state.memory = JSON.parse(contents)
                  }
                  fileStream.close()
                  resolve()
                },
                function(error) {
                  //console.log(JSON.stringify(error))
                  reject("Не удалось прочитать файл из памяти")
                }
              );
            }
          },
          function(error) {
              //console.log(JSON.stringify(error))
          }
        )
      })
    },
    refreshAccesTokenIfNeeded({dispatch,state}){
      return new Promise((resolve,reject)=>{
        if ((Math.floor(Date.now() / 1000) - state.memory.shiki.created_at) < 86000){
          //console.log("Не нужно обновлять токен")
          resolve()
        }
        else{
          //console.log("Нужно обновить токен")
          dispatch('shikiRefreshAccessToken').then(()=>{
            resolve()
          })
        }
      })
    },
    shikiGetAccessToken({ commit,dispatch,state },value){
      return new Promise((resolve,reject)=>{
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
            state.memory.shiki.created_at = json.created_at
            commit('changeGlobalNatification',{
              type:"success",
              message:"Токен доступа успешно получен",
              code:"Access token"
            })
            commit('changedataDownloadReady',true)
            commit('updateShikimoriLoginStatus',true)
            dispatch("writeFile")
            resolve()

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
      })
    },

    shikiRefreshAccessToken({ commit,dispatch,state }){
      return new Promise((resolve,reject)=>{
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
            state.memory.shiki.access_token = json.access_token
            state.memory.shiki.refresh_token = json.refresh_token
            state.memory.shiki.created_at = json.created_at
            commit('changeGlobalNatification',{
              type:"success",
              message:"Токен доступа успешно обновлен",
              code:"Refresh token"
            })
            dispatch("writeFile")
            resolve()

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
              reject("Не обновился токен")
            })
          })
      })
    },

    shikiWhoAmI({ commit,dispatch,state },repeatReq){
      dispatch("refreshAccesTokenIfNeeded").then(()=>{
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
           if (code == 429){
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
      })
  	 },


     getSearchData({ commit,state,dispatch },{url,repeatReq}){
       dispatch("refreshAccesTokenIfNeeded").then(()=>{
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
           if (code == 429){
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
            setTimeout(()=>{
              dispatch("writeFile")
            },1000)

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
