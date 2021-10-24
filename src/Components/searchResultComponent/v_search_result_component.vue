<template>
  <div class="searchResult">
    <div class="ready">
      <div tabindex="-1" class="searchAnimeCard" v-for="(item,index) in searchData" :key="index"
      @focus = "animeCardGetFocus"
      @blur = "animeCardGetBlur"
      >
        <img :src="'https://shikimori.one' + item.image.original">
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

import DynamicMarquee from 'vue-dynamic-marquee';
export default {
  name: 'searchResult',
  components: {
    DynamicMarquee
  },
  computed:{
    searchData:function(){
      return this.$store.state.searchData
    }
  },
  methods:{
    animeCardGetFocus:function(event){
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


<style lang="scss" src="./searchResultComponent.scss"></style>
