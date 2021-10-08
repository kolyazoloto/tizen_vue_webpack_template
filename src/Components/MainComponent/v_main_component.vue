<template>
  <div class="mainComponent" >
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'mainComponent',
  components: {

  },
  mounted:function(){
    //this.$router.push('/mainPage/chooseTitle')
  }
}
</script>


<style lang="scss" src="./mainComponent.scss"></style>
