<template>
  <div class="videoPlayerComponent">

    <div  class="mainmenu">
      <transition name="fadeLR">
      <template v-if="playerStatusMenuActive">
      <div tabindex="-1" v-focus @focus="mainmenuSubGetFocus" v-if="dataLoadingComplete" class="mainmenuSub">
        <div class="infoSection">
          <h3 class="title">{{animeData.name}}</h3>


          <div class="statistics">
            <h3 class="score">{{animeData.score}}</h3>
            <h3 class="year">{{season[1]}}</h3>
            <h3 class="rating">{{rating}}</h3>
            <h3 v-if="hasVideo" class="episodes">{{animeData.episodes}} EP</h3>
            <h3 class="kind">{{kind}}</h3>
          </div>

        </div>
        <div class="menuSection">

          <div class="leftMenuSection">
            <div class="li">

              <div
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              tabindex="-1" class="lu"
              >
                <thumbUpIcon class="icon"></thumbUpIcon>
                <h3>Оценить</h3>
              </div>

              <div
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.enter.prevent="leftMenuPlayPressEnter"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              tabindex="-1"
              class="lu play"
              v-if="hasVideo"
              >
                <playIcon class="iconPlay"></playIcon>
                <h3>{{"Продолжить Ep. "+choosenEpisode.episodeInt}}</h3>
              </div>

              <div
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.enter.prevent="leftMenuBeginingPressEnter"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              tabindex="-1"
              class="lu "
              v-if="hasVideo"
              >
                <rewindIcon class="icon"></rewindIcon>
                <h3>Начать сначала</h3>
              </div>

              <div
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.enter.prevent="leftMenuEpisodesPressEnter"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              tabindex="-1"
              class="lu episodes"
              v-if="hasVideo && episodes !== null"
              >
                <cardMultIcon class="icon"></cardMultIcon>
                <h3>Эпизоды</h3>
              </div>

              <div
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.enter.prevent="leftMenuTransitionPressEnter"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              tabindex="-1"
              class="lu translations"
              v-if="hasVideo"
              >
                <subtitlesIcon class="icon"></subtitlesIcon>
                <h3>Озвучки</h3>
              </div>

              <div v-if="similarAnimeData.length>0"
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.enter.prevent="leftMenuSimilarPressEnter"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              tabindex="-1"
              class="lu similar"

              >
                <viewGridIcon class="icon"></viewGridIcon>
                <h3>Похожие</h3>
              </div>

              <div v-if="franchiseAnimeData.nodes.length>0"
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.enter.prevent="leftMenuFranchisePressEnter"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              tabindex="-1"
              class="lu franchise"
              >
                <accMultiIcon class="icon"></accMultiIcon>
                <h3>Франшиза</h3>
              </div>

            </div>
          </div>

          <div class="rightMenuSection">
            <transition name="fadeRL">
              <div v-if="menuActive === 1" class="episodesMenu">
                <div class="episodesMenuCard"
                  v-for="(item,index) in episodes" :key="index" tabindex="-1"
                  :index="index"
                  :id="'epid'+item.id"
                  @keydown.down.prevent="episodesMenuCardPressDown"
                  @keydown.up.prevent="episodesMenuCardPressUp"
                  @keydown.enter.prevent="episodesMenuCardPressEnter"
                  @keydown.left.prevent="episodesMenuCardPressLeft"
                  @keydown.backspace.prevent="episodesMenuCardPressLeft"
                  @focus="episodesMenuCardFocus"
                  >
                  <h3>{{item.episodeFull}}</h3>
                </div>
              </div>
            </transition>

            <transition name="fadeRL">
              <div v-if="menuActive === 2" class="translationsMenu">
                <div class="translationsMenuCard"
                v-for="(item,index) in translations" :key="index" tabindex="-1"
                :index="index"
                :id="'trid'+item.id"
                @keydown.down.prevent="episodesMenuCardPressDown"
                @keydown.up.prevent="episodesMenuCardPressUp"
                @keydown.left.prevent="translationsMenuCardPressLeft"
                @keydown.backspace.prevent="translationsMenuCardPressLeft"
                @keydown.enter.prevent="translationsMenuCardPressEnter"
                @focus="translationsMenuCardFocus"
                >
                  <h3 class="authorsSummary">{{item.authorsSummary}}</h3>
                  <div class="specs">
                    <h3 class="typeKind">{{item.typeKind.toUpperCase()}}</h3>
                    <h3 class="typeLang">{{item.typeLang.toUpperCase()}}</h3>
                    <h3 class="qualityType">{{item.qualityType.toUpperCase()}}</h3>
                    <h3 class="resolution">{{item.width + "x" + item.height}}</h3>
                  </div>
                </div>
              </div>
            </transition>

            <transition name="fadeRL">
              <div  v-if="menuActive === 3" class="similarMenu">
                <div class="similarMenuCard"
                v-for="(item,index) in similarAnimeData" :key="index" tabindex="-1"
                :index="index"
                @keydown.down.prevent="episodesMenuCardPressDown"
                @keydown.up.prevent="episodesMenuCardPressUp"
                @keydown.left.prevent="similarMenuCardPressLeft"
                @keydown.backspace.prevent="similarMenuCardPressLeft"
                @keydown.enter.prevent="similarMenuCardPressEnter"
                @focus="similarMenuCardFocus"
                >
                  <img :src="'https://shikimori.one' + item.image.original">
                  <div class="info">
                    <h3 class="name">{{item.name +" / "+item.russian}}</h3>
                    <div class="specs">
                      <h3 class="score">{{item.score}}</h3>
                      <h3 class="year">{{new Date(item.aired_on).getFullYear()}}</h3>
                      <h3 class="episodes">{{item.episodes+" ep"}}</h3>
                      <h3 class="kind">{{item.kind.toUpperCase()}}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <transition name="fadeRL">
              <div v-if="menuActive === 4" class="franchiseMenu" tabindex="-1">
                <div class="franchiseMenuCard"
                v-for="(item,index) in franchiseAnimeData.nodes" :key="index" tabindex="-1"
                :index="index"
                @keydown.down.prevent="episodesMenuCardPressDown"
                @keydown.up.prevent="episodesMenuCardPressUp"
                @keydown.left.prevent="franchiseMenuCardPressLeft"
                @keydown.backspace.prevent="franchiseMenuCardPressLeft"
                @keydown.enter.prevent="franchiseMenuCardPressEnter"
                @focus="similarMenuCardFocus"
                >
                  <img :src="item.image_url">

                  <div class="info">
                    <h3 class="name">{{item.name}}</h3>
                    <div class="specs">
                      <h3 class="year">{{item.year}}</h3>
                      <h3 class="kind">{{item.kind}}</h3>
                    </div>
                  </div>

                </div>
              </div>
            </transition>

          </div>
        </div>
      </div>
      </template>
      </transition>

      <div v-if="!dataLoadingComplete" class="loadingScreen">
        <div class="loader"></div>
      </div>

      <videoJSComponent
        v-if="dataLoadingComplete && hasVideo"
        :options="videoOptions"
        :title="animeData.name"
        :episode="choosenEpisode"
        :translation="choosenTranslation"
        :assUrl="videoData.subtitlesUrl"
        :vttUrl="videoData.subtitlesVttUrl"
        :startFromBegining="startFromBegining"

      ></videoJSComponent>
    </div>
  </div>



</template>

<script>
import videoJSComponent from "./videoJSComponent/v_videoJS_component.vue"
import playIcon from 'vue-material-design-icons/Play.vue'
import rewindIcon from 'vue-material-design-icons/Restore.vue'
import thumbUpIcon from 'vue-material-design-icons/ThumbUp.vue'
import subtitlesIcon from 'vue-material-design-icons/Subtitles.vue'
import cardMultIcon from 'vue-material-design-icons/CardMultiple.vue'
import viewGridIcon from 'vue-material-design-icons/ViewGrid.vue'
import accMultiIcon from 'vue-material-design-icons/AccountMultiple.vue'

export default {
  name: 'videoPlayerComponent',
  components: {
    videoJSComponent,
    playIcon,
    rewindIcon,
    thumbUpIcon,
    subtitlesIcon,
    cardMultIcon,
    viewGridIcon,
    accMultiIcon
  },
  directives: {
    focus: {
      inserted: function (el,binding) {
        if ((! binding.hasOwnProperty('value')) || binding.value) {
          el.focus({preventScroll: true})
        }
      }
    }
  },
  data:function(){
    return{

      dataLoadingComplete:false,
      animeData:undefined,
      franchiseAnimeData:undefined,
      similarAnimeData:undefined,
      episodes:undefined,
      choosenEpisode:undefined,
      translations:undefined,
      choosenTranslation:undefined,
      videoData:undefined,
      startFromBegining:false,
      hasVideo:true,


      //Переменные отвечающие за активное меню
      menuActive:0, // 0 выкл, 1 эпизоды
    }
  },
  computed:{
    playerStatusMenuActive:function(){
      return this.$store.state.status.playerStatusMenuActive
    },
    kind:function(){
      return this.animeData.kind.toUpperCase()
    },
    season:function(){
      let date = new Date(this.animeData.aired_on)
      let year = date.getUTCFullYear()
      let month = date.getMonth()
      let seasons = null;
      if (month === 11 || month === 0 || month === 1){
        seasons = [`Winter ${year}`,`Зима ${year}`]
      }
      else if (month === 2 || month === 3 || month === 4){
        seasons = [`Spring ${year}`,`Весна ${year}`]
      }
      else if (month === 5 || month === 6 || month === 7){
        seasons = [`Summer ${year}`,`Лето ${year}`]
      }
      else if (month === 8 || month === 9 || month === 10){
        seasons = [`Fall ${year}`,`Осень ${year}`]
      }
      return seasons
    },
    rating:function(){
      let temp = this.animeData.rating
      if (temp == 'r_plus'){
        return 'R+'
      }
      if (temp == 'pg_13'){
        return 'PG13'
      }
      if (temp == 'r'){
        return 'R'
      }
      else return temp;
    },
    videoOptions: function(){
      return {
        //autoplay: true,
        controls: true,
        sources: [
          {
            src:this.videoData.stream[0].urls[0],
            type: 'video/mp4',
          }
        ],

      }
    },

  },
  created:function(){
    //console.log(this.$route)
    console.log(this.$router)
    this.loadData(this.$route.params.id)

  },
  watch: {
    /*playerStatusMenuActive(val){
      this.$nextTick(()=>{

      })
    },*/
    $route(to, from) {
      // react to route changes...
      //console.log(to)
      this.dataLoadingComplete = false
      this.hasVideo = true
      this.animeData = undefined
      this.franchiseAnimeData = undefined
      this.similarAnimeData =undefined
      this.episodes = undefined
      this.choosenEpisode = undefined
      this.translations = undefined
      this.choosenTranslation = undefined
      this.videoData = undefined
      this.menuActive = 0
      this.$store.commit("updatePlayerStatusMenuActive",false)
      this.loadData(to.params.id)
      //console.log(from)
    }
  },
  methods:{
    getAnimeData:function(id,repeatReq){
      //console.log("ALOSULABLYA" + id)
      return new Promise((resolve, reject) => {

        fetch(`https://shikimori.one/api/animes/${id}`, {
          method:'GET',
          headers:{
            "Authorization": "Bearer " + this.$store.state.memory.shiki.access_token
          },
        }).then(r => {
          if (!r.ok) throw r
          return r.json()

        }).then(json => {
          this.animeData = json
          //console.log(this.animeData)
          resolve(json)
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
                  if (repeatReq < 2)        this.$router.push({
                           name:"player",
                           params:{
                             id:this.similarAnimeData[index].id
                           }
                         })
                },1000)
              })
            })
          }
          else if (code == 429){
            setTimeout(()=>{
              if (repeatReq < 2) this.getAnimeData(id,++repeatReq)
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
    getSimilarAnimeData:function(id,repeatReq){
      return new Promise((resolve, reject) => {
        fetch(`https://shikimori.one/api/animes/${id}/similar`, {
          method:'GET',
          headers:{
            "Authorization": "Bearer " + this.$store.state.memory.shiki.access_token
          },
        }).then(r => {
          if (!r.ok) throw r
          return r.json()
        }).then(json => {

          if (json.length >31){
            this.similarAnimeData = json.slice(0,30)
          }
          else{
            this.similarAnimeData = json
          }
          resolve(json)
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
                  if (repeatReq < 2) this.getSimilarAnimeData(id,++repeatReq)
                },1000)
              })
            })
          }
          else if (code == 429){
            setTimeout(()=>{
              if (repeatReq < 2) this.getSimilarAnimeData(id,++repeatReq)
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
    getFranchiseAnimeData:function(id,repeatReq){
      return new Promise((resolve, reject) => {
        fetch(`https://shikimori.one/api/animes/${id}/franchise`, {
          method:'GET',
          headers:{
            "Authorization": "Bearer " + this.$store.state.memory.shiki.access_token
          },
        }).then(r => {
          if (!r.ok) throw r
          return r.json()
        }).then(json => {
          this.franchiseAnimeData = json
          //console.log(this.animeData)
          resolve(json)
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
                  if (repeatReq < 2) this.getFranchiseAnimeData(id,++repeatReq)
                },1000)
              })
            })
          }
          else if (code == 429){
            setTimeout(()=>{
              if (repeatReq < 2) this.getFranchiseAnimeData(id,++repeatReq)
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

    getEpisodes:function(id){
      return new Promise((resolve, reject) => {
        fetch(`https://smotret-anime.online/api/series/?myAnimeListId=${id}&access_token=${this.$store.state.memory.smotretAnimeRU.access_token}&fields=episodes`, {
          method:'GET',
          }).then(res => {
            if (res.ok) return res.json()
            else throw res
          }).then(json => {
            console.log(id)
            let episodesData = json.data[0].episodes
            this.episodes = episodesData
            if (episodesData === undefined) {
              //this.dataLoadingComplete = true
              throw {type:"noEpisodes"}
            }
            resolve(episodesData)
          }).catch(err =>{
            //console.log(err)
            // показывает уведомление

            if (err.type === "noEpisodes"){
              this.$store.commit('changeGlobalNatification',{
                type:"error",
                message:"Что-то поломалось. Не смог получить список эпизодов.",
                code:"SmotretAnimeRU"
              })
            }
            reject("У выбранного аниме нет эпизодов в базе")
          })
        })
     },
     getTranslations:function(id){
       return new Promise((resolve, reject) => {
         fetch(`https://smotret-anime.online/api/episodes/${id}?fields=translations&access_token=${this.$store.state.memory.smotretAnimeRU.access_token}`, {
           method:'GET',
           }).then(res => {
             //console.log(res)
             if (res.ok) return res.json()
             else throw res
           }).then(json => {
             let translationsData = json.data.translations
             if (translationsData === undefined) throw {type:"noTranslations"}
             //console.log(translationsData)
             //Загружаю только русскую озвучку и субтитры
             let resolveData = translationsData.filter(item=>item.height!=0 && item.typeLang === "ru")
             if (resolveData.length == 0) {
               this.translations = translationsData
               resolve(translationsData)
               this.$store.commit('changeGlobalNatification',{
                 type:"warn",
                 message:"Уданной серии нет русской озвучки. Загружаю все доступные озвучки.",
                 code:"SmotreAnimeRU"
               })
             }
             else{
               this.translations = resolveData
               resolve(resolveData)
             }
           }).catch(err =>{
             //console.log(err)
             // показывает уведомление
             if (err.type === "noTranslations"){
               this.$store.commit('changeGlobalNatification',{
                 type:"error",
                 message:"Что-то поломалось. Не смог получить список переводов.",
                 code:"SmotreAnimeRU"
               })
             }
             reject("У выбранного аниме нет переводов в базе.")
           })
         })
     },
     getVideo:function(id){
       return new Promise((resolve, reject) => {
         fetch(`https://smotret-anime.online/api/translations/embed/${id}?fields=stream,subtitlesUrl,subtitlesVttUrl&access_token=${this.$store.state.memory.smotretAnimeRU.access_token}`, {
           method:'GET',
           }).then(res => {
             if (res.ok) return res.json()
             else throw res
           }).then(json => {
             //console.log(json.data)
             this.videoData = json.data
             if (this.videoData === undefined) throw {type:"noVideo"}
             resolve(json.data)
           }).catch(err =>{
             //console.log(err)
             // показывает уведомление
             if (err.type === "noVideo") {
               this.$store.commit('changeGlobalNatification',{
                 type:"error",
                 message:"Что-то поломалось. Не смог получить ссылку на видео.",
                 code:"SmotreAnimeRU"
               })
             }
             reject("У выбранного аниме нет видео в базе.")
           })
         })
     },
     findCurrentEpisode:function(episodesData,currentEpisodeShiki){
       // Есть аниме с количеством эпизодов больше чем заявлено
       console.log(episodesData)
       let nextEp
       if (currentEpisodeShiki == this.animeData.episodes) nextEp = currentEpisodeShiki
       else nextEp = currentEpisodeShiki+1
       let episode = episodesData.find((element)=>{
         if (parseInt(element.episodeInt) == nextEp) return true
         else return false
       })
       console.log(episode)
       if (episode !== undefined){
         return episode
       }
       else{
         //Не нашли.Открываем нулевой.
         // скорее вмего мы закончили просмотр тайтла
         this.$store.commit('changeGlobalNatification',{
           type:"warn",
           message:"Требуемый эпизод не обнаружен. Включаю 1 эпизод.",
           code:"SmotreAnimeRU"
         })
         let firstEpisode = episodesData.find((element)=>{
           if (parseInt(element.episodeInt) == 1) return true
           else return false
         })
         if (firstEpisode !== undefined){
           return firstEpisode
         }
         else return episodesData[0]
       }
     },
     findTranslations:function(translationsData){
       let animeInMemory = this.$store.state.memory.animes[this.animeData.id]
       //console.log(animeInMemory)
       //если запись об аниме есть в памяти
       if (animeInMemory === undefined) return translationsData[0]
       else{
         let translationsInMemory = animeInMemory.translations
         //Если нет записи об переводах
         if (translationsInMemory === undefined) return translationsData[0]
         else {
           //Если выбранная озвучка есть в памяти
           let returnvalue = translationsData.find((item)=>{
             return item.priority == translationsInMemory.priority && item.authorsList.includes(translationsInMemory.authorsList[0])
           })
           if (returnvalue === undefined){
             this.$store.commit('changeGlobalNatification',{
               type:"warn",
               message:"Требуемая озвучка не обнаружена. Включаю 1 озвучку.",
               code:"SmotreAnimeRU"
             })
             return translationsData[0]
           }
           else{
             console.log("Перевод обнаружен в памяти")
             return returnvalue
           }
         }
         //console.log(this.chooseTranslationsFromMemory)

       }
     },
     loadData:function(id){

       return new Promise((resolve, reject) => {
         //(id)
         // Здесь загружаем данные об аниме(инфа и инфа пользователя)
         this.getAnimeData(id,0).then((data)=>{
           setTimeout(()=>{
             this.getSimilarAnimeData(id,0).then((data)=>{
               console.log(data)
             })
           },500)
           setTimeout(()=>{
             this.getFranchiseAnimeData(id,0).then((data)=>{
               console.log(data)
             })
           },1000)
           //console.log(data)
           let userCurrentEpisodeShiki
           // если аниме нету в списке аниме пользователя
           if (data.user_rate === null) {
             //Приравниваем эпизод к нулевому и добавляем аниме на шикимори
             userCurrentEpisodeShiki = 0
           }
           else userCurrentEpisodeShiki = data.user_rate.episodes
           // Загрузить со SmotretAnime список эпизодов
           this.getEpisodes(data.myanimelist_id).then((episodesData)=>{
             console.log(episodesData)
             //Выбрать нужный мне эпизод
             this.choosenEpisode = this.findCurrentEpisode(episodesData,userCurrentEpisodeShiki)
             console.log(this.choosenEpisode)
             // Загрузить со SmotretAnime список озвучки для эпизода
             this.getTranslations(this.choosenEpisode.id).then((translationsData)=>{
               console.log(translationsData)
               //Выбрать озвучку
               this.choosenTranslation = this.findTranslations(translationsData)
               // Загрузить со SmotretAnime url и суб
               this.getVideo(this.choosenTranslation.id).then(()=>{
                 //console.log(this.videoOptions)
                 //console.log(this.animeData,this.episodes,this.choosenEpisode,this.translations,this.choosenTranslation)
                 this.dataLoadingComplete = true
               })
               // Включить плеер dataLoadingComplete = true
             })
           },(()=>{
             //rejected

             this.dataLoadingComplete = true
             this.hasVideo = false
             this.$store.commit("updatePlayerStatusMenuActive",true)

             //console.log(this.dataLoadingComplete)
           }))
         })
         resolve(1)
       })
     },
     leftMenuPressDown:function(event){
       let elem = event.target
       let nextElem = elem.nextElementSibling
       if (nextElem != null){
         nextElem.focus({preventScroll: true})
       }
     },
     leftMenuPressUp:function(event){
       let elem = event.target
       let prevElem = elem.previousElementSibling
       if (prevElem != null){
         prevElem.focus({preventScroll: true})
       }
     },
     leftMenuPressBackspace:function(){
       console.log(this.$router)
       this.$router.push("/mainPage/chooseTitle")
     },
     leftMenuBeginingPressEnter:function(){
       this.startFromBegining = !this.startFromBegining
       this.$store.commit("updatePlayerStatusMenuActive",false)
     },
     leftMenuPlayPressEnter:function(){
       this.$store.commit("updatePlayerStatusMenuActive",false)
     },
     leftMenuEpisodesPressEnter:function(){
       this.menuActive = 1;
       this.$nextTick(()=>{
         let elem = this.$el.querySelector(`#epid${this.choosenEpisode.id}`)
         elem.focus({preventScroll: true})
       })
     },
     leftMenuTransitionPressEnter:function(){
       this.menuActive = 2;
       this.$nextTick(()=>{
         let elem = this.$el.querySelector(`#trid${this.choosenTranslation.id}`)
         elem.focus({preventScroll: true})
       })
     },
     leftMenuSimilarPressEnter:function(){
       this.menuActive = 3;
       this.$nextTick(()=>{
         let elem = this.$el.querySelector(".similarMenuCard")
         elem.focus({preventScroll: true})
       })
     },
     leftMenuFranchisePressEnter:function(){
       this.menuActive = 4;
       this.$nextTick(()=>{
         let elem = this.$el.querySelector(".franchiseMenuCard")
         elem.focus({preventScroll: true})
       })
     },
     episodesMenuCardPressDown:function(event){
       let elem = event.target
       let nextElem = elem.nextElementSibling
       if (nextElem != null){
         nextElem.focus({preventScroll: true})
       }
     },
     episodesMenuCardPressUp:function(event){
       let elem = event.target
       let prevElem = elem.previousElementSibling
       if (prevElem != null){
         prevElem.focus({preventScroll: true})
       }
     },
     episodesMenuCardPressLeft:function(){
       let elem = this.$el.querySelector(`.lu.episodes`)
       elem.focus({preventScroll: true})
       this.menuActive = 0;
     },
     episodesMenuCardFocus:function(event){
       let elem = event.target
       //let parentElementCoords = elem.parentElement.children[2].getBoundingClientRect()
       let elemCoords = elem.getBoundingClientRect()
       //console.log(elem.parentElement.children[3])
       //console.log(parentElementCoords)
       if (elemCoords.y>608 || elemCoords.y<676) {
         elem.parentElement.scrollBy({
           top: elemCoords.y - 608,
           behavior:'auto'
         })
       }
       //let prevElemCoords = prevElem.getBoundingClientRect()
     },
     episodesMenuCardPressEnter:function(event){
       this.dataLoadingComplete = false;
       let elem = event.target
       let index = elem.getAttribute("index")
       this.choosenEpisode = this.episodes[index]
       //console.log(this.choosenEpisode)
       // Загрузить со SmotretAnime список озвучки для эпизода
       this.getTranslations(this.choosenEpisode.id).then((translationsData)=>{
         //console.log(translationsData)
         this.choosenTranslation = this.findTranslations(translationsData)
         // Загрузить со SmotretAnime url и суб
         this.getVideo(this.choosenTranslation.id).then(()=>{
           //console.log(this.videoOptions)
           this.dataLoadingComplete = true
           this.$store.commit("updatePlayerStatusMenuActive",false)
         })
       })
       this.menuActive = 0
     },
     translationsMenuCardPressEnter:function(event){
       this.dataLoadingComplete = false;
       let elem = event.target
       let index = elem.getAttribute("index")
       //Выбрали озвучку
       this.choosenTranslation = this.translations[index]
       //this.chooseTranslationsFromMemory = this.choosenTranslation.priority
       this.$store.commit('updateAnimeTransition',{
         animeId:this.animeData.id,
         translations:{
           priority:this.choosenTranslation.priority,
           authorsList:this.choosenTranslation.authorsList
         }
       })
       //добавить выбранную озвучку память
       //console.log(this.choosenTranslation)
       // Загрузить со SmotretAnime url и суб
       this.getVideo(this.choosenTranslation.id).then(()=>{
         //console.log(this.videoOptions)
         this.dataLoadingComplete = true
         this.$store.commit("updatePlayerStatusMenuActive",false)
       })
       this.menuActive = 0

     },
     translationsMenuCardPressLeft:function(){
       let elem = this.$el.querySelector(`.lu.translations`)
       elem.focus({preventScroll: true})
       this.menuActive = 0;
     },
     translationsMenuCardFocus:function(event){
       let elem = event.target
       //let parentElementCoords = elem.parentElement.children[1].getBoundingClientRect()
       //console.log(parentElementCoords)
       let elemCoords = elem.getBoundingClientRect()
       //console.log(elem.parentElement.children[1])
       //console.log(parentElementCoords)
      if (elemCoords.y>542 || elemCoords.y<680) {
         elem.parentElement.scrollBy({
           top: elemCoords.y - 542,
           behavior:'auto'
         })
       }
       //let prevElemCoords = prevElem.getBoundingClientRect()
     },
     similarMenuCardPressEnter:function(event){
       //this.dataLoadingComplete = false;
       let elem = event.target
       let index = elem.getAttribute("index")

       this.$router.push({
         name:"player",
         params:{
           id:this.similarAnimeData[index].id
         }
       })
     },
     similarMenuCardPressLeft:function(){
       let elem = this.$el.querySelector(`.lu.similar`)
       elem.focus({preventScroll: true})
       this.menuActive = 0;
     },
     franchiseMenuCardPressLeft:function(){
       let elem = this.$el.querySelector(`.lu.franchise`)
       elem.focus({preventScroll: true})
       this.menuActive = 0;
     },
     franchiseMenuCardPressEnter:function(event){
       //this.dataLoadingComplete = false;
       let elem = event.target
       let index = elem.getAttribute("index")

       this.$router.push({
         name:"player",
         params:{
           id:this.franchiseAnimeData.nodes[index].id
         }
       })
     },
     similarMenuCardFocus:function(event){
       let elem = event.target
       //let parentElementCoords = elem.parentElement.children[0].getBoundingClientRect()
       //console.log(parentElementCoords)
       let elemCoords = elem.getBoundingClientRect()
       //console.log(elem.parentElement.children[1])
       //console.log(parentElementCoords)
       if (elemCoords.y>324 || elemCoords.y<628) {
         elem.parentElement.scrollBy({
           top: elemCoords.y - 324,
           behavior:'auto'
         })
       }
       //let prevElemCoords = prevElem.getBoundingClientRect()
     },
     mainmenuSubGetFocus:function(event){
       this.$nextTick(()=>{
         if (this.hasVideo) event.target.querySelector(".lu.play").focus()
         else event.target.querySelector(".lu").focus()
       })
     }
  },
}
</script>


<style scoped="true" lang="scss" src="./videoPlayerComponent.scss"></style>
