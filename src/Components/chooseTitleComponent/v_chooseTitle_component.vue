<template>

  <div tabindex="-1" class="chooseTitleComponent"
  @keydown.right.prevent=""
  @keydown.left.prevent=""
  @keydown.down.prevent=""
  @keydown.up.prevent=""
  @focus="getFocus"
  v-focus
  >
    <AnimeInfoComponent></AnimeInfoComponent>
    <transition name="fade">
      <div v-show="categoriesIsReady" class="categories" >
        <Category class="active" categoryName="watching" categoryIndex="0"></Category>
        <Category categoryName="ongoing" categoryIndex="1"></Category>
        <Category categoryName="planned" categoryIndex="2"></Category>
        <Category categoryName="dropped" categoryIndex="3"></Category>
      </div>
    </transition>
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
  computed:{
    lastActiveAnimeCardId:function(){
      return this.$store.state.lastActiveAnimeCardId
    },
    categoriesIsReady:function(){
      return this.$store.state.status.categoriesIsReady
    },
    dataDownloadReady:function(){
      return this.$store.state.status.dataDownloadReady
    }
  },
  watch:{
    categoriesIsReady:function(val){
      if (val) {
        setTimeout(()=>{
          this.$el.getElementsByClassName('categoryElem active')[0].focus({preventScroll: true})
        },500)
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
    getFocus:function(event){
      let elem = event.target
      if (this.dataDownloadReady) {
        //console.log(this.lastActiveAnimeCardId)
        if (this.lastActiveAnimeCardId === undefined){
          elem.getElementsByClassName('categoryElem active')[0].focus({preventScroll: true})
        }
        else {
          elem.querySelector(`[categoryindex="${this.lastActiveAnimeCardId[1]}"] [elid="${this.lastActiveAnimeCardId[0]}"]`).focus()
          //this.$store.state.lastActiveAnimeCard.focus()
        }
      }
    }
  }
}
</script>


<style scoped="true" lang="scss" src="./chooseTitleComponent.scss"></style>
