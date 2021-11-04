<template>
  <div class="videoJSComponent">
    <transition name="fade">
      <div v-show="overlayActive" class="overlay">
          <h3  v-bind:style="{ fontSize: fontSize + 'px' }" class="title">{{title}}</h3>
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
      ></video>
    </div>


  </div>
</template>


<script>
import Vue from 'vue'
import videojs from 'video.js';
import 'videojs-hotkeys'
import Ass from "assjs"
import SubtitlesOctopus from "./assOctopus/subtitles-octopus.js"
// чисто подключаем чтобы вебпак включил их в сборку
//import worker from "./assOctopus/subtitles-octopus-worker.js"
//import workerData from "./assOctopus/subtitles-octopus-worker.data"
//import workerWasm from "./assOctopus/subtitles-octopus-worker.wasm"
//import SubtitlesOctopus from './assOctopus/subtitles-octopus.js'
//import Worker from './assOctopus/subtitles-octopus-worker.js'
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
            subInstance:null,
            overlayActive:false,
            specsActive:true,
            overlayTimeout:undefined,

            timeoutEnable:undefined,
            fontSize:null,
        }
    },
    methods:{
      onPlay:function(){
        //Манипуляции с оверлеем
        this.overlayActive = true;
        if (this.overlayTimeout != undefined){
          clearTimeout(this.overlayTimeout)
        }
        this.overlayTimeout = setTimeout(()=>{
          this.overlayActive = false;
        },3000)
      },
      onPause:function(){
        if (this.subInstance !== null){
          //this.subInstance.hide()
        }
        if (this.overlayTimeout != undefined){
          clearTimeout(this.overlayTimeout)
        }
        this.overlayActive = true;

      },
      getSubtitles:function(){
        console.log(this.assUrl,this.vttUrl)
        if (this.assUrl !== null){
          if (this.assUrl.includes("/translations/ass/")){
            var options = {
                video: document.querySelector('video'), // HTML5 video element
                subUrl: "https://smotret-anime.online" + this.assUrl, // Link to subtitles
                //fonts: ['Lato-Bold.ttf'], // Links to fonts (not required, default font already included in build)
                workerUrl: 'subtitles-octopus-worker.js', // Link to WebAssembly-based file "libassjs-worker.js"
                //legacyWorkerUrl: 'libassjs-worker-legacy.js' // Link to non-WebAssembly worker
            };
            this.subInstance = new SubtitlesOctopus(options);
          }
				  else if (!this.assUrl.includes("https")){
            //console.log(this.vttUrl)
					  this.player.addRemoteTextTrack({
					    src: this.vttUrl,
					    srclang: 'en',
					    label: 'english',
					    kind: 'subtitles'
						 }, true);
				  }
				  else{
              var options = {
                  video: document.querySelector('video'), // HTML5 video element
                  subUrl: this.assUrl, // Link to subtitles
                  //fonts: ['Lato-Bold.ttf'], // Links to fonts (not required, default font already included in build)
                  workerUrl: 'subtitles-octopus-worker.js', // Link to WebAssembly-based file "libassjs-worker.js"
                  //legacyWorkerUrl: 'libassjs-worker-legacy.js' // Link to non-WebAssembly worker
              };
              this.subInstance = new SubtitlesOctopus(options);

	        }
			  }
      },


    },
    watch:{
      overlayActive:function(val){
        if (val === true){
          if (this.fontSize == null){
            console.log("zalupa")
            this.$nextTick(()=>{
              let width = this.$el.querySelector(".overlay .title").getBoundingClientRect().width
              let widthScroll = this.$el.querySelector(".overlay .title").scrollWidth
              this.fontSize = 110*width/widthScroll
            })
          }
        }
      },
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
          this.player.on("ended",()=>{
            if ((this.player.currentTime() / this.player.duration()) > 0.9){
              //if (!this.player.isDisposed()) this.player.dispose()
              this.$emit("playnext")
            }
          })

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
    },
    beforeDestroy() {
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
