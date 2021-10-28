<template>
  <div class="videoJSComponent">
    <video ref="videoPlayer" class="video-js"></video>
  </div>
</template>

<script>
import videojs from 'video.js';

export default {
    name: "videoJSComponent",
    props: {
        options: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            player: null
        }
    },
    mounted() {
        console.log(this.$refs.videoPlayer)
        this.player = videojs(this.$refs.videoPlayer, this.options, function onPlayerReady() {
            console.log('onPlayerReady', this)
        })
    },
    beforeDestroy() {
        if (this.player) {
            this.player.dispose()
        }
    }
}
</script>


<style scoped="true" lang="scss" src="./videoJSComponent.scss"></style>
<style lang="css" src="video.js/dist/video-js.css"></style>
