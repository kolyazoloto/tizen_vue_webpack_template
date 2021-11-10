<template>
    <transition name="fade">
      <div  v-if="animeInfoActiveStatus" class="animeInfoComponent">
        <div class="screen">
          <img  v-if="activeAnimeData.fullData.screenshots.length>0" :src="'https://shikimori.one/' + activeAnimeData.fullData.screenshots[Math.floor(Math.random()*activeAnimeData.fullData.screenshots.length)].original">
          <div class="screenBackground"></div>
        </div>

        <div class="infoContainer">

          <div class="nameCont">
            <h3 class="name">{{activeAnimeData.fullData.russian}}</h3>
          </div>

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
  watch:{
    animeInfoActiveStatus:function(val){
      if (val == true){
        //console.log("zalupa")
        this.$nextTick(()=>{
          let elem = this.$el.querySelector(".name")
          let width = elem.parentElement.getBoundingClientRect().width
          let widthScroll = elem.scrollWidth
          //console.log(width/widthScroll)
          let fontsize  = 90*width/widthScroll
          if (width/widthScroll < 0.6 && width/widthScroll > 0.4) {
            elem.style.whiteSpace = "normal"
            elem.style.fontSize = 60 +'px'
          }
          if (width/widthScroll < 0.4) {
            elem.style.whiteSpace = "normal"
            elem.style.fontSize = 50 +'px'
          }
          else if(width/widthScroll > 0.6){
            elem.style.whiteSpace = "nowrap"
            elem.style.fontSize = fontsize+'px'
          }
          //console.log(this.fontSize)
        })
      }
    },
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
        if (temp.length > 180){
          temp = temp.slice(0,180)
        }
        let index = temp.lastIndexOf(' ')

        ///
        if (index != -1){
            temp = temp.slice(0,index)
        }
        temp += "..."
        // Ищем последнюю точку
        /*let index = temp.lastIndexOf('.')
        let index1 = temp.lastIndexOf('?')
        let index2 = temp.lastIndexOf('!')

        index = Math.max(...[index,index1,index2])
        ///
        if (index != -1){
            temp = temp.slice(0,index+1)
        }*/

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
      if (temp == 'g'){
        return 'G'
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
