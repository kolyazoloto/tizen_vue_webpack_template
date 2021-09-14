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
          el.focus()
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
    pressRight:function(event){
      let elem = event.target
      let nextElem = elem.nextElementSibling
      let nextElemCoords = nextElem.getBoundingClientRect()
      if (nextElem != null){
        elem.parentElement.scrollBy({
          left:nextElemCoords.x - 20,
          behavior:'auto'
        })
        nextElem.focus({preventScroll: true})
      }
    },
    pressLeft:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      let prevElemCoords = prevElem.getBoundingClientRect()
      if (elem != null){
        elem.parentElement.scrollBy({
          left: -270,
          behavior:'auto'
        })
        prevElem.focus({preventScroll: true})
      }

    },
    pressDown:function(event){
      let elem = event.target
      this.activeAnimeCard = elem
      let nextElem = elem.parentElement.parentElement.nextElementSibling
      console.log(nextElem.className)
      //console.log(nextElem)
      if (nextElem != null && nextElem.className != "emptyContainer"){

        elem.parentElement.parentElement.parentElement.scrollBy(0,387)
        nextElem.focus({preventScroll: true})
      }
    },
    pressUp:function(event){
      let elem = event.target
      this.activeAnimeCard = elem
      //console.log(elem.parentElement.parentElement.previousElementSibling)
      let prevElem = elem.parentElement.parentElement.previousElementSibling
      //console.log(prevElem)
      if (prevElem != null){
        elem.parentElement.parentElement.parentElement.scrollBy(0,-387)
        prevElem.focus({preventScroll: true})
      }
    },
    getFocus:function(event){
      let elem = event.target
      if (this.activeAnimeCard == undefined){
        setTimeout(()=>{
          elem.getElementsByClassName('animeCardComp')[0].focus()
        },500)
      }
      else{
        this.activeAnimeCard.focus()
      }
    }
  }


}
</script>


<style lang="scss" src="./categoryComponent.scss"></style>
