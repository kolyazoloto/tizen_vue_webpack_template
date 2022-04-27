<template>
  <div
    tabindex="-1"
    class="smotretAnimeComponent"
    :class="{ login: islogin }"
    @focus="getFocus"
  >
    <div class="title">SmotretAnimeRU</div>
    <div v-if="islogin" class="content login">
      <div
        tabindex="-1"
        class="userdata"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
      >
        <p class="text">
          Так как сайт не предоставляет информации о пользователе вы видите этот
          текст.
        </p>
      </div>

      <div
        tabindex="-1"
        class="exitbutton"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
        @keydown.enter.prevent="pressExit"
      >
        Выйти
      </div>
    </div>
    <div v-else class="content logout">
      <input
        class="login"
        type="text"
        placeholder="Email"
        v-model="messageLogin"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
      />
      <input
        class="password"
        type="text"
        placeholder="Password"
        v-model="messagePassword"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
      />

      <div
        tabindex="-1"
        class="loginbutton"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
        @keydown.enter.prevent="pressLogIn"
      >
        Войти
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "loginShikiComponent",
  components: {},
  data: function () {
    return {
      messageLogin: "",
      messagePassword: "",
    };
  },
  computed: {
    activeStatsPage: function () {
      return this.$store.state.status.activeStatsPage;
    },
    islogin: function () {
      return this.$store.state.status.smotretAnimeLogin;
    },
    avatarimg: function () {
      return this.$store.state.shikimori.avatarimg;
    },
    nickname: function () {
      return this.$store.state.shikimori.nickname;
    },
  },
  watch: {
    islogin: function () {
      this.$nextTick(() => {
        this.$el.focus();
      });
    },
  },

  methods: {
    getFocus: function (event) {
      if (this.islogin) {
        let elem = event.target.querySelector(".userdata");
        if (elem != null) {
          elem.focus();
        }
      } else {
        let elem = event.target.querySelector("input");
        if (elem != null) {
          elem.focus();
        }
      }
    },
    pressExit: function () {
      this.$store.commit("exitSmotretAnime");
      //console.log(elem)
    },
    pressLogIn: function () {
      if (this.messageLogin.length === 0 || this.messagePassword.length === 0) {
        this.$store.commit("changeGlobalNatification", {
          type: "warn",
          message: "Незаполненные поля",
          code: "Незаполненные поля",
        });
      } else {
        this.$store.dispatch({
          type: "smotretAnimeRuAutorisation",
          email: this.messageLogin,
          password: this.messagePassword,
        });
      }
    },
    pressUp: function (event) {
      let elem = event.target;
      let prevElem = elem.previousElementSibling;
      if (prevElem != null) {
        prevElem.focus();
      }
    },
    pressDown: function (event) {
      let elem = event.target;
      let nextElem = elem.nextElementSibling;
      if (nextElem != null) {
        nextElem.focus();
      }
    },
    pressRight: function (event) {
      let elem = event.target;
      let parentElem = elem.parentElement.parentElement;
      let nextElem = parentElem.nextElementSibling;
      if (nextElem != null) {
        nextElem.focus();
      }
    },
    pressLeft: function (event) {
      let elem = event.target;
      let parentElem = elem.parentElement.parentElement;
      let prevElem = parentElem.previousElementSibling;
      if (prevElem != null) {
        prevElem.focus();
      } else {
        let menuElem = document.querySelector(
          ".routerLink.router-link-exact-active.router-link-active"
        );
        menuElem.parentElement.focus();
      }
    },
  },
  mounted: function () {},
};
</script>

<style
  scoped="true"
  lang="scss"
  src="./loginSmotretAnimeComponent.scss"
></style>
