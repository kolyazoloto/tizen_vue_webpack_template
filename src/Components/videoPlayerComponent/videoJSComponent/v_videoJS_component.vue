<template>
  <div class="videoJSComponent">
    <transition name="fade">
      <div v-show="overlayActive" class="overlay">
        <h3 class="title">
          <div>{{title}}</div>
          <div v-show="specsActive" class="specs">
            <h3 class="resolution">{{translation.width + " x " + translation.height}}</h3>
            <h3 class="episode">{{episode.episodeFull}}</h3>
          </div>
        </h3>
      </div>
    </transition>

    <div class="videoContainer">
      <video
      ref="videoPlayer"
      class="video-js"
      width="1920"
      height="1080"
      preload="auto"
      v-focus

      @play="onPlay"
      @pause="onPause"
      @ended="onEnded"

      ></video>
    </div>


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
        episode:Object,
        translation:Object,
        assUrl:String,
        vttUrl:String,
        season:Array,
        startFromBegining:Boolean,
    },
    directives: {
      focus: {
        inserted: function (el,binding) {
          if ((! binding.hasOwnProperty('value')) || binding.value) {
            el.focus({preventScroll: true})
          }
        }
      }
    },
    data() {
        return {
            player: null,
            ass:null,
            overlayActive:false,
            specsActive:true,
            overlayTimeout:undefined
        }
    },
    methods:{
      onPlay:function(){
        if (this.ass !== null){
          this.ass.show()
        }
        //Манипуляции с оверлеем
        this.overlayActive = true;
        if (this.overlayTimeout != undefined){
          clearTimeout(this.overlayTimeout)
        }
        this.overlayTimeout = setTimeout(()=>{
          this.overlayActive = false;
        },5000)
      },
      onPause:function(){
        if (this.ass !== null){
          this.ass.hide()
        }
        if (this.overlayTimeout != undefined){
          clearTimeout(this.overlayTimeout)
        }
        this.overlayActive = true;

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
    						   container: document.querySelector('.video-js'),
                })
              })
	        }
			  }
      },


    },
    watch:{
      startFromBegining:function(){
        if (this.player != null) this.player.currentTime(0)
      },
      playerStatusMenuActive:function(val){
        if (!val) {
          this.$nextTick(()=>{
            this.specsActive = true;
            this.player.play()
            this.$el.querySelector("video").focus()
          })
        }
        else{
          this.player.pause()
        }
      }
    },
    computed:{
      playerStatusMenuActive:function(){
        return this.$store.state.status.playerStatusMenuActive
      }
    },
    mounted() {
        this.player = videojs(this.$refs.videoPlayer, this.options, ()=> {
          this.getSubtitles()
          //this.ass.resize()
          //this.isFullscreen(true)
          this.player.hotkeys({
            //alwaysCaptureHotkeys:true,
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
                  if(this.player.paused()) {
                    this.specsActive = false;
                    if (this.overlayTimeout != undefined){
                      clearTimeout(this.overlayTimeout)
                    }
                    this.$store.commit("updatePlayerStatusMenuActive",true)
                  }
                  else this.player.pause()
                }
              }
            }
          })
        })
        this.$el.querySelector("video").focus()
        //console.log(document.activeElement)
        //this.getSubtitles(this.ass,this.$refs.videoPlayer)
    },
    beforeDestroy() {
      //console.log(this.ass)
      //console.log("player Off")
      /*if (this.ass !== null){
        this.ass.destroy();
      }*/
      if (this.player) {
          this.player.dispose()
      }

    }
}
</script>

<style scoped="true" lang="scss" src="./videoJSComponent.scss"></style>
<style lang="css" src="video.js/dist/video-js.css"></style>
