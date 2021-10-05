<template>
  <div class="categoryElem" tabindex="-1" v-focus="categoryIndex==0" @focus="getFocus">
    <h2 class="categoryName">{{this.categoryNameRus}}</h2>
    <div class="category">
      <div class="animeCardComp" v-for="(item,index) in animeList" :key="index"
        tabindex="1"
        @focus="getFullAnimeData(item.id)"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
      >
        <animeCard
          :imgURL="item.image.original"
        ></animeCard>
      </div>
      <div class="returnToCategoryStart" tabindex="1"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
        >
        <h3>Вернуться к началу</h3>
      </div>
    </div>
  </div>
</template>

<script>
import animeCard from '../animeCardComponent/animeCardComponent.vue'
export default {
  name: 'category',
  props:['categoryName','categoryIndex'],

  components: {
    animeCard
  },
  data:function(){
    return{
      activeAnimeCard:undefined,
      timerRefreshAnimeInfo:undefined
    }
  },
  computed:{
    animeInfoActiveStatus:function(){
      return this.$store.state.status.animeInfo
    },
    animeList:function(){
      return this.$store.state.animeData[this.categoryName]
    },
    categoryNameRus:function(){
      if (this.categoryName == 'ongoing'){
        return 'Онгоинг'
      }
      if (this.categoryName == 'watching'){
        return 'Продолжить просмотр'
      }
      if (this.categoryName == 'planned'){
        return 'В планах'
      }
      if (this.categoryName == 'dropped'){
        return 'Заброшенные'
      }
    }
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
  methods:{
    getFullAnimeData:function(id){
      if (this.timerRefreshAnimeInfo !== undefined){
        clearTimeout(this.timerRefreshAnimeInfo)
      }
      this.timerRefreshAnimeInfo = setTimeout(this.$store.dispatch,500,'getFullAnimeData',id)
      //this.$store.dispatch('getFullAnimeData',id)
    },
    offAnimeStatus:function(){
      if (this.animeInfoActiveStatus){
        this.$store.commit('changeAnimeInfoStatus',false)
      }
    },
    pressRight:function(event){
      let elem = event.target
      let nextElem = elem.nextElementSibling
      let nextElemCoords = nextElem.getBoundingClientRect()
      if (nextElem != null){
        this.offAnimeStatus()
        elem.parentElement.scrollBy({
          left:nextElemCoords.x - 20,
          behavior:'smooth'
        })
        nextElem.focus({preventScroll: true})
      }
    },
    pressLeft:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      let prevElemCoords = prevElem.getBoundingClientRect()
      if (elem != null){
        this.offAnimeStatus()
        elem.parentElement.scrollBy({
          left: prevElemCoords.x - 10,
          behavior:'smooth'
        })
        prevElem.focus({preventScroll: true})
      }

    },
    pressDown:function(event){
      let elem = event.target
      this.activeAnimeCard = elem
      let nextElem = elem.parentElement.parentElement.nextElementSibling
      let nextElemCoords = nextElem.getBoundingClientRect()
      let parentElementCoords = nextElem.parentElement.getBoundingClientRect()
      if (nextElem != null && nextElem.className != "emptyContainer"){
        this.offAnimeStatus()
        nextElem.parentElement.scrollBy({
          top: nextElemCoords.y - parentElementCoords.y,
          behavior:'smooth'
        })
        nextElem.focus({preventScroll: true})

      }
    },
    pressUp:function(event){
      let elem = event.target
      this.activeAnimeCard = elem
      //console.log(elem.parentElement.parentElement.previousElementSibling)
      let prevElem = elem.parentElement.parentElement.previousElementSibling
      let parentElementCoords = prevElem.parentElement.getBoundingClientRect()
      let prevElemCoords = prevElem.getBoundingClientRect()
      //console.log(prevElemCoords)
      if (prevElem != null){
        this.offAnimeStatus()
        prevElem.parentElement.scrollBy({
          top: prevElemCoords.y - parentElementCoords.y,
          behavior:'smooth'
        })
        prevElem.focus({preventScroll: true})
      }
    },
    getFocus:function(event){
      let elem = event.target
      if (this.activeAnimeCard == undefined){
        setTimeout(()=>{
          elem.getElementsByClassName('animeCardComp')[0].focus({preventScroll: true})
        },500)
      }
      else{
        this.activeAnimeCard.focus({preventScroll: true})
      }
    }
  }


}
</script>


<style lang="scss" src="./categoryComponent.scss"></style>
