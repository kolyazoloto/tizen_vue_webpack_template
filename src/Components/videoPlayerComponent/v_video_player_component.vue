<template>
  <div class="videoPlayerComponent">
    <videoJSComponent
    v-if="dataLoadingComplete"
    :options="videoOptions"
    :title="'zalupaebanaya'"
    :episode="'эпизод 123'"
    :height="'1080'"
    :ass="videoData.subtitlesUrl"
    />
  </div>
</template>

<script>
import videoJSComponent from "./videoJSComponent/v_videoJS_component.vue"

export default {
  name: 'videoPlayerComponent',
  components: {
    videoJSComponent
  },
  data:function(){
    return{

      dataLoadingComplete:false,
      animeData:undefined,
      episodes:undefined,
      choosenEpisode:undefined,
      translations:undefined,
      choosenTranslation:undefined,
      videoData:undefined
    }
  },
  computed:{
    //Предполагаю что данные из памяти устройства уже загружены
    // Беру данные о выбранной озвучке
    chooseTranslationsFromMemory:function(){
      return undefined
    },
    videoOptions: function(){
      return {
        autoplay: true,
        controls: true,
        sources: [
          {
            src:this.videoData.stream[0].urls[0],
            type: 'video/mp4',
          }
        ],
        /*plugins: {
          ass: {
            src: this.videoData.subtitlesUrl
          }
        }*/

      }
    },

  },
  watch:{

  },
  created:function(){


    this.loadData()
    console.log(this.videoData)
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
            commit('changeGlobalNatification',{
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
             commit('changeGlobalNatification',{
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
             commit('changeGlobalNatification',{
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
         commit('changeGlobalNatification',{
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
               console.log(this.videoOptions)
               this.dataLoadingComplete = true

             })
             // Включить плеер dataLoadingComplete = true
           })
         })
       })
     },

  },
}
</script>


<style lang="scss" src="./videoPlayerComponent.scss"></style>
