<template>

    <div class="searchResult" >
      <div   tabindex="-1" @focus="getFocus" class="ready" :class="{loading:!isReady}">
        <div tabindex="-1" class="searchAnimeCard" v-for="(item,index) in searchData" :key="index"
        @focus = "animeCardGetFocus"
        @blur = "animeCardGetBlur"
        @keydown.left.prevent="pressLeft"
        @keydown.right.prevent="pressRight"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
        >
          <img  :src="'https://shikimori.one' + item.image.original">
          <div class="info">
            <DynamicMarquee class="marque"
            direction="row"
            :reverse="true"
            :repeatMargin="200"
            :speed="{
              type:'pps',
              number:100
            }"
            >
              <h3 class="name">{{item.name + " / " + item.russian}}</h3>
            </DynamicMarquee>
            <h3 class="name static">{{item.name + " / " + item.russian}}</h3>
            <h3 class="score">{{item.score}}</h3>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
import 'vue-loaders/dist/vue-loaders.css';
import DynamicMarquee from 'vue-dynamic-marquee';

export default {
  name: 'searchResult',
  components: {
    DynamicMarquee,
  },
  computed:{
    searchData:function(){
      return this.$store.state.searchData
    },
    isReady:function(){
      return this.$store.state.status.searchIsReady
    }
  },
  data:function(){
    return {
      lastActiveElem:undefined,
    }
  },
  methods:{
    getFocus:function(event){
      console.log(this.lastActiveElem)
      if (this.lastActiveElem === undefined) event.target.querySelector(".searchAnimeCard").focus({preventScroll: true})
      else this.lastActiveElem.focus({preventScroll: true})
    },
    pressDown:function(event){
      event.preventDefault()
      let elem = event.target
      let elemIndex = Array.from(elem.parentElement.children).indexOf(elem)
      if (elemIndex <=45){
        let nextElem = elem.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling
        if (nextElem != null){
          let parentElementCoords = elem.parentElement.parentElement.getBoundingClientRect()
          let nextElemCoords = nextElem.getBoundingClientRect()
          elem.parentElement.parentElement.scrollBy({
            top: nextElemCoords.y - parentElementCoords.y,
            behavior:'auto'
          })
          nextElem.focus({preventScroll: true})

        }
      }
    },
    pressUp:function(event){
      event.preventDefault()
      let elem = event.target
      let elemIndex = Array.from(elem.parentElement.children).indexOf(elem)
      if (elemIndex >=4){
        let prevElem = elem.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling
        if (prevElem != null){
          let parentElementCoords = prevElem.parentElement.parentElement.getBoundingClientRect()
          let prevElemCoords = prevElem.getBoundingClientRect()
          prevElem.parentElement.parentElement.scrollBy({
            top: prevElemCoords.y - parentElementCoords.y,
            behavior:'auto'
          })
          prevElem.focus({preventScroll: true})

        }
      }
    },
    pressRight:function(event){
      let elem = event.target
      let nextElem = elem.nextElementSibling
      let elemIndex = Array.from(elem.parentElement.children).indexOf(elem)
      let exceptions = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47]
      if (nextElem !== null && exceptions.indexOf(elemIndex) === -1){
        nextElem.focus({preventScroll: true})
      }

    },
    pressLeft:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      let elemIndex = Array.from(elem.parentElement.children).indexOf(elem)
      let exceptions = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48]
      if (prevElem != null && exceptions.indexOf(elemIndex) === -1){
        prevElem.focus({preventScroll: true})
      }
      else document.querySelector(".searchComponent").focus({preventScroll: true})

    },
    animeCardGetFocus:function(event){
      this.lastActiveElem = event.target
      let width = event.target.querySelector('.name.static').getBoundingClientRect().width
      let scrollWidth = event.target.querySelector('.name.static').scrollWidth
      if (scrollWidth-width > 5) event.target.classList.toggle("active",true)
    },
    animeCardGetBlur:function(event){
      event.target.classList.toggle("active",false)
    }
  },

}
</script>


<style scoped="true" lang="scss" src="./searchResultComponent.scss"></style>
