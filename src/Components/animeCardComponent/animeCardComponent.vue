<template>
  <div class="animeCard">
    <img :src="'https://shikimori.one' + imgURL">
  </div>
</template>

<script>
export default {
  name: 'animeCard',
  props:['imgURL','index'],
}
</script>


<style lang="scss" src="./animeCardComponent.scss"></style>
