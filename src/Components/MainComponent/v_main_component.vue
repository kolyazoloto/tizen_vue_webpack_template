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
    this.$store.dispatch('shikiWhoAmI')

  }
}
</script>


<style lang="scss" src="./mainComponent.scss"></style>
