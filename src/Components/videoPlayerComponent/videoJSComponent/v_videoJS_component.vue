<template>
  <div class="videoJSComponent">
    <video
    ref="videoPlayer"
    class="video-js"
    width="1920"
    height="1080"
    preload="auto"

    @play="onPlay"
    @pause="onPause"
    @ended="onEnded"

    ></video>

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
        assUrl:String,
        vttUrl:String
    },
    data() {
        return {
            player: null,
            ass:null,
        }
    },
    methods:{
      onPlay:function(){
        if (this.ass !== null){
          this.ass.show()
        }
      },
      onPause:function(){
        if (this.ass !== null){
          this.ass.hide()
        }
      },
      onEnded:function(){
        if (this.ass !== null){
          this.ass.destroy()
        }
      },
      getSubtitles:function(){
        if (this.assUrl !== null){
				  if (!this.assUrl.includes("https")){
					  this.player.addRemoteTextTrack({
						    src: this.vttUrl,
						    srclang: 'en',
						    label: 'english',
						    kind: 'subtitles'
						  }, true);
				  }
				  else{
            fetch(this.assUrl)
              .then(res => res.text())
              .then((text) => {
                this.ass = new Ass(text, this.$refs.videoPlayer,{
    						   container: document.querySelector('.videoJSComponent'),
                })
              })
	        }
			  }
      },


    },
    computed:{

    },
    mounted() {

        console.log("player ON")
        //console.log(this.assUrl)
        //console.log(this.options)

          this.player = videojs(this.$refs.videoPlayer, this.options, ()=> {
          this.getSubtitles()
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
      if (this.ass !== null){
        this.ass.destroy();
      }
    }
}
</script>

<style scoped="true" lang="scss" src="./videoJSComponent.scss"></style>
<style lang="css" src="video.js/dist/video-js.css"></style>
