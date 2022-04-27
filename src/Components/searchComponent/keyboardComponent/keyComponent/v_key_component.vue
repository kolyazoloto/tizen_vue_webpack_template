<template>
  <div
    tabindex="-1"
    class="keyComponent"
    @keydown.right.prevent="pressRight"
    @keydown.left.prevent="pressLeft"
    @keydown.down.prevent="pressDown"
    @keydown.up.prevent="pressUp"
    @keydown.enter.prevent="pressEnter"
  >
    <KeyboardSpace v-if="type === 'space'" class="icon-2x"></KeyboardSpace>
    <BackSpace v-else-if="type === 'backspace'" class="icon-2x"></BackSpace>
    <Web v-else-if="type === 'web'" class="icon-2x"></Web>
    <div v-else class="char">
      {{ char }}
    </div>
  </div>
</template>

<script>
import KeyboardSpace from "vue-material-design-icons/KeyboardSpace.vue";
import BackSpace from "vue-material-design-icons/Backspace.vue";
import Web from "vue-material-design-icons/Web.vue";
export default {
  name: "keyComponent",
  props: ["char", "type"],
  components: {
    KeyboardSpace,
    BackSpace,
    Web,
  },
  computed: {
    searchIsReady: function () {
      return this.$store.state.status.searchIsReady;
    },
  },
  methods: {
    pressEnter: function () {
      if (this.type === "web") {
        this.$store.commit("changeKeyboardLang");
      } else
        this.$store.commit("updateSearchrequestString", [this.type, this.char]);
      //console.log([this.type,this.char])
    },
    pressRight: function (event) {
      let elem = event.target;
      let nextElem = elem.nextElementSibling;
      if (nextElem != null) {
        nextElem.focus({ preventScroll: true });
      } else {
        let searchResultElem = document.querySelector(
          ".searchAnimeCard.lastActive"
        );
        //console.log(searchResultElem)
        if (this.searchIsReady) {
          if (searchResultElem == null) {
            document
              .querySelector(".searchAnimeCard")
              .focus({ preventScroll: true });
          } else {
            searchResultElem.focus({ preventScroll: true });
          }
        }
      }
    },
    pressLeft: function (event) {
      let elem = event.target;
      let prevElem = elem.previousElementSibling;
      if (prevElem != null) {
        prevElem.focus({ preventScroll: true });
      } else {
        //Выход в левое меню
        const leftmenu = document.querySelector(".leftMenuComponent");
        leftmenu.classList.add("active");
        let menuElem = document.querySelector(
          ".routerLink.router-link-exact-active.router-link-active"
        );
        menuElem.parentElement.focus();
      }
    },
    pressDown: function (event) {
      let elem = event.target;
      let parentElem = elem.parentElement;
      let elemIndex = Array.from(parentElem.children).indexOf(elem);
      let nextElem = parentElem.nextElementSibling;
      if (nextElem != null) {
        let elemcoefIndex =
          nextElem.children.length / parentElem.children.length;
        nextElem.children[Math.floor(elemIndex * elemcoefIndex)].focus({
          preventScroll: true,
        });
      } else {
        let parentElementCoords =
          parentElem.parentElement.children[0].getBoundingClientRect();
        let nextElemCoords =
          parentElem.parentElement.nextElementSibling.getBoundingClientRect();
        nextElem = parentElem.parentElement.nextElementSibling;
        nextElem.focus();
      }
    },
    pressUp: function (event) {
      let elem = event.target;
      let parentElem = elem.parentElement;
      let elemIndex = Array.from(parentElem.children).indexOf(elem);
      let prevElem = parentElem.previousElementSibling;
      if (prevElem != null) {
        let elemcoefIndex =
          prevElem.children.length / parentElem.children.length;
        //console.log(elemcoefIndex)
        //console.log(elemIndex)
        //console.log(Math.floor(elemIndex*elemcoefIndex))
        prevElem.children[Math.floor(elemIndex * elemcoefIndex)].focus({
          preventScroll: true,
        });
      }
    },
  },
};
</script>

<style scoped="true" lang="scss" src="./keyComponent.scss"></style>
