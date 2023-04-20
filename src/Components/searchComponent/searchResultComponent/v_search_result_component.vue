<template>
  <div class="searchResult">
    <transition name="fade" mode="out-in">
      <div v-if="searchIsReady" class="ready" key="0">
        <div
          tabindex="-1"
          class="searchAnimeCard"
          v-for="(item, index) in searchData"
          :key="index"
          :index="index"
          @focus="animeCardGetFocus"
          @keydown.left.prevent="pressLeft"
          @keydown.right.prevent="pressRight"
          @keydown.down.prevent="pressDown"
          @keydown.up.prevent="pressUp"
          @keydown.enter.prevent="pressEnter"
        >
          <img :src="'https://shikimori.me' + item.image.original" />
          <div class="info">
            <div class="nameCont">
              <h3 class="name">{{ item.russian + " / " + item.name }}</h3>
            </div>
            <h3 class="score">{{ item.score }}</h3>
          </div>
        </div>
      </div>
      <div v-else class="loadingScreen" key="1">
        <div class="loader"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import "vue-loaders/dist/vue-loaders.css";

export default {
  name: "searchResult",
  components: {},
  computed: {
    searchIsReady: function () {
      return this.$store.state.status.searchIsReady;
    },
    searchData: function () {
      return this.$store.state.searchData;
    },
  },
  data: function () {
    return {
      lastActiveElem: undefined,
    };
  },
  methods: {
    pressDown: function (event) {
      event.preventDefault();
      let elem = event.target;
      let elemIndex = Array.from(elem.parentElement.children).indexOf(elem);
      if (elemIndex <= 45) {
        let nextElem =
          elem.nextElementSibling.nextElementSibling.nextElementSibling
            .nextElementSibling;
        if (nextElem != null) nextElem.focus({ preventScroll: true });
        event.target.classList.toggle("lastActive", false);
      }
    },
    pressUp: function (event) {
      event.preventDefault();
      let elem = event.target;
      let elemIndex = Array.from(elem.parentElement.children).indexOf(elem);
      if (elemIndex >= 4) {
        let prevElem =
          elem.previousElementSibling.previousElementSibling
            .previousElementSibling.previousElementSibling;
        if (prevElem != null) prevElem.focus({ preventScroll: true });
        event.target.classList.toggle("lastActive", false);
      }
    },
    pressRight: function (event) {
      let elem = event.target;
      let nextElem = elem.nextElementSibling;
      let elemIndex = Array.from(elem.parentElement.children).indexOf(elem);
      let exceptions = [3, 7, 11, 15, 19, 23, 27, 31, 35, 39, 43, 47];
      if (nextElem !== null && exceptions.indexOf(elemIndex) === -1) {
        nextElem.focus({ preventScroll: true });
        event.target.classList.toggle("lastActive", false);
      }
    },
    pressLeft: function (event) {
      let elem = event.target;
      let prevElem = elem.previousElementSibling;
      let elemIndex = Array.from(elem.parentElement.children).indexOf(elem);
      let exceptions = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48];
      if (prevElem != null && exceptions.indexOf(elemIndex) === -1) {
        prevElem.focus({ preventScroll: true });
        event.target.classList.toggle("lastActive", false);
      } else
        document
          .querySelector(".searchComponent")
          .focus({ preventScroll: true });
    },
    pressEnter: function (event) {
      //this.dataLoadingComplete = false;
      let elem = event.target;
      let index = elem.getAttribute("index");

      this.$router.push({
        name: "player",
        params: {
          id: this.searchData[index].id,
        },
        query: {
          from: this.$route.name,
        },
      });
    },
    animeCardGetFocus: function (event) {
      // changge animation duration
      let nameElem = event.target.querySelector(".name");
      let width = nameElem.getBoundingClientRect().width;
      let parentWidth =
        nameElem.parentElement.parentElement.getBoundingClientRect().width;

      nameElem.style.animationDuration = (width * 3) / parentWidth + "s";
      //////////////////
      event.target.classList.toggle("lastActive", true);
      let elem = event.target;
      let elemCoords = elem.getBoundingClientRect();
      //console.log(elemCoords)
      //DOMRect {x: 637.5, y: 120, width: 290.796875, height: 413.640625, top: 120, …}
      if (elemCoords.y > 120 || elemCoords.y < 533) {
        elem.parentElement.parentElement.scrollBy({
          top: elemCoords.y - 120,
          behavior: "auto",
        });
      }
    },
  },
};
</script>

<style scoped="true" lang="scss" src="./searchResultComponent.scss"></style>
