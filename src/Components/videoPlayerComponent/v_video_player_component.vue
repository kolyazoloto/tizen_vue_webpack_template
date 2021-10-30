<template>
  <div class="videoPlayerComponent">

    <div class="mainmenu">
      <div class="infoSection">
        <h3 class="title">{{animeData.name}}</h3>
        <div class="statistics">
          <h3 class="score">{{animeData.score}}</h3>
          <h3 class="year">{{season[1]}}</h3>
          <h3 class="rating">{{rating}}</h3>
          <h3 class="episodes">{{animeData.episodes}} EP</h3>
          <h3 class="kind">{{kind}}</h3>
        </div>
      </div>
      <div class="menuSection">
        <div class="leftMenuSection">
          <div class="li">

            <div
            @keydown.down.prevent="leftMenuPressDown"
            @keydown.up.prevent="leftMenuPressUp"
            tabindex="-1" class="lu"
            >
              <thumbUpIcon class="icon"></thumbUpIcon>
              <h3>Оценить</h3>
            </div>

            <div
            @keydown.down.prevent="leftMenuPressDown"
            @keydown.up.prevent="leftMenuPressUp"
            tabindex="-1"
            class="lu"
            >
              <playIcon class="iconPlay"></playIcon>
              <h3>{{"Продолжить Ep. "+choosenEpisode.episodeInt}}</h3>
            </div>

            <div
            @keydown.down.prevent="leftMenuPressDown"
            @keydown.up.prevent="leftMenuPressUp"
            tabindex="-1"
            class="lu"
            >
              <rewindIcon class="icon"></rewindIcon>
              <h3>Начать сначала</h3>
            </div>

            <div
            @keydown.down.prevent="leftMenuPressDown"
            @keydown.up.prevent="leftMenuPressUp"
            @keydown.enter.prevent="leftMenuEpisodesPressEnter"
            tabindex="-1"
            class="lu"
            >
              <cardMultIcon class="icon"></cardMultIcon>
              <h3>Эпизоды</h3>
            </div>

            <div
            @keydown.down.prevent="leftMenuPressDown"
            @keydown.up.prevent="leftMenuPressUp"
            tabindex="-1"
            class="lu"
            >
              <subtitlesIcon class="icon"></subtitlesIcon>
              <h3>Озвучки</h3>
            </div>

            <div
            @keydown.down.prevent="leftMenuPressDown"
            @keydown.up.prevent="leftMenuPressUp"
            tabindex="-1"
            class="lu"
            >
              <viewGridIcon class="icon"></viewGridIcon>
              <h3>Похожие</h3>
            </div>

            <div
            @keydown.down.prevent="leftMenuPressDown"
            @keydown.up.prevent="leftMenuPressUp"
            tabindex="-1"
            class="lu"
            >
              <accMultiIcon class="icon"></accMultiIcon>
              <h3>Франшиза</h3>
            </div>

          </div>
        </div>
        <div class="rightMenuSection">
          <div v-show="menuActive === 1" class="episodesMenu">
            <div class="episodesMenuCard"
              v-for="(item,index) in episodes" :key="index" tabindex="-1"
              :index="index"
              @keydown.down.prevent="episodesMenuCardPressDown"
              @keydown.up.prevent="episodesMenuCardPressUp"
              @keydown.enter.prevent="episodesMenuCardPressEnter"
              @focus="episodesMenuCardFocus"
              >
              <h3>{{item.episodeFull}}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <videoJSComponent
      v-if="dataLoadingComplete"
      :options="videoOptions"
      :title="animeData.name"
      :episode="choosenEpisode.episodeFull"
      :height="choosenTranslation.height.toString()"
      :assUrl="videoData.subtitlesUrl"
      :vttUrl="videoData.subtitlesVttUrl"
    ></videoJSComponent>

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
  data:function(){
    return{

      dataLoadingComplete:false,
      animeData:undefined,
      episodes:undefined,
      choosenEpisode:undefined,
      translations:undefined,
      choosenTranslation:undefined,
      videoData:undefined,

      menuFocusTimer:undefined,

      //Переменные отвечающие за активное меню
      menuActive:0, // 0 выкл, 1 эпизоды
    }
  },
  computed:{
    //Предполагаю что данные из памяти устройства уже загружены
    // Беру данные о выбранной озвучке
    kind:function(){
      return this.animeData.kind.toUpperCase()
    },
    season:function(){
      let date = new Date(this.animeData.released_on)
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
    chooseTranslationsFromMemory:function(){
      return undefined
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
    this.loadData().then(()=>{
      //console.log(this.choosenEpisode)
    })

    // Включить плеер dataLoadingComplete = true
    // Загрузить данные с шикимори о похожих аниме и франшизе
  },
  mounted:function(){

  },
  methods:{
    getAnimeData:function(id){
      return new Promise((resolve, reject) => {
        fetch(`https://shikimori.one/api/animes/${id}`, {
          method:'GET',
          headers:{
            "Authorization": "Bearer " + this.$store.state.memory.shiki.access_token
          },
        }).then(r => {
          return r.json()
        }).then(json => {
          this.animeData = json
          //console.log(this.animeData)
          resolve(json)
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
            let episodesData = json.data[0].episodes
            this.episodes = episodesData
            resolve(episodesData)
          }).catch(err =>{
            //console.log(err)
            // показывает уведомление
            this.$store.commit('changeGlobalNatification',{
              type:"error",
              message:"Что-то поломалось. Не смог получить список эпизодов.",
              code:"SmotreAnimeRU"
            })
          })
        })
     },
     getTranslations:function(id){
       return new Promise((resolve, reject) => {
         fetch(`https://smotret-anime.online/api/episodes/${id}?fields=translations&access_token=${this.$store.state.memory.smotretAnimeRU.access_token}`, {
           method:'GET',
           }).then(res => {
             if (res.ok) return res.json()
             else throw res
           }).then(json => {
             let translationsData = json.data.translations
             //console.log(translationsData)
             this.translations = translationsData
             resolve(translationsData)
           }).catch(err =>{
             //console.log(err)
             // показывает уведомление
             this.$store.commit('changeGlobalNatification',{
               type:"error",
               message:"Что-то поломалось. Не смог получить список переводов.",
               code:"SmotreAnimeRU"
             })
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
             resolve(json.data)
           }).catch(err =>{
             //console.log(err)
             // показывает уведомление
             this.$store.commit('changeGlobalNatification',{
               type:"error",
               message:"Что-то поломалось. Не смог получить ссылку на видео.",
               code:"SmotreAnimeRU"
             })
           })
         })
     },
     findCurrentEpisode:function(episodesData,currentEpisodeShiki){
       let episode = episodesData.find((element)=>{
         if (parseInt(element.episodeInt) == currentEpisodeShiki+1) return true
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
         return episodesData[0]
       }
     },
     findTranslations:function(translationsData){
       if (this.chooseTranslationsFromMemory === undefined){
         return translationsData[0]
       }
       else{
         //Если выбранная озвучка есть в памяти
       }
     },
     loadData:function(){

       return new Promise((resolve, reject) => {
         let id = this.$route.params.id
         //(id)
         // Здесь загружаем данные об аниме(инфа и инфа пользователя)
         this.getAnimeData(id).then((data)=>{
           //console.log(data)
           let userCurrentEpisodeShiki = data.user_rate.episodes
           // Загрузить со SmotretAnime список эпизодов
           this.getEpisodes(data.myanimelist_id).then((episodesData)=>{
             //console.log(episodesData)
             //Выбрать нужный мне эпизод
             this.choosenEpisode = this.findCurrentEpisode(episodesData,userCurrentEpisodeShiki)

             // Загрузить со SmotretAnime список озвучки для эпизода
             this.getTranslations(this.choosenEpisode.id).then((translationsData)=>{
               //console.log(translationsData)
               //Выбрать озвучку
               this.choosenTranslation = this.findTranslations(translationsData)
               // Загрузить со SmotretAnime url и суб
               this.getVideo(this.choosenTranslation.id).then(()=>{
                 //console.log(this.videoOptions)
                 console.log(this.animeData,this.episodes,this.choosenEpisode,this.translations,this.choosenTranslation)
                 this.dataLoadingComplete = true

               })
               // Включить плеер dataLoadingComplete = true
             })
           })
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
     episodeFocus:function(){
       this.menuFocusTimer = setTimeout(()=>{
         this.episodeMenuActive = true
       },1000)
     },
     episodeBlur:function(){
       if (this.menuFocusTimer !== undefined){
         clearTimeout(this.menuFocusTimer)
       }
       if (this.episodeMenuActive === true ) this.episodeMenuActive = false
     },
     leftMenuEpisodesPressEnter:function(){
       this.menuActive = 1;
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
       console.log(this.choosenEpisode)
       // Загрузить со SmotretAnime список озвучки для эпизода
       this.getTranslations(this.choosenEpisode.id).then((translationsData)=>{
         //console.log(translationsData)
         this.choosenTranslation = this.findTranslations(translationsData)
         // Загрузить со SmotretAnime url и суб
         this.getVideo(this.choosenTranslation.id).then(()=>{
           //console.log(this.videoOptions)
           this.dataLoadingComplete = true
         })
       })
     },

  },
}
</script>


<style lang="scss" src="./videoPlayerComponent.scss"></style>
