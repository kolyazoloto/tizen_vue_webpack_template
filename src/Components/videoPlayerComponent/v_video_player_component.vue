<template>
  <div class="videoPlayerComponent">

    <div  class="mainmenu">
      <transition name="fadeLR">
      <template v-if="playerStatusMenuActive">
      <div tabindex="-1" v-focus @focus="mainmenuSubGetFocus" v-if="dataLoadingComplete" class="mainmenuSub">
        <div  class="infoSection">
          <h3  :style="{fontSize:fontSize+'px'}" class="title">{{animeData.russian}}</h3>
          <div class="statistics">
            <h3 class="score">{{animeData.score}}</h3>
            <h3 class="year">{{season[1]}}</h3>
            <h3 class="rating">{{rating}}</h3>
            <h3 v-if="hasVideo" class="episodes">{{animeData.episodes}} EP</h3>
            <h3 class="kind">{{kind}}</h3>
          </div>
          <h3 v-if="animeData.next_episode_at != null" class="nextEpisodeAt">Новый эпизод {{nextEpisodeAt}}</h3>

        </div>
        <div class="menuSection">

          <div class="leftMenuSection">
            <div class="li">

              <div
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              @keydown.10009.prevent="leftMenuPressBackspace"
              @keydown.left.prevent="leftMenuRatePressLeft"
              @keydown.right.prevent="leftMenuRatePressRight"
              @keydown.enter.prevent="leftMenuRatePressEnter"
              @blur="leftMenuRatePressBlur"
              @focus="leftMenuRatePressFocus"
              tabindex="-1" class="lu rate"
              >
                <transition name="fadeRate" mode="out-in">
                  <div class="luRateNoActiveContainer" v-if="userAnimescore == 0 && !luRateActive" key="one">
                    <thumbUpIcon class="icon"></thumbUpIcon>
                    <h3>Оценить</h3>
                  </div>
                  <div class="rateContainer" v-if="userAnimescore != 0 || luRateActive"  key="two">
                    <StarRating
                    v-model="rate"
                    :increment="0.25"
                    :item-size="35"
                    :max-rating="5"
                    :text-class="'ratingText'"
                    :show-rating="false"
                    inactive-color="#efe9e9"
                    active-color="#ffd055"
                    :border-width="0"
                    ></StarRating>
                    <h3 v-if="userAnimescore !== undefined" class="userAnimescore">{{userAnimescore.toFixed(1)}}</h3>
                  </div>
                </transition>

              </div>

              <div
              @keydown.down.prevent="leftMenuPressDown"
              @keydown.up.prevent="leftMenuPressUp"
              @keydown.enter.prevent="leftMenuPlayPressEnter"
              @keydown.backspace.prevent="leftMenuPressBackspace"
              @keydown.10009.prevent="leftMenuPressBackspace"
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
              @keydown.10009.prevent="leftMenuPressBackspace"
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
              @keydown.10009.prevent="leftMenuPressBackspace"
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
              @keydown.10009.prevent="leftMenuPressBackspace"
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
              @keydown.10009.prevent="leftMenuPressBackspace"
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
              @keydown.10009.prevent="leftMenuPressBackspace"
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
                  @keydown.10009.prevent="episodesMenuCardPressLeft"
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
                @keydown.10009.prevent="translationsMenuCardPressLeft"
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
                @keydown.10009.prevent="similarMenuCardPressLeft"
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
                @keydown.10009.prevent="franchiseMenuCardPressLeft"
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
        @playnext="playNext"
        v-if="dataLoadingComplete && hasVideo"
        :options="videoOptions"
        :title="animeData.russian"
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
import {StarRating} from 'vue-rate-it'

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
    accMultiIcon,
    StarRating
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
      fontSize:null,
      userCurrentEpisodeShiki:undefined,
      userAnimeStatus:undefined,
      userAnimescore:undefined,
      userAnimescoreBasic:undefined,
      luRateActive:false,
      //Переменные отвечающие за активное меню
      menuActive:0, // 0 выкл, 1 эпизоды ,2 переводы, 3 похожие,4 франшиза
    }
  },
  computed:{
    rate:function(){
      return this.userAnimescore/2
    },
    nextEpisodeAt:function(){
      let date = new Date(this.animeData.next_episode_at)
      let localeDate = date.toLocaleDateString("ru-RU")
      return localeDate
    },
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
      if (temp == 'g'){
        return 'G'
      }
      else return temp;
    },
    videoOptions: function(){
      return {
        autoplay: true,
        controls: true,
        width:"1920",
        height:"1080",
        preload:"none",
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
    this.loadData(this.$route.params.id)
  },
  watch: {
    playerStatusMenuActive:function(val){
      if (val === true){
        if (this.fontSize == null){
          this.$nextTick(()=>{
            let width = this.$el.querySelector(".mainmenuSub .title").getBoundingClientRect().width
            let widthScroll = this.$el.querySelector(".mainmenuSub .title").scrollWidth
            this.fontSize = 110*width/widthScroll
          })
        }
      }
    },
    $route(to, from) {

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
      this.fontSize = null
      this.userCurrentEpisodeShiki = undefined
      this.userAnimeStatus = undefined
      this.userAnimescore = undefined
      this.userAnimescoreBasic = undefined
      this.luRateActive = false
      this.$store.commit("updatePlayerStatusMenuActive",false)
      this.loadData(to.params.id)
    }
  },
  methods:{

    getAnimeData:function(id,repeatReq){
      //console.log("ALOSULABLYA" + id)
      return new Promise((resolve, reject) => {
        this.$store.dispatch("refreshAccesTokenIfNeeded").then(()=>{
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
            console.log(this.animeData)
            resolve(json)
          }).catch(err => {
            let code = err.status
            if (code == 429){
              setTimeout(()=>{
                if (repeatReq < 2) this.getAnimeData(id,++repeatReq)
              },1000)
            }
            else{
              err.json().then(json => {
                this.$store.commit('changeGlobalNatification',{
                  type:"error",
                  message:json.error,
                  code:code
                })
              })
            }
          })
        })
      })
    },
    getSimilarAnimeData:function(id,repeatReq){
      return new Promise((resolve, reject) => {
        this.$store.dispatch("refreshAccesTokenIfNeeded").then(()=>{
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
            if (code == 429){
              setTimeout(()=>{
                if (repeatReq < 2) this.getSimilarAnimeData(id,++repeatReq)
              },1000)
            }
            else{
              err.json().then(json => {
                this.$store.commit('changeGlobalNatification',{
                  type:"error",
                  message:json.error,
                  code:code
                })
              })
            }
          })
        })
      })
    },
    getFranchiseAnimeData:function(id,repeatReq){
      return new Promise((resolve, reject) => {
        this.$store.dispatch("refreshAccesTokenIfNeeded").then(()=>{
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
            if (code == 429){
              setTimeout(()=>{
                if (repeatReq < 2) this.getFranchiseAnimeData(id,++repeatReq)
              },1000)
            }
            else{
              err.json().then(json => {
                this.$store.commit('changeGlobalNatification',{
                  type:"error",
                  message:json.error,
                  code:code
                })
              })
            }
          })
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
            //console.log(id)
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
         fetch(`https://smotret-anime.online/api/translations/embed/${id}?access_token=${this.$store.state.memory.smotretAnimeRU.access_token}`, {
           method:'GET',
           }).then(res => {
             if (res.ok) return res.json()
             else throw res
           }).then(json => {
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
       //console.log(episodesData)
       console.log(currentEpisodeShiki)
       let firstEpisode = episodesData.find((element)=>{
         if (parseInt(element.episodeInt) == 1) return true
         else return false
       })

       let nextEp
       if (currentEpisodeShiki == this.animeData.episodes) {
         this.shikiUserRateUpdate(`user_rate[episodes]=0&user_rate[status]=rewatching`).then((data)=>{
           this.userCurrentEpisodeShiki = data.episodes
           this.userAnimeStatus = data.status
         })
         nextEp = 1
       }
       else nextEp = currentEpisodeShiki+1

       let episode = episodesData.find((element)=>{
         if (parseInt(element.episodeInt) == nextEp) return true
         else return false
       })
       //console.log(episode)
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
             //console.log("Перевод обнаружен в памяти")
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
               ////console.log(data)
             })
           },500)
           setTimeout(()=>{
             this.getFranchiseAnimeData(id,0).then((data)=>{
               //console.log(data)
             })
           },1000)
           //console.log(data)
           let userCurrentEpisodeShiki

           // если аниме нету в списке аниме пользователя
           if (data.user_rate === null) {
             //Приравниваем эпизод к нулевому и добавляем аниме на шикимори
             new Promise((resolve,reject)=>{
               setTimeout(()=>{
                 this.shikiUserRateCreate(0)
               },3000)}).then((data)=>{
                 this.userAnimeStatus = data.status
               })
             userCurrentEpisodeShiki = 0
           }
           else {
             userCurrentEpisodeShiki = data.user_rate.episodes
             this.userAnimeStatus = data.user_rate.status
             this.userAnimescore = data.user_rate.score
             this.userAnimescoreBasic = data.user_rate.score
           }
           this.userCurrentEpisodeShiki = userCurrentEpisodeShiki
           // Загрузить со SmotretAnime список эпизодов
           this.getEpisodes(data.myanimelist_id).then((episodesData)=>{
            // console.log(episodesData)
             //Выбрать нужный мне эпизод
             this.choosenEpisode = this.findCurrentEpisode(episodesData,userCurrentEpisodeShiki)
          //   console.log(this.choosenEpisode)
             // Загрузить со SmotretAnime список озвучки для эпизода
             this.getTranslations(this.choosenEpisode.id).then((translationsData)=>{
            //   console.log(translationsData)
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
     playNext:function(){
       console.log("playNext")
       let currentEpisode = this.choosenEpisode
       if (currentEpisode.episodeInt == this.animeData.episodes){
         console.log("Посмотрели последнюю серию")
         this.$store.commit("updatePlayerStatusMenuActive",true)
         return
       }

       //console.log(this.choosenEpisode)
       let index = this.episodes.indexOf(currentEpisode)
       if (index != this.episodes.length-1) this.choosenEpisode = this.episodes[index+1]
       //console.log(this.choosenEpisode)
       this.dataLoadingComplete = false;
       // Загрузить со SmotretAnime список озвучки для эпизода
       this.getTranslations(this.choosenEpisode.id).then((translationsData)=>{
         //console.log(translationsData)
         this.choosenTranslation = this.findTranslations(translationsData)
         // Загрузить со SmotretAnime url и суб
         this.getVideo(this.choosenTranslation.id).then(()=>{
           //console.log(this.videoOptions)
           this.$store.commit("updatePlayerStatusMenuActive",false)
           this.dataLoadingComplete = true
           // отправить некст эпизод в шикимори
           //Добавим плюс один к текущему эпизоду шикимори
           console.log(this.animeData)
           if (this.userCurrentEpisodeShiki+1 == currentEpisode.episodeInt){
             this.shikiUserRateIncrement(0).then((user_rate)=>{
               this.userCurrentEpisodeShiki = user_rate.episodes
               this.userAnimeStatus = user_rate.status
               this.userAnimescore = data.user_rate.score
               this.userAnimescoreBasic = data.user_rate.score
             })
             //console.log("НУЖЕН ИНКРЕМЕНТ")
           }
         })
       })
     },
     shikiUserRateUpdate:function(params,repeatReq){
       return new Promise((resolve, reject) => {
         this.$store.dispatch("refreshAccesTokenIfNeeded").then(()=>{
           fetch(`https://shikimori.one/api/v2/user_rates/${this.animeData.user_rate.id}?${params}`, {
             method:'PATCH',
             headers:{
               "Authorization": "Bearer " + this.$store.state.memory.shiki.access_token
             },
           }).then(r => {
             if (!r.ok) throw r
             return r.json()
           }).then(json => {
             //console.log(json)
             resolve(json)
           }).catch(err => {
             let code = err.status
             if (code == 429){
               setTimeout(()=>{
                 if (repeatReq < 2) this.shikiUserRateUpdate(params,++repeatReq)
               },1000)
             }
             else{
               err.json().then(json => {
                 this.$store.commit('changeGlobalNatification',{
                   type:"error",
                   message:json.error,
                   code:code
                 })
               })
             }
           })
         })
       })
     },
     shikiUserRateCreate:function(repeatReq){
       return new Promise((resolve, reject) => {
         this.$store.dispatch("refreshAccesTokenIfNeeded").then(()=>{
           fetch(`https://shikimori.one/api/v2/user_rates?user_rate[target_id]=${this.animeData.id}&user_rate[user_id]=${this.$store.state.shikimori.user_id}&user_rate[target_type]=Anime`, {
             method:'POST',
             headers:{
               "Authorization": "Bearer " + this.$store.state.memory.shiki.access_token
             },
           }).then(r => {
             if (!r.ok) throw r
             return r.json()
           }).then(json => {
             console.log(json)
             resolve(json)
           }).catch(err => {
             let code = err.status
             if (code == 429){
               setTimeout(()=>{
                 if (repeatReq < 2) this.shikiUserRateCreate(++repeatReq)
               },1000)
             }
             else{
               err.json().then(json => {
                 this.$store.commit('changeGlobalNatification',{
                   type:"error",
                   message:json.error,
                   code:code
                 })
               })
             }
           })
         })
       })
     },
     shikiUserRateIncrement:function(repeatReq){
       return new Promise((resolve, reject) => {
         this.$store.dispatch("refreshAccesTokenIfNeeded").then(()=>{
           fetch(`https://shikimori.one/api/v2/user_rates/${this.animeData.user_rate.id}/increment`, {
             method:'POST',
             headers:{
               "Authorization": "Bearer " + this.$store.state.memory.shiki.access_token
             },
           }).then(r => {
             if (!r.ok) throw r
             return r.json()
           }).then(json => {
             //console.log(json)
             resolve(json)
           }).catch(err => {
             let code = err.status
             if (code == 429){
               setTimeout(()=>{
                 if (repeatReq < 2) this.shikiUserRateIncrement(++repeatReq)
               },1000)
             }
             else{
               err.json().then(json => {
                 this.$store.commit('changeGlobalNatification',{
                   type:"error",
                   message:json.error,
                   code:code
                 })
               })
             }
           })
         })
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
       //console.log(this.$router)
       this.$store.commit("updatePlayerStatusMenuActive",false)
       this.$router.push({name:this.$route.query.from})
     },
     leftMenuBeginingPressEnter:function(){
       this.startFromBegining = !this.startFromBegining
       this.$store.commit("updatePlayerStatusMenuActive",false)
     },
     leftMenuRatePressEnter:function(){
       this.shikiUserRateUpdate(`user_rate[score]=${this.userAnimescore}`).then((data)=>{
         this.userAnimescore = data.score
         this.userAnimescoreBasic = data.score
       })
     },
     leftMenuRatePressLeft:function(){
       if (this.userAnimescore >0) this.userAnimescore -= 0.5
     },
     leftMenuRatePressRight:function(){
       if (this.userAnimescore <10) this.userAnimescore += 0.5
     },
     leftMenuRatePressFocus:function(){
       this.luRateActive = true
     },
     leftMenuRatePressBlur:function(){
       this.luRateActive = false
       this.userAnimescore = this.userAnimescoreBasic
     },
     leftMenuPlayPressEnter:function(){
       //console.log(this.$el.querySelector("video"))
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
       let elemCoords = elem.getBoundingClientRect()
       if (elemCoords.y>608 || elemCoords.y<676) {
         elem.parentElement.scrollBy({
           top: elemCoords.y - 608,
           behavior:'auto'
         })
       }
     },
     episodesMenuCardPressEnter:function(event){

       this.dataLoadingComplete = false;
       let elem = event.target
       let index = elem.getAttribute("index")
       this.choosenEpisode = this.episodes[index]
       console.log(this.choosenEpisode)
       /*this.shikiUserRateUpdate(`user_rate[episodes]=${this.choosenEpisode.episodeInt-1}`,0).then((user_rate)=>{
         this.userCurrentEpisodeShiki = user_rate.episodes
         this.userAnimeStatus = user_rate.status
         this.userAnimescore = user_rate.score
         this.userAnimescoreBasic = user_rate.score
       })*/
       //console.log(this.choosenEpisode)
       // Загрузить со SmotretAnime список озвучки для эпизода
       this.getTranslations(this.choosenEpisode.id).then((translationsData)=>{
         //console.log(translationsData)
         this.choosenTranslation = this.findTranslations(translationsData)
         // Загрузить со SmotretAnime url и суб
         this.getVideo(this.choosenTranslation.id).then(()=>{
           //console.log(this.videoOptions)
           this.$store.commit("updatePlayerStatusMenuActive",false)
           this.dataLoadingComplete = true
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
       this.$store.dispatch("writeFile")
       //добавить выбранную озвучку память
       console.log(this.choosenTranslation)
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
       /*let index = elem.getAttribute("index")
       console.log(this.translations[index])*/
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
         },
         query:this.$route.query,
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
       //console.log(elem.parentElement.getBoundingClientRect())
       this.$router.push({
         name:"player",
         params:{
           id:this.franchiseAnimeData.nodes[index].id
         },
         query:this.$route.query,
       })
     },
     similarMenuCardFocus:function(event){
       let elem = event.target
       let elemCoords = elem.getBoundingClientRect()
       console.log(elem.parentElement.getBoundingClientRect())
       if (elemCoords.y>324 || elemCoords.y<1004) {
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
