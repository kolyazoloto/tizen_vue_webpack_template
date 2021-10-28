<template>
  <div class="videoPlayerComponent">

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
      videoOptions: {
        autoplay: true,
        controls: true,
        sources: [
          {
            src:"/path/to/video.mp4",
          }
        ]
      },
      dataLoadingComplete:false,
      animeData:undefined,
      episodes:undefined,
    }
  },
  computed:{
    //Предполагаю что данные из памяти устройства уже загружены
    // Беру данные о выбранной озвучке
  },
  watch:{

  },
  created:function(){
    let id = this.$route.params.id
    //console.log(id)
    // Здесь загружаем данные об аниме(инфа и инфа пользователя)
    this.getAnimeData(id).then((data)=>{
      console.log(data)
      let userCurrentEpisodeShiki = data.user_rate.episodes
      // Загрузить со SmotretAnime список эпизодов
      this.getEpisodes(data.myanimelist_id).then((episodesData)=>{
        console.log(episodesData)
        //Беру нужный мне эпизод
        this.findCurrentEpisode(episodesData,userCurrentEpisodeShiki)

      })
    })




    // Загрузить со SmotretAnime список озвучки для эпизода
    // Загрузить со SmotretAnime url и суб
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
              message:"Что-то поломалось",
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
       console.log(episode)
       if (episode !== undefined){
         //Если нашли эпизод
       }
       else{
         //Не нашли.Открываем нулевой.
         // скорее вмего мы закончили просмотр тайтла
       }
     },

  },
}
</script>


<style lang="scss" src="./videoPlayerComponent.scss"></style>
