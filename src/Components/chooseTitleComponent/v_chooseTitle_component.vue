<template>
  <div class="chooseTitleComponent">
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
  methods:{

  }
}
</script>


<style lang="scss" src="./chooseTitleComponent.scss"></style>
