<template>
  <div class="animeCard">
    <img :src="'https://shikimori.me' + imgURL" />
  </div>
</template>

<script>
export default {
  name: "animeCard",
  props: ["imgURL", "index"],
};
</script>

<style scoped="true" lang="scss" src="./animeCardComponent.scss"></style>
