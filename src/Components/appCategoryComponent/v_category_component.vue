<template>
  <div class="categoryElem" tabindex="-1" @focus="getFocus">
    <h2 class="categoryName">{{this.categoryNameRus}}</h2>
    <div class="category">
      <div class="animeCardComp" v-for="(item,index) in animeList" :key="index"
        tabindex="-1"
        :index="index"
        :elid="item.id"
        @focus="getFullAnimeData"
        @blur="getBlur"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
        @keydown.enter.prevent="pressEnter"
      >
        <animeCard
          :imgURL="item.image.original"
        ></animeCard>
      </div>
      <div class="returnToCategoryStart" tabindex="0">ALOs</div>
    </div>


  </div>
</template>

<script>
import animeCard from '../animeCardComponent/animeCardComponent.vue'
export default {
  name: 'category',
  props:['categoryName'],

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
  beforeRouteLeave(to, from, next) {
    // вызывается перед переходом от пути, соответствующего текущему компоненту;
    // имеет доступ к контексту экземпляра компонента `this`.
    console.log("zalupa")
    next()
  },
  methods:{
    getFullAnimeData:function(event){
      let elem = event.target
      let id = elem.getAttribute("elid")
      this.timerRefreshAnimeInfo = setTimeout(()=>{
        this.$store.dispatch('getFullAnimeData',id).then(()=>{
          setTimeout(()=>{
            this.$store.commit('changeAnimeInfoStatus',true)
          },500)
        })
      },700)
      // scrollBy
      //DOMRect {x: 120, y: 554, width: 304, height: 412, top: 554, …}
      let elemCoords = elem.getBoundingClientRect()
      //alert(elem.parentElement.children[1].getBoundingClientRect().x)
      /*this.$store.commit('changeGlobalNatification',{
        type:"success",
        message:elem.parentElement.children[1].getBoundingClientRect().x.toString(),
        code:"Access token"
      })*/
      if (elemCoords.x>444 || elemCoords.x<748) {
        elem.parentElement.scrollBy({
          left: elemCoords.x - 444,
          behavior:'auto'
        })
      }
      elem = elem.parentElement.parentElement
      elemCoords = elem.getBoundingClientRect()
      //DOMRect {x: 110, y: 505, width: 1810, height: 461, top: 505, …}
      if (elemCoords.y>505 || elemCoords.y<571) {
        elem.parentElement.scrollBy({
          top: elemCoords.y - 505,
          behavior:'auto'
        })
      }

    },
    getBlur:function(){
      if (this.timerRefreshAnimeInfo !== undefined){
        clearTimeout(this.timerRefreshAnimeInfo)
      }
      if (this.animeInfoActiveStatus){
        this.$store.commit('changeAnimeInfoStatus',false)
      }
    },
    pressEnter:function(event){
      let index = event.target.getAttribute("index")
      let elid = event.target.getAttribute("elid")
      let catIndex = event.target.parentElement.parentElement.getAttribute("categoryindex")
      this.$store.commit("updateLastActiveAnimeCard",[elid,catIndex])
      this.$router.push({
        name:"player",
        params:{
          id:this.animeList[index].id,
        },
        query:{
          from:this.$route.name
        }
      })
    },
    pressRight:function(event){
      let elem = event.target
      let nextElem = elem.nextElementSibling
      if (nextElem != null && !nextElem.classList.contains("returnToCategoryStart")){
        let nextElemCoords = nextElem.getBoundingClientRect()
        let parentElemCoords = nextElem.parentElement.getBoundingClientRect()
        nextElem.focus({preventScroll: true})
      }
    },
    pressLeft:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      if (prevElem != null){
        let prevElemCoords = prevElem.getBoundingClientRect()
        let parentElemCoords = prevElem.parentElement.getBoundingClientRect()
        prevElem.focus({preventScroll: true})
      }
      else{
        //Выход в левое меню
        let menuElem = document.querySelector(".routerLink.router-link-exact-active.router-link-active")
        let elid = event.target.getAttribute("elid")
        let catIndex = elem.parentElement.parentElement.getAttribute("categoryindex")
        this.$store.commit("updateLastActiveAnimeCard",[elid,catIndex])
        //console.log(elem.parentElement.parentElement)
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
        /*nextElem.parentElement.scrollBy({
          top: nextElemCoords.y - parentElementCoords.y,
          behavior:'auto'
        })*/
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
        /*prevElem.parentElement.scrollBy({
          top: prevElemCoords.y - parentElementCoords.y,
          behavior:'auto'
        })*/
        prevElem.focus({preventScroll: true})
      }
    },
    getFocus:function(event){
      let elem = event.target
      if (this.activeAnimeCard == undefined){
        elem.getElementsByClassName('animeCardComp')[0].focus({preventScroll: true})
      }
      else{
        this.activeAnimeCard.focus({preventScroll: true})
      }
    }
  }


}
</script>


<style scoped="true" lang="scss" src="./categoryComponent.scss"></style>
