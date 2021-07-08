<template>
  <div>
    <h1>Test</h1>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'mainComponent',
  components: {

  },
  mounted:function(){
    console.log(this.$route)
  }
}
</script>


<style lang="scss" src="./mainComponent.scss"></style>
