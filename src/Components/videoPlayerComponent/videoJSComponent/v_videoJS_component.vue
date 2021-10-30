<template>
  <div class="videoJSComponent">
    <video
    ref="videoPlayer"
    class="video-js"
    width="1920"
    height="1080"
    preload="auto"


    ></video>

    <!--<div class="overlay title" :class="{active:overlayActive}">{{title}}</div>
    <div class="overlay episode" :class="{active:overlayActive}">{{episode}}</div>
    <div class="overlay height" :class="{active:overlayActive}">{{height}}</div>-->

  </div>
</template>


<script>
import Vue from 'vue'
import videojs from 'video.js';
import 'videojs-hotkeys'
import Ass from "assjs"

export default {
    name: "videoJSComponent",
    props: {
        options: {
            type: Object,
            default() {
                return {}
            }
        },
        title:String,
        episode:String,
        height:String,
        ass:String,
    },
    data() {
        return {
            player: null,
        }
    },
    methods:{
      getSubtitles:function(assSub,video){
        fetch(assSub)
          .then(res => res.text())
          .then((text) => {
            var ass = new Ass(text, video,{
						   container: document.querySelector('.videoJSComponent'),
            });
            //ass.resize();
          });
        }
    },
    computed:{

    },
    mounted() {

        //console.log("player ON")
        //console.log(this.ass)
        //console.log(this.title)

          this.player = videojs(this.$refs.videoPlayer, this.options, ()=> {
          this.getSubtitles(this.ass,this.$refs.videoPlayer)
          //this.isFullscreen(true)
          this.player.hotkeys({
            seekStep: 15,
            enableModifiersForNumbers: false,
            enableMute:false,
            enableVolumeScroll:false,
            playPauseKey: function(event, player) {
                return (event.which === 13); //enter
            },
            customKeys: {
                // Create custom hotkeys
              backSpaceKey: {
                key: function(event) {
                  return (event.which === 10009 || event.which === 8);
                },
                handler: event =>{
                  // Using mute as an example
                }
              }
            }
          })

        })
        //this.getSubtitles(this.ass,this.$refs.videoPlayer)
    },
    beforeDestroy() {
      console.log("player Off")
        if (this.player) {
            this.player.dispose()
        }
    }
}
</script>

<style scoped="true" lang="scss" src="./videoJSComponent.scss"></style>
<style lang="css" src="video.js/dist/video-js.css"></style>
