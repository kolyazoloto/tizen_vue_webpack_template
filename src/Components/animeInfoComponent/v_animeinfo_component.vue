<template>

    <div class="animeInfoComponent">
      <div class="screen">
        <img :src="'https://shikimori.one/' + activeAnimeData.fullData.screenshots[1].original">
        <div class="screenBackground"></div>
      </div>


      <h1 class="name">{{activeAnimeData.fullData.name}}</h1>


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

</template>

<script>

export default {
  name: 'animeInfoComponent',
  components: {

  },
  computed:{
    genres:function(){
      let genreList = this.$store.state.activeAnimeData.fullData.genres
      if (genreList.length > 6){
          genreList = genreList.slice(0,5)
      }
      return genreList
    },
    kind:function(){
      return this.$store.state.activeAnimeData.fullData.kind.toUpperCase()
    },
    description:function(){
      let temp = this.$store.state.activeAnimeData.fullData.description
      return temp
    },
    year:function(){
      let temp = new Date(this.$store.state.activeAnimeData.fullData.released_on).getUTCFullYear()
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


<style lang="scss" src="./animeInfoComponent.scss"></style>
