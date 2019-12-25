
<template>
  <div class="gallery-thumbs-box">
    <div class="swiper-container gallery-top">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <img src="static/lib/地坛.jpg" alt preview="index" />
        </div>
        <div class="swiper-slide">
          <img src="static/lib/故宫.jpg" alt preview="index" />
        </div>
        <div class="swiper-slide">
          <img src="static/lib/鸟巢.jpg" alt preview="index" />
        </div>
      </div>
    </div>

    <div class="swiper-container gallery-bottom">
      <div class="swiper-wrapper">
        <div class="swiper-slide slide1">
          <img src="static/lib/地坛.jpg" alt :class="{ heighImg: currIndex == 0 }" />
        </div>
        <div class="swiper-slide slide1">
          <img src="static/lib/故宫.jpg" alt :class="{ heighImg: currIndex == 1 }" />
        </div>
        <div class="swiper-slide slide1">
          <img src="static/lib/鸟巢.jpg" alt :class="{ heighImg: currIndex == 2 }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
import Swiper from 'swiper';
// import { url } from 'inspector';
// import 'swiper/dist/css/swiper.min.css'
export default {
  name: 'Swiper',
  data() {
    return {
      currIndex: 0
    };
  },
  components: {},
  mounted() {
    this.swiperInit();
    this.$previewRefresh();
  },
  methods: {
    swiperInit() {
      var that = this;
      var galleryThumbs = new Swiper('.gallery-bottom', {
        spaceBetween: 10,
        slidesPerView: 3,
        // freeMode: true,
        pagination: '.swiper-pagination',
        //  slidesPerView:'auto',
        watchSlidesVisibility: true,
        watchSlidesProgress: true
      });
      var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 20,
        slidesPerView: 1,
        // loop: true,
        autoplay: {
          delay: 2000
        },
        pagination: {
          el: '.swiper-pagination2' // 分页器 -
        },
        thumbs: {
          swiper: galleryThumbs
        },
        on: {
          slideChangeTransitionStart: function() {
            that.currIndex = this.realIndex;
          }
        }
      });
      var comtainer = document.getElementsByClassName('gallery-top')[0];
      comtainer.onmouseenter = function() {
        galleryTop.autoplay.stop();
      };
      comtainer.onmouseleave = function() {
        galleryTop.autoplay.start();
      };
    }
  }
};
</script>

<style  scoped>
.gallery-thumbs-box {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.swiper-container {
  height: 357px;
  overflow: hidden;
}
.swiper-wrapper {
  width: 372px;
  height: 357px;
  /* background-color: pink; */
  display: flex;
}
.gallery-top {
  height: 220px;
}
.swiper-slide {
  width: 372px;
  height: 209px;
  position: relative;
}
.swiper-slide img {
  width: 380px;
  height: 200px;
  margin: 0 auto;
  /* background-position: center; */
  position: absolute;
  left: 8px;
  top: 10px;
}
.gallery-bottom {
  /* height: 352px; */
  /* position: absolute;
  top: 205px; */
  height: 95px;
  /* padding: 10px auto; */
  box-sizing: border-box;
}
.slide1 {
  display: flex;
  /* width: 342px;
        height: 80px; */
  /* background: pink;
        top: 10px; */
  text-align: center;
  padding: 10px 0;
  /* overflow: hidden; */
}

.slide1 img {
  height: 88px;
  width: 106px;
  /* box-sizing: border-box; */
  border: 1px solid transparent;
  opacity: 0.4;
}
.slide1 .heighImg {
  border-color: gray;
  opacity: 1;
}
::-webkit-scrollbar {
  display: none;
}
</style>
