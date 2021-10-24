<template>
  <div class="categoryElem" tabindex="-1" @focus="getFocus">
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
//v-focus="categoryIndex==0"
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
      //console.log(this.$store.state.animeData[this.categoryName])
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

  methods:{
    getFullAnimeData:function(id){
      if (this.timerRefreshAnimeInfo !== undefined){
        clearTimeout(this.timerRefreshAnimeInfo)
      }
      this.timerRefreshAnimeInfo = setTimeout(this.$store.dispatch,700,'getFullAnimeData',id)
      //this.$store.dispatch('getFullAnimeData',id)
    },
    offAnimeStatus:function(){
      if (this.animeInfoActiveStatus){
        this.$store.commit('changeAnimeInfoStatus',false)
      }
    },
    pressRight:function(event){
      let elem = event.target
      //console.log(elem)
      let nextElem = elem.nextElementSibling
      //console.log(nextElem)
      if (nextElem != null){
        let nextElemCoords = nextElem.getBoundingClientRect()
        let parentElemCoords = nextElem.parentElement.getBoundingClientRect()
        //console.log(nextElemCoords)
        this.offAnimeStatus()
        elem.parentElement.scrollBy({
          left:nextElemCoords.x - parentElemCoords.x - 20,
          behavior:'smooth'
        })
        nextElem.focus({preventScroll: true})
      }
    },
    pressLeft:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      if (prevElem != null){
        let prevElemCoords = prevElem.getBoundingClientRect()
        let parentElemCoords = prevElem.parentElement.getBoundingClientRect()
        this.offAnimeStatus()
        elem.parentElement.scrollBy({
          left: prevElemCoords.x - parentElemCoords.x - 10,
          behavior:'smooth'
        })
        prevElem.focus({preventScroll: true})
      }
      else{
        //Выход в левое меню
        let menuElem = document.querySelector(".routerLink.router-link-exact-active.router-link-active")
        menuElem.parentElement.focus()
      }

    },
    pressDown:function(event){
      let elem = event.target
      this.activeAnimeCard = elem
      let nextElem = elem.parentElement.parentElement.nextElementSibling
      if (nextElem != null){
        let allCategoryElems = document.getElementsByClassName('categoryElem')
        for (let el of allCategoryElems){
          el.classList.remove("active")
        }
        nextElem.classList.toggle("active")
        let parentElementCoords = nextElem.parentElement.getBoundingClientRect()
        let nextElemCoords = nextElem.getBoundingClientRect()
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
      let prevElem = elem.parentElement.parentElement.previousElementSibling
      if (prevElem != null){
        let allCategoryElems = document.getElementsByClassName('categoryElem')
        for (let el of allCategoryElems){
          el.classList.remove("active")
        }
        prevElem.classList.toggle("active")
        let parentElementCoords = prevElem.parentElement.getBoundingClientRect()
        let prevElemCoords = prevElem.getBoundingClientRect()
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
