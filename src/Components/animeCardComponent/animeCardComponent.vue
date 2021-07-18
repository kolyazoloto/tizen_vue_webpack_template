<template>
  <div class="animeCard">
    <img :src="'https://shikimori.one/' + data.fullData.image.original">
  </div>
</template>

<script>
export default {
  name: 'animeCard',
  props:['data','index'],

  components: {

  },
  mounted:function(){

  },
  methods:{

  }

}
</script>


<style lang="scss" src="./animeCardComponent.scss"></style>
