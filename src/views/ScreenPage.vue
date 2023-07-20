<script setup>
import { ref, getCurrentInstance, nextTick } from 'vue'
// import { getCurrentInstance } from 'vue'
// const { proxy } = getCurrentInstance()
// import { useStoreStore } from '@/store/index.js'
// const store = useStoreStore()
// import { getThemeValue } from '@/utils/theme_utils'

import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'

const { proxy } = getCurrentInstance()

// 定义每个图表的全屏状态
const fullScreenStatus = ref({
  trendRef: false,
  sellerRef: false,
  mapRef: false,
  rankRef: false,
  hotRef: false,
  stockRef: false
})
const trendRef = ref(null)
const sellerRef = ref(null)
const mapRef = ref(null)
const rankRef = ref(null)
const hotRef = ref(null)
const stockRef = ref(null)

// 全屏
const changeSize = async (chartName) => {
  // 1.改变 fullScreenStatus 的数据
  // 2.需要调用每一个图表组件 screenAdapter 方法
  fullScreenStatus.value[chartName] = !fullScreenStatus.value[chartName]

  await nextTick()
  proxy.$refs[chartName].screenAdapter()
}
</script>

<template>
  <div class="screen-container">
    <header class="screen-header">
      <div>
        <img src="../assets/img/header_border_dark.png" alt="">
      </div>
      <span class="logo">
        LOGO
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img src="../assets/img/qiehuan_dark.png" class="qiehuan">
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trendRef && 'fullscreen']">
          <!-- 销量趋势图表 -->
          <Trend ref="trendRef" />
          <div class="resize" @click="changeSize('trendRef')">
            <span :class="['iconfont', fullScreenStatus.trendRef ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.sellerRef && 'fullscreen']">
          <!-- 商家销售金额图表 -->
          <Seller ref="sellerRef" />
          <div class="resize" @click="changeSize('sellerRef')">
            <span :class="['iconfont', fullScreenStatus.sellerRef ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.mapRef && 'fullscreen']">
          <!-- 商家分布图表 -->
          <Map ref="mapRef" />
          <div class="resize" @click="changeSize('mapRef')">
            <span :class="['iconfont', fullScreenStatus.mapRef ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rankRef && 'fullscreen']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rankRef" />
          <div class="resize" @click="changeSize('rankRef')">
            <span :class="['iconfont', fullScreenStatus.rankRef ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hotRef && 'fullscreen']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hotRef" />
          <div class="resize" @click="changeSize('hotRef')">
            <span :class="['iconfont', fullScreenStatus.hotRef ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stockRef && 'fullscreen']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stockRef" />
          <div class="resize" @click="changeSize('stockRef')">
            <span :class="['iconfont', fullScreenStatus.stockRef ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="less" scoped>
// 全屏样式的定义
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}

.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;

  > div {
    img {
      width: 100%;
    }
  }

  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    font-weight: 700;
    transform: translate(-50%, -50%);
  }

  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }

  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }

  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }

  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);

    img {
      height: 35px;
      width: 128px;
    }
  }
}

.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;

  .screen-left {
    height: 100%;
    width: 27.6%;

    #left-top {
      height: 53%;
      position: relative;
    }

    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }

  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;

    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }

    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }

  .screen-right {
    height: 100%;
    width: 27.6%;

    #right-top {
      height: 46%;
      position: relative;
    }

    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
