<template>
  <div tabindex="-1" class="chooseTitleComponent" @focus="getFocus" v-focus>
    <AnimeInfoComponent></AnimeInfoComponent>
    <div class="categories">
      <Category categoryName="watching" :categoryIndex="0"></Category>
      <Category categoryName="ongoing" :categoryIndex="1"></Category>
      <Category categoryName="planned" :categoryIndex="2"></Category>
      <Category categoryName="dropped" :categoryIndex="3"></Category>
      <div class="emptyContainer"></div>
    </div>
  </div>
</template>

<script>
import Category from '../appCategoryComponent/v_category_component.vue'
import AnimeInfoComponent from '../animeInfoComponent/v_animeinfo_component.vue'
export default {
  name: 'chooseTitleComponent',
  components: {
    Category,
    AnimeInfoComponent
  },
  mounted:function(){
    this.$store.dispatch('getAllAnimeCategoryData')
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
  computed:{
    activeAnimeCategory:function(){
      return this.$store.state.activeAnimeCategory
    },
  },
  methods:{
    getFocus:function(event){
      let elem = event.target
      if (this.activeAnimeCategory == undefined){
        setTimeout(()=>{
          elem.getElementsByClassName('animeCardComp')[0].focus({preventScroll: true})
        },500)
      }
      else{
        this.activeAnimeCategory.focus({preventScroll: true})
      }
    }
  }
}
</script>


<style lang="scss" src="./chooseTitleComponent.scss"></style>
