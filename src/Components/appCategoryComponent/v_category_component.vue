<template>
  <div>
    <h2 class="categoryName">{{this.categoryName}}</h2>
    <div class="category">
      <div class="activeElemBorder" v-if="activeCategory"></div>
      <div class="animeCardComp" v-for="(item,index) in animeList" :key="item.id">
        <animeCard
          :data="item"
          :class="{isActive : index==0 && activeCategory}"

        ></animeCard>
      </div>
    </div>
  </div>
</template>

<script>
import animeCard from '../animeCardComponent/animeCardComponent.vue'
export default {
  name: 'category',
  props:['categoryName','active'],
  data:function(){
    return {
      activeCategory:this.active,
    }
  },
  components: {
    animeCard
  },
  computed:{
    animeList:function(){
      return this.$store.state.animeFullData[this.categoryName]
    }
  },
  mounted:function(){
    this.$store.dispatch('getAnimePersonalList','watching')
  }

}
</script>


<style lang="scss" src="./categoryComponent.scss"></style>
