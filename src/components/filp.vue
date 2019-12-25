<template>
  <div>
    <h1>
      Carousel
      <sup>3</sup>
    </h1>
    <div class="container">
      <div class="carousel" :data-slide="dataslide">
        <div class="carousel__slide">
          <div id="myChart" :style="{width: '300px', height: '300px'}"></div>
        </div>
        <div class="carousel__slide">
          <div id="myChart2" :style="{width: '300px', height: '300px'}"></div>
        </div>
        <div class="carousel__slide">
          <img src="http://fillmurray.com/g/300/300" />
        </div>
        <div class="carousel__slide">
          <img src="http://fillmurray.com/g/450/450" />
        </div>
      </div>
      <div class="next" @click="next">next</div>
      <div class="prev" @click="prev">previous</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataslide: 1,
      currentSlide: 1,
      nextSlide: 1
    };
  },
  mounted() {
    this.drawLine();
  },
  methods: {
    next() {
      this.currentSlide = this.dataslide;
      this.nextSlide = +this.currentSlide === 4 ? 1 : +this.currentSlide + 1;
      this.dataslide = this.nextSlide;
      console.log(this.dataslide);
    },
    prev() {
      this.currentSlide = this.dataslide;
      this.nextSlide = +this.currentSlide === 4 ? 1 : +this.currentSlide - 1;
      this.dataslide = this.nextSlide;
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('myChart'));
      // 绘制图表
      myChart.setOption({
        title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
      let myChart2 = this.$echarts.init(document.getElementById('myChart2'));
      // 绘制图表
      myChart2.setOption({
        title: { text: '在Vue中使用echarts' },
        tooltip: {},
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }
        ]
      });
    }
  }
};
</script>
<style lang="scss">
// @import "bourbon";

$primary-color: hsl(100, 100, 70);

.container {
  width: 90%;
  height: 60%;
  max-width: 60em;
  margin: 0 auto;
  padding-bottom: 5em;
  perspective: 100em;
}

.carousel {
  position: relative;
  width: 16em;
  height: 15em;
  margin: 0 auto;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;

  &[data-slide="1"] {
    transform: rotateY(0deg);
  }
  &[data-slide="2"] {
    transform: rotateY(-90deg);
  }
  &[data-slide="3"] {
    transform: rotateY(-180deg);
  }
  &[data-slide="4"] {
    transform: rotateY(-270deg);
  }
}

.carousel__slide {
  position: absolute;
  width: 16em;
  height: 14em;
  background: white;
  @extend .cf;

  img {
    width: 100%;
  }
}

.back,
.carousel__slide:nth-child(3) {
  transform: translateZ(-7.5em) rotateY(180deg);
}

.right,
.carousel__slide:nth-child(2) {
  transform: rotateY(-270deg) translateX(7.5em);
  transform-origin: top right;
}

.left,
.carousel__slide:nth-child(4) {
  transform: rotateY(270deg) translateX(-7.5em);
  transform-origin: center left;
}

.front,
.carousel__slide:nth-child(1) {
  transform: translateZ(7.5em);
}

.next,
.prev {
  position: absolute;
  top: 50%;
  right: 0;
  width: 7em;
  margin-top: -2.5em;
  border-radius: 3px;
  background: darken($primary-color, 30%);
  text-align: center;
  line-height: 3;
  color: white;
  transform: translateY(-50%);
  cursor: pointer;
}

.prev {
  left: 0;
}

/** PAGE STYLES **/
@import url(https://fonts.googleapis.com/css?family=Lato:300|Oswald);

// *,
// *:before,
// *:after {
//     @include box-sizing(border-box);
// }

html,
body {
  width: 100%;
  height: 100%;
}

html {
  font-size: 62.5%;
}

body {
  background: $primary-color;
  font-family: "Lato", sans-serif;
  font-size: 2em;
  line-height: 1.5;
}

.container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin: 0;
  padding: 0.5em;
  font-family: "Oswald", sans-serif;
  font-size: 4em;
  text-transform: uppercase;
  text-align: center;
  color: darken($primary-color, 40%);
}

/**
 * For modern browsers
 * 1. The space content is one way to avoid an Opera bug when the
 *    contenteditable attribute is included anywhere else in the document.
 *    Otherwise it causes space to appear at the top and bottom of elements
 *    that are clearfixed.
 * 2. The use of `table` rather than `block` is only necessary if using
 *    `:before` to contain the top-margins of child elements.
 */
.cf:before,
.cf:after {
  content: " "; /* 1 */
  display: table; /* 2 */
}

.cf:after {
  clear: both;
}

/**
 * For IE 6/7 only
 * Include this rule to trigger hasLayout and contain floats.
 */
.cf {
  *zoom: 1;
}
</style>
