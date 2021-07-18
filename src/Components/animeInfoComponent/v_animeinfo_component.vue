<template>
  <div class="animeInfoComponent">
    <img :src="'https://shikimori.one/' + animeInfoData.image.original">
    <h1 class="name">{{animeInfoData.name}}</h1>
    <h1 class="score">{{animeInfoData.score}}</h1>
    <p class="discription">{{animeInfoData.discription}}</p>
    
  </div>
</template>

<script>

export default {
  name: 'animeInfoComponent',
  components: {

  },


}
</script>


<style lang="scss" src="./animeInfoComponent.scss"></style>
