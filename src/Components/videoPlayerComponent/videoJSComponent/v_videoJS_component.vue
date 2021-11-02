<template>
  <div class="videoJSComponent">
    <transition name="fade">
      <div v-show="overlayActive" class="overlay">
          <h3 class="title">{{title}}</h3>
          <div v-show="specsActive" class="specs">
            <h3 class="resolution">{{translation.width + " x " + translation.height}}</h3>
            <h3 class="episode">{{episode.episodeFull}}</h3>
          </div>
      </div>
    </transition>

    <div class="videoContainer">
      <video
      ref="videoPlayer"
      class="video-js vjs-sublime-skin"

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
            overlayTimeout:undefined,

            timeoutEnable:undefined,
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
        console.log("onended")
        if (!this.player.isDisposed())
        this.player.dispose()
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
          if (!this.player.isDisposed()){
            this.player.pause()
          }
        }
      }
    },
    created:function(){

    },
    computed:{
      playerStatusMenuActive:function(){
        return this.$store.state.status.playerStatusMenuActive
      }
    },
    mounted() {
        this.player = videojs(this.$refs.videoPlayer, this.options, ()=> {
          console.log(this.options)
          this.getSubtitles()
          //this.ass.resize()
          //this.isFullscreen(true)
          this.player.on('error',() => {

            let err = this.player.error()
            console.log(err)
            this.$store.commit('changeGlobalNatification',{
              type:"error",
              message:err.message,
              code:err.code
            })
            if (this.player) {
                console.log("player dispose")
                this.player.dispose()
            }
            this.$store.commit("updatePlayerStatusMenuActive",true)
          })

          this.player.on('ended', function() {
            console.log("player dispose")
            this.dispose();
          });

          this.player.hotkeys({
            alwaysCaptureHotkeys:true,
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

        //console.log(document.activeElement)
        //this.getSubtitles(this.ass,this.$refs.videoPlayer)
    },
    beforeDestroy() {
      //console.log(this.ass)
      //console.log("player Off")
      /*if (this.ass !== null){
        this.ass.destroy();
      }*/
      console.log("player dispose")
      if (this.player && !this.player.isDisposed()) {
          this.player.dispose()
      }

    }
}
</script>

<style scoped="true" lang="scss" src="./videoJSComponent.scss"></style>
<style lang="css" src="video.js/dist/video-js.css"></style>
<style lang="scss" src="./subline.scss"></style>
