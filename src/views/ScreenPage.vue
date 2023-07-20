<script setup>
import { ref, getCurrentInstance, nextTick, onUnmounted, computed, onMounted } from 'vue'

import Hot from '@/components/Hot.vue'
import Map from '@/components/Map.vue'
import Rank from '@/components/Rank.vue'
import Seller from '@/components/Seller.vue'
import Stock from '@/components/Stock.vue'
import Trend from '@/components/Trend.vue'

import { getThemeValue } from '@/utils/theme_utils'
import { useStoreStore } from '@/store/index.js'

import { toggleFull, isFull } from 'be-full'

const store = useStoreStore()

const { proxy } = getCurrentInstance()

const theme = computed(() => store.theme)
const logoSrc = computed(() => getThemeValue(theme.value).logoSrc)
const headerSrc = computed(() => getThemeValue(theme.value).headerBorderSrc)
const themeSrc = computed(() => getThemeValue(theme.value).themeSrc)
const containerStyle = computed(() => ({
  backgroundColor: getThemeValue(theme.value).backgroundColor,
  color: getThemeValue(theme.value).titleColor
}))

// 定义每个图表的全屏状态
const fullScreenStatus = ref({
  trend: false,
  seller: false,
  map: false,
  rank: false,
  hot: false,
  stock: false
})
const trend = ref(null)
const seller = ref(null)
const map = ref(null)
const rank = ref(null)
const hot = ref(null)
const stock = ref(null)

// 全屏
const changeSize = async (chartName) => {
  // 1.改变 fullScreenStatus 的数据
  // 2.需要调用每一个图表组件 screenAdapter 方法
  // fullScreenStatus.value[chartName] = !fullScreenStatus.value[chartName]

  // await nextTick()
  // proxy.$refs[chartName].screenAdapter()

  // 全屏效果联动
  proxy.$socket.send({
    action: 'fullScreen',
    socketType: 'fullScreen',
    chartName: chartName,
    value: !fullScreenStatus.value[chartName]
  })
}
// 全屏切换联动
const recvData = async (data) => {
  console.log(data)
  // 取出是哪个图表需要进行切换，切换成什么状态
  const chartName = data.chartName
  const targetValue = data.value
  fullScreenStatus.value[chartName] = targetValue

  await nextTick()
  proxy.$refs[chartName].screenAdapter()
}
proxy.$socket.registerCallBack('fullScreen', recvData)
onUnmounted(() => {
  proxy.$socket.unRegisterCallBack('fullScreen')
})

// 主题切换
const handleChangeTheme = () => {
  // store.changeTheme()

  // 主题切换联动
  proxy.$socket.send({
    action: 'themeChange',
    socketType: 'themeChange',
    chartName: '',
    value: ''
  })
}
const recvThemeChange = () => {
  store.changeTheme()
}
proxy.$socket.registerCallBack('themeChange', recvThemeChange)
onUnmounted(() => {
  proxy.$socket.unRegisterCallBack('themeChange')
})

const time = ref('')
const timer = ref(null)
onMounted(() => {
  time.value = proxy.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  if (timer.value) clearInterval(timer.value)
  timer.value = setInterval(() => {
    time.value = proxy.$dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  }, 1000)
})
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value)
})

// 全屏切换按钮样式
const fullScreenClickStyle = computed(() => ({
  backgroundColor: getThemeValue(theme.value === 'chalk' ? 'vintage' : 'chalk').backgroundColor,
  color: getThemeValue(theme.value === 'chalk' ? 'vintage' : 'chalk').titleColor
}))

// 思否全屏
const isFullScreen = ref(isFull(document.documentElement))
console.log(isFull(document.documentElement))
//  全屏事件
const fullScreenClick = () => {
  toggleFull(document.documentElement)
  isFullScreen.value = !isFull(document.documentElement)
}
</script>

<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="">
      </div>
      <span class="logo">
        <img :src="logoSrc" alt="">
        <!-- LOGO -->
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleChangeTheme">
        <button class="full-screen-click" :style="fullScreenClickStyle" @click="fullScreenClick">{{ !isFullScreen ? '全屏' :
          '退出全屏' }}</button>
        <span class="datetime">{{ time }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="[fullScreenStatus.trend && 'fullscreen']">
          <!-- 销量趋势图表 -->
          <Trend ref="trend" />
          <div class="resize" @click="changeSize('trend')">
            <span :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="[fullScreenStatus.seller && 'fullscreen']">
          <!-- 商家销售金额图表 -->
          <Seller ref="seller" />
          <div class="resize" @click="changeSize('seller')">
            <span :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="[fullScreenStatus.map && 'fullscreen']">
          <!-- 商家分布图表 -->
          <Map ref="map" />
          <div class="resize" @click="changeSize('map')">
            <span :class="['iconfont', fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom" :class="[fullScreenStatus.rank && 'fullscreen']">
          <!-- 地区销量排行图表 -->
          <Rank ref="rank" />
          <div class="resize" @click="changeSize('rank')">
            <span :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot && 'fullscreen']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot" />
          <div class="resize" @click="changeSize('hot')">
            <span :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="[fullScreenStatus.stock && 'fullscreen']">
          <!-- 库存销量分析图表 -->
          <Stock ref="stock" />
          <div class="resize" @click="changeSize('stock')">
            <span :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
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

.full-screen-click {
  padding: 3px 10px;
  margin-left: 10px;
  border: none;
  border-radius: 3px;
}
</style>
