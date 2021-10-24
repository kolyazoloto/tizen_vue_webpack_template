<template>
  <div tabindex="-1" class="searchComponent" v-focus
  @focus="getFocus"

  >
    <div class="leftPanel">
      <keyboardComponent></keyboardComponent>
      <div tabindex="-1" class="presetCategory"
      v-for="(item,index) in categories" :key="index" :index="index"
      @focus="presetCategoryGetFocus"
      @blur="presetCategoryGetBlur"
      @keydown.down.prevent="pressDown"
      @keydown.up.prevent="pressUp"
      @keydown.left.prevent="pressLeft"
      >
        {{item[0]}}
      </div>
    </div>
    <div class="rightPanel">
      <div class="requestString">
        <h3 v-if="isFocusOnKeyboard" class="computerRequest">{{searchRequestString}}</h3>
        <h3 v-else class="presetRequest">{{requestStringPreset}}</h3>
      </div>
      <searchResultComponent></searchResultComponent>
    </div>

  </div>
</template>

<script>
import keyboardComponent from '../keyboardComponent/v_keyboard_component.vue'
import searchResultComponent from '../searchResultComponent/v_search_result_component.vue'
export default {
  name: 'searchComponent',
  components: {
    keyboardComponent,
    searchResultComponent
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
  watch:{
    searchRequestString:function(val){
      if (this.timeoutKeyboardEvent !== undefined){
        clearTimeout(this.timeoutKeyboardEvent)
      }
      this.timeoutKeyboardEvent = setTimeout(()=>{
        let url = `https://shikimori.one/api/animes?order=ranked&censored=true&status=!anons&limit=50&search=${val}`
        console.log(url)
        this.$store.dispatch('getSearchData',[url,true])
      },2000)
    }
  },
  computed:{
    searchRequestString:function(){
      return this.$store.state.searchRequestString
    },
    year:function(){
      let date = new Date();
      let year = date.getFullYear()
      //let month = date.getMonth()
      //console.log(year)
      return year
    },
    categories:function(){
      return [
        [`Сезон ${this.year}`,`https://shikimori.one/api/animes?season=${this.year}&censored=true&status=!anons&limit=30&order=ranked`],
        [`Сезон ${this.year-1}`,`https://shikimori.one/api/animes?season=${this.year-1}&censored=true&status=!anons&limit=30&order=ranked`],
        ["Сенен","https://shikimori.one/api/animes?genre=27&censored=true&status=!anons&limit=30&order=ranked"],
        ["Сейнэн","https://shikimori.one/api/animes?genre=42&censored=true&status=!anons&limit=30&order=ranked"],
        ["Фильмы","https://shikimori.one/api/animes?kind=movie&censored=true&status=!anons&limit=30&order=ranked"],
        ["Комедия","https://shikimori.one/api/animes?genre=4&censored=true&status=!anons&limit=30&order=ranked"],
        ["Романтика","https://shikimori.one/api/animes?genre=22&censored=true&status=!anons&limit=30&order=ranked"],
        ["Детектив","https://shikimori.one/api/animes?genre=7&censored=true&status=!anons&limit=30&order=ranked"],
        ["Меха","https://shikimori.one/api/animes?genre=18&censored=true&status=!anons&limit=30&order=ranked"],
        ["Спорт","https://shikimori.one/api/animes?genre=30&censored=true&status=!anons&limit=30&order=ranked"],
        ["Ужасы","https://shikimori.one/api/animes?genre=14&censored=true&status=!anons&limit=30&order=ranked"],
      ]
    }
  },
  data:function(){
    return{
      requestStringPreset:"",
      timeoutEvent : undefined,
      timeoutKeyboardEvent : undefined,
      lastActiveElement:undefined,
      isFocusOnKeyboard:true
    }
  },
  methods:{
    getFocus:function(event){
      if (this.lastActiveElement === undefined) {
        event.target.querySelector(".keyboardComponent").focus({preventScroll: true})
        this.isFocusOnKeyboard = true
      }
      else {
        this.lastActiveElement.focus({preventScroll: true})
        this.isFocusOnKeyboard = false
      }
    },
    presetCategoryGetFocus:function(event){
      if (this.isFocusOnKeyboard === true) this.isFocusOnKeyboard = false
      this.timeoutEvent = setTimeout(()=>{
        let elem = event.target
        let index = elem.getAttribute("index")
        let url = this.categories[index][1]
        console.log(url)
        this.$store.dispatch('getSearchData',[url,false])
        this.requestStringPreset = this.categories[index][0]
      },1500)
    },
    presetCategoryGetBlur:function(){
      if (this.timeoutEvent !== undefined){
        clearTimeout(this.timeoutEvent)
      }
    },
    pressDown:function(event){
      let elem = event.target
      let nextElem = elem.nextElementSibling
      if (nextElem != null){
        nextElem.focus({preventScroll: true})
      }
    },
    pressUp:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      if (prevElem != null){
        if (prevElem.classList.contains("keyboardComponent")){
          this.lastActiveElement = undefined
          this.isFocusOnKeyboard = true;
          let parentElementCoords = prevElem.parentElement.getBoundingClientRect()
          let prevElemCoords = prevElem.getBoundingClientRect()
          //console.log(parentElementCoords)
          prevElem.parentElement.scrollBy({
            top: prevElemCoords.y - parentElementCoords.y,
            behavior:'smooth'
          })
        }
        prevElem.focus({preventScroll: true})
      }
    },
    pressLeft:function(event){
      this.lastActiveElement = event.target
      let menuElem = document.querySelector(".routerLink.router-link-exact-active.router-link-active")
      menuElem.parentElement.focus()
    }
  }
}
</script>


<style lang="scss" src="./searchComponent.scss"></style>
