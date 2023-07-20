<script setup>
import { getCurrentInstance, onMounted, ref, onUnmounted, computed } from 'vue'
const { proxy } = getCurrentInstance()

// 图表实例
let echartInstance = null
// 图表 dom 元素
const hotRef = ref(null)
// 图表数据
const allData = ref(null)
// 饼图切换
const currentIndex = ref(0)

const titleFontSize = ref(0)

onMounted(() => {
  initChart()
  // getData()
})
// 窗口变化
onMounted(() => {
  window.addEventListener('resize', screenAdapter)
  // 开始也要执行一次
  screenAdapter()
})

// 初始化图表
const initChart = () => {
  echartInstance = proxy.$echarts.init(hotRef.value, 'chalk')
  const initOption = {
    title: {
      text: '▎ 热销商品销售金额占比统计',
      top: 20,
      left: 20
    },
    legend: {
      top: '15%',
      icon: 'circle'
    },
    tooltip: {
      show: true,
      formatter: (arg) => {
        const thirdCategory = arg.data.children
        // 计算所有三级分类数值总和
        const total = thirdCategory.reduce((total, item) => total + item.value, 0)
        const resStr = thirdCategory.reduce((str, item) => (str + `${item.name}: ${parseInt(item.value / total * 100)}%<br />`
        ), '')
        return resStr
      }
    },
    series: [
      {
        type: 'pie',
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true
          },
          labelLine: {
            show: false
          }
        }
      }
    ]
  }
  echartInstance.setOption(initOption)
}
// 获取图表数据
const getData = async (res) => {
  // const { data: res } = await proxy.$http.get('/hot')
  console.log(res)
  allData.value = res
  updateChart()
}
// 更新图表
const updateChart = () => {
  // 处理数据
  const seriesData = allData.value[currentIndex.value].children.map((item) => ({
    name: item.name,
    value: item.value,
    children: item.children
  }))
  // 图例
  const legendData = allData.value[currentIndex.value].children.map((item) => item.name)
  const dataOption = {
    legend: {
      data: legendData
    },
    series: [
      {
        data: seriesData
      }
    ]
  }
  echartInstance.setOption(dataOption)
}
// 浏览器屏幕发生变化调用，屏幕适配
const screenAdapter = () => {
  titleFontSize.value = hotRef.value.offsetWidth / 100 * 3.6
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize.value
      }
    },
    legend: {
      itemWidth: titleFontSize.value / 2,
      itemHeight: titleFontSize.value / 2,
      itemGap: titleFontSize.value / 2,
      textStyle: {
        fontSize: titleFontSize.value / 2
      }
    },
    series: [
      {
        radius: titleFontSize.value * 4.5,
        center: ['50%', '60%'],
        label: {
          fontSize: titleFontSize.value
        }
      }
    ]
  }
  echartInstance.setOption(adapterOption)
  echartInstance.resize()
}

onUnmounted(() => {
  // 取消监听
  window.removeEventListener('resize', screenAdapter)
})

// 切换饼图数据
const toLeft = () => {
  currentIndex.value--
  if (currentIndex.value < 0) currentIndex.value = allData.value.length - 1
  updateChart()
}
const toRight = () => {
  currentIndex.value++
  if (currentIndex.value > allData.value.length - 1) currentIndex.value = 0
  updateChart()
}
// 计算标题
const catName = computed(() => (
  allData.value ? allData.value[currentIndex.value].name : ''
))

// 计算样式按屏幕设置大小
const comStyle = computed(() => ({
  fontSize: titleFontSize.value + 'px'
}))

// 组件创建注册回调函数
proxy.$socket.registerCallBack('hotData', getData)
// 组件销毁注销回调函数
onUnmounted(() => {
  proxy.$socket.unRegisterCallBack('hotData')
})
onMounted(() => {
  // 发送数据给服务器
  proxy.$socket.send({
    action: 'getData',
    socketType: 'hotData',
    chartName: 'hot',
    value: ''
  })
})
</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <span class="iconfont arr-left" :style="comStyle" @click="toLeft">&#xe6ef;</span>
    <span class="iconfont arr-right" :style="comStyle" @click="toRight">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>

<style lang="less" scoped>
.iconfont {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #fff;
}

.arr-left {
  left: 10%;
}

.arr-right {
  right: 10%;
}

.cat-name {
  position: absolute;
  left: 80%;
  bottom: 20px;
  color: #fff;
}
</style>
