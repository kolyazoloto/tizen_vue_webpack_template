
<template>
  <div tabindex="-1" class="loginShikiComponent" :class="{login:islogin}"
  @focus="getFocus"
  >
    <div class="title">SHIKIMORI</div>
    <div v-if="islogin" class="content login">

        <div tabindex="-1" class="userdata"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
        >
          <img :src="avatarimg">
          <h3 class="nickname">{{nickname}}</h3>
        </div>


        <div tabindex="-1" class="userStatistics"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
        @keydown.enter.prevent="changeUserStats">

        <transition name="fade" mode="out-in">
            <div class="statsuses"
            v-show="activeStatsPage === 0"
            >
              <div class="chartTitle">Статистика просмотренного аниме</div>
              <div class="barsTitles">
                <div class="barTitle" v-for="(item,index) in statuses[0]" :key="index">
                  {{item}}
                </div>
              </div>
              <bars
                :data="statuses[0]"
                :gradient="['#9fa9a0', '#333535']"
                :width="650"
                :height="280"
                :barWidth="70"
                :minBarHeight="6"
                :rounding="6"
                :padding="70"
              ></bars>
              <div class="barsLabels">
                <div class="label" v-for="(item,index) in statuses[1]" :key="index">
                  {{item}}
                </div>
              </div>
            </div>
          </transition>

          <transition name="fade" mode="out-in">
            <div class="statsscores"
            v-show="activeStatsPage === 1"
            @keydown.right.prevent="pressRight"
            @keydown.left.prevent="pressLeft"
            @keydown.down.prevent="pressDown"
            @keydown.up.prevent="pressUp"
            >
              <div class="chartTitle">Статистика оцененного аниме</div>
              <div class="barsTitles">
                <div class="barTitle" v-for="(item,index) in statsscores[0]" :key="index">
                  {{item}}
                </div>
              </div>
              <bars
                :data="statsscores[0]"
                :gradient="['#9fa9a0', '#333535']"
                :width="650"
                :height="280"
                :barWidth="70"
                :minBarHeight="6"
                :rounding="6"
                :padding="60"
              ></bars>
              <div class="barsLabels">
                <div class="label" v-for="(item,index) in statsscores[1]" :key="index">
                  {{item}}
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div tabindex="-1" class="exitbutton"
        @keydown.right.prevent="pressRight"
        @keydown.left.prevent="pressLeft"
        @keydown.down.prevent="pressDown"
        @keydown.up.prevent="pressUp"
        @keydown.enter.prevent="pressExit"
        >Выйти</div>

    </div>
    <div v-else class="content logout">
      <input type="text" placeholder="Authorization Token"
      v-model="authorization_token"
      @keydown.right.prevent="pressRight"
      @keydown.left.prevent="pressLeft"
      @keydown.down.prevent="pressDown"
      @keydown.up.prevent="pressUp"
      >
      <div tabindex="-1" class="loginbutton"
      @keydown.right.prevent="pressRight"
      @keydown.left.prevent="pressLeft"
      @keydown.down.prevent="pressDown"
      @keydown.up.prevent="pressUp"
      @keydown.enter.prevent="pressLogIn"
      >Войти</div>
    </div>
  </div>
</template>

<script>
import bars from 'vuebars'
export default {
  name: 'loginShikiComponent',
  components: {
    bars
  },
  data:function(){
    return {
      authorization_token : ""
    }
  },
  computed:{
    activeStatsPage:function(){
      return this.$store.state.status.activeStatsPage
    },
    islogin:function(){
      return this.$store.state.status.shikimoriLogin
    },
    avatarimg:function(){
      return this.$store.state.shikimori.avatarimg
    },
    nickname:function(){
      return this.$store.state.shikimori.nickname
    },
    statsscores:function(){
      let stats = this.$store.state.shikimori.stats
      if (stats != undefined){
        let array = []
        let labels = []
        for (let elem of stats.scores.anime){
          array.push(elem.value)
          labels.push(elem.name)

        }
        array = array.reverse()
        labels = labels.reverse()
        return [array,labels]
      }
      else {
        return [[0,0,0,0],[]]
      }


    },
    statuses:function(){
      let stats = this.$store.state.shikimori.stats
      if (stats != undefined){
        let array = []
        let labels = []
        for (let elem of stats.statuses.anime){
          array.push(elem.size)
          let name = elem.name
          if (name == "planned"){
            labels.push("Planned")
          }
          else if (name == "watching"){
            labels.push("Watching")
          }
          else if (name == "completed"){
            labels.push("Completed")
          }
          else if (name == "on_hold"){
            labels.push("On hold")
          }
          else if (name == "dropped"){
            labels.push("Dropped")
          }
          else{
            labels.push(name)
          }
        }
        return [array,labels]
      }
      else {
        return [[0,0,0,0],[]]
      }


    }
  },
  watch:{
    islogin:function(){
      this.$nextTick(()=>{
        this.$el.focus()
      })
    }
  },
  methods:{
    getFocus:function(event){
      if (this.islogin){
        let elem = event.target.querySelector(".userdata")
        if (elem != null){
          elem.focus()
        }
      }
      else{
        let elem = event.target.querySelector("input")
        if (elem != null){
          elem.focus()
        }
      }
    },
    changeUserStats:function(){
      this.$store.commit('addActiveStatsPage')
    },
    pressExit:function(){
      this.$store.commit("exitShikimori")
    },
    pressLogIn:function(){
      if (this.authorization_token.length === 0){
        this.$store.commit('changeGlobalNatification',{
          type:"warn",
          message:"Незаполненные поля",
          code:"Незаполненные поля"
        })
      }
      else{
        this.$store.dispatch("shikiGetAccessToken",this.authorization_token)
      }
    },
    pressUp:function(event){
      let elem = event.target
      let prevElem = elem.previousElementSibling
      if (prevElem != null){
        prevElem.focus()
      }
    },
    pressDown:function(event){
      let elem = event.target
      let nextElem = elem.nextElementSibling
      if (nextElem != null){
        nextElem.focus()
      }
    },
    pressRight:function(event){
      let elem = event.target
      let parentElem = elem.parentElement.parentElement
      let nextElem = parentElem.nextElementSibling
      if (nextElem != null){
        nextElem.focus()
      }
    },
    pressLeft:function(event){
      let elem = event.target
      let parentElem = elem.parentElement.parentElement
      let prevElem = parentElem.previousElementSibling
      if (prevElem != null){
        prevElem.focus()
      }
      else{
        let menuElem = document.querySelector(".routerLink.router-link-exact-active.router-link-active")
        menuElem.parentElement.focus()

      }
    }
  },
  mounted:function(){

  }

}
</script>


<style scoped="true" lang="scss" src="./loginShikiComponent.scss"></style>
