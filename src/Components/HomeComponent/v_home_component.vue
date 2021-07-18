<template>
  <div class="homeComponent">
    <div class="categories">
      <Category categoryName="watching" :active="true"></Category>
    </div>
  </div>
</template>

<script>
import Category from '../appCategoryComponent/v_category_component.vue'
import AnimeInfoComponent from '../animeInfoComponent/v_animeinfo_component.vue'
export default {
  name: 'homeComponent',
  components: {
    Category,
    AnimeInfoComponent
  }
}
</script>


<style lang="scss" src="./homeComponent.scss"></style>
