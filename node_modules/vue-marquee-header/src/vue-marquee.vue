<template>
  <div v-bind:style="{ backgroundColor: this.$props.bgColor }" class="container-marquee" v-bind:class="marqueeState">
    <div
      @mouseleave="playAnimation()"
      @mouseover="pauseAnimation()"
      class="marquee"
    >
      <div
        :style="{
          'animation-play-state': animationState,
          'animation-duration': time,
          'animation-name': name,
          'animation-iteration-count': animationIterationCount,
        }"
      >
        <slot>
          <div v-bind:style="{ color: this.$props.textColor }" v-html="content"></div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
let count = 0;
export default {
  name: "marquee",
  props: {
    speed: {
      type: Number,
      default: 40,
    },
    textColor: {
      type: String,
      default: "#020826",
      required: false,
    },
    bgColor: {
      type: String,
      default: "#F9F4EF",
      required: false,
    },
    content: {
      type: String,
      default: "Do occaecat est ex <a href='http://www.google.com'>cillum laborum</a> tempor sint. Reprehenderit minim laboris et cupidatat exercitation est.",
    },
    animate: {
      type: String,
      default: 'infinite',
      required: false,
    }
  },
  data() {
    count++;
    return {
      time: 0,
      animationState: "running",
      animationIterationCount: this.$props.animate,
      name: "marquee" + count,
      styleEl: document.createElement("style"),
    };
  },
  watch: {
    content() {
      this.start();
    },
    speed() {
      this.start();
    },
  },
  methods: {
    pauseAnimation() {
      this.animationState = "paused";
    },
    playAnimation() {
      this.animationState = "running";
    },
    hideMarquee() {
      this.isVisible = false;
    },
    getTime() {
      return (
        Math.max(this.$el.firstChild.offsetWidth, this.$el.offsetWidth) / this.speed + "s"
      );
    },
    prefix(key, value) {
      return ["-webkit-", "-moz-", "-ms-", ""]
        .map((el) => `${el + key}:${value};`)
        .join("");
    },
    keyframes() {
      const from = this.prefix("transform", `translateX(${this.$el.offsetWidth}px)`);
      const to = this.prefix(
        "transform",
        `translateX(-${this.$el.firstChild.offsetWidth}px)`
      );
      const v = `@keyframes ${this.name} {
                from { ${from} }
                to { ${to} }
            }`;
      this.styleEl.innerHTML = v;
      document.head.appendChild(this.styleEl);
    },
    start() {
      this.$nextTick(() => {
        this.time = this.getTime();
        this.keyframes();
      });
    },
  },
  mounted() {
    this.start();
  },
  computed: {
    marqueeState: function () {
      if( this.$props.animate == 0 ) {
        return 'marquee-center';
      }
    }
  }
};
</script>

<style scoped>
.container-marquee {
  margin-bottom: 30px;
}
.container-marquee .marquee {
  white-space: nowrap;
  overflow: hidden;
  font-size: 18px;
  position: relative;
}
.container-marquee .marquee > div {
  display: inline-block;
  animation: marquee linear infinite;
}
.container-marquee .marquee .pause {
  animation-play-state: paused;
}
.container-marquee .marquee .running {
  animation-play-state: running;
}
.container-marquee {
  overflow: hidden;
  display: block;
  padding: 20px 0;
}
.marquee-center {
  text-align: center;
}
</style>
