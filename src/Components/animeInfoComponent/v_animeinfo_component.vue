<template>
    <transition name="fade">
      <div v-show="animeInfoActiveStatus" class="animeInfoComponent">
        <div class="screen">
          <img  :src="'https://shikimori.one/' + activeAnimeData.fullData.screenshots[Math.floor(Math.random()*activeAnimeData.fullData.screenshots.length)].original">
          <div class="screenBackground"></div>
        </div>

        <div class="infoContainer">
          <h1 class="name">{{activeAnimeData.fullData.russian}}</h1>

          <div class="statistics">
            <h3 class="score">{{activeAnimeData.fullData.score}}</h3>
            <div class="dot"></div>
            <h3 class="year">{{year}}</h3>
            <div class="dot"></div>
            <h3 class="rating">{{rating}}</h3>
            <div class="dot"></div>
            <h3 class="episodes">{{activeAnimeData.fullData.episodes}} EP</h3>
            <div class="dot"></div>
            <h3 class="kind">{{kind}}</h3>
          </div>

          <div class="description" v-if="description !== null">{{description}}</div>

          <div class="genres">
            <div class="genre" v-for="genre in genres" :key="genre.id">
              <h3>{{genre.name}}</h3>
              <!--<div class="dot" v-if="activeAnimeData.fullData.genres.length-1 !=index"></div>-->
            </div>
          </div>
        </div>
      </div>


    </transition>

</template>

<script>

export default {
  name: 'animeInfoComponent',
  components: {

  },
  methods:{

  },
  computed:{
    animeInfoActiveStatus:function(){
      return this.$store.state.status.animeInfo
    },
    genres:function(){
      let genreList = this.$store.state.activeAnimeData.fullData.genres
      if (genreList.length > 5){
          genreList = genreList.slice(0,5)
      }
      //console.log(genreList)
      /*if (genreList.length < 5){
          while (genreList.length < 5){
              genreList.push({
                name:'_____'
              })
          }
      }*/
      return genreList
    },
    kind:function(){
      return this.$store.state.activeAnimeData.fullData.kind.toUpperCase()
    },
    description:function(){
      let temp = this.$store.state.activeAnimeData.fullData.description
      if (temp != null){
        ///////////////// Ищем квадратные скобки
        let indexSKB = undefined
        let errorCounter = 0
        while ((indexSKB = temp.indexOf('[')) != -1){
          if (errorCounter >= 10) break
          errorCounter++
          let firstDescripPart = temp.slice(0,indexSKB)
          let indexSKBEnd =  temp.indexOf(']',indexSKB)
          let secondDescripPart = temp.slice(indexSKBEnd+1)
          temp = firstDescripPart + secondDescripPart
        }
        ///////////////////////////////
        if (temp.length > 220){
          temp = temp.slice(0,220)
        }
        // Ищем последнюю точку
        let index = temp.lastIndexOf('.')
        ///
        if (index != -1){
            temp = temp.slice(0,index+1)
        }

      }
      return temp
    },
    year:function(){
      let temp = new Date(this.$store.state.activeAnimeData.fullData.aired_on).getUTCFullYear()
      return temp
    },
    rating:function(){
      let temp = this.$store.state.activeAnimeData.fullData.rating
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
    activeAnimeData:function(){
      return this.$store.state.activeAnimeData
    }
  }


}
</script>


<style scoped="true" lang="scss" src="./animeInfoComponent.scss"></style>
