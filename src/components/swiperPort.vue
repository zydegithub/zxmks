
<template>
  <div class="gallery-thumbs-box">
    <div class="swiper-container gallery-top">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in imgUrls[name]" :key="item">
          <img :src="'static/lib/images/课设素材照片/'+name+'/'+item+'.jpg'" alt preview="index" />
        </div>
      </div>
    </div>

    <div class="swiper-container gallery-bottom">
      <div class="swiper-wrapper">
        <div class="swiper-slide slide1" v-for="(item,index) in imgUrls[name]" :key="item">
          <img
            :src="'static/lib/images/课设素材照片/'+name+'/'+item+'.jpg'"
            alt
            :class="{ heighImg: currIndex == index }"
          />
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
      currIndex: 0,
      imgUrls: {
        北京动物园: ['动物园1', '动物园2', '动物园3', '动物园4', '动物园5'],
        北京植物园: ['植物1', '植物2', '植物3', '植物4', '植物5', '植物6'],
        朝阳公园: ['朝阳1', '朝阳2', '朝阳3', '朝阳4', '朝阳5'],
        地坛: ['地坛1', '地坛2', '地坛3', '地坛4', '地坛5'],
        故宫: ['故宫1', '故宫2', '故宫3', '故宫4', '故宫5'],
        鸟巢: ['鸟巢1', '鸟巢2', '鸟巢3'],
        什刹海: ['什刹海1', '什刹海2', '什刹海3', '什刹海4', '什刹海5'],
        天安门广场: [
          '天安门广场1',
          '天安门广场2',
          '天安门广场3',
          '天安门广场4',
          '天安门广场5'
        ],
        天坛: ['天坛1', '天坛2', '天坛3', '天坛4', '天坛5'],
        香山: ['香山1', '香山2', '香山3', '香山4', '香山5'],
        颐和园: ['颐和园1', '颐和园2', '颐和园3', '颐和园4', '颐和园5'],
        圆明园: ['圆明园1', '圆明园2', '圆明园3', '圆明园4', '圆明园5'],
        长城: ['长城1', '长城2', '长城3', '长城4', '长城5'],
        北京欢乐谷: ['北京欢乐谷1', '北京欢乐谷2', '北京欢乐谷3']
      }
    };
  },
  watch: {
    name: {
      handler: function(val, oldVal) {
        this.$nextTick(() => {
          // 销毁轮播图 初始化
          if (this.galleryTop) {
            this.galleryTop.destroy(false);
            this.galleryThumbs.destroy(false);
            this.currIndex = 0;
          }
          this.swiperInit();
          this.$previewRefresh();
        });
      },
      deep: true
    }
  },
  components: {},
  mounted() {
    this.swiperInit();
    this.$previewRefresh();
  },
  props: {
    name: String
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
