<script setup>
import { getCurrentInstance, onMounted, ref, onUnmounted, computed, defineExpose } from 'vue'
const { proxy } = getCurrentInstance()

// 图表实例
let echartInstance = null
// 图表 dom 元素
const trendRef = ref(null)
// 图表数据
const allData = ref(null)

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
  echartInstance = proxy.$echarts.init(trendRef.value, 'chalk')
  const initOption = {
    xAxis: {
      type: 'category',
      // 紧挨边缘
      boundaryGap: false
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      top: '35%',
      left: '3%',
      right: '4%',
      bottom: '1%',
      // 是否包含坐标轴的刻度标签
      containLabel: true
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      left: 20,
      top: '20%',
      icon: 'circle'
    }
  }
  echartInstance.setOption(initOption)
}
// 获取图表数据
const getData = (res) => {
  // res 是服务端发送给客户端图表的数据
  // const { data: res } = await proxy.$http.get('/trend')
  console.log(res)
  allData.value = res
  updateChart()
}
// 更新图表
const updateChart = () => {
  // 半透明的颜色值
  const colorArr1 = [
    'rgba(11, 168, 44, 0.5)',
    'rgba(44, 110, 255, 0.5)',
    'rgba(22, 242, 217, 0.5)',
    'rgba(254, 33, 30, 0.5)',
    'rgba(250, 105, 0, 0.5)'
  ]
  // 全透明的颜色值
  const colorArr2 = [
    'rgba(11, 168, 44, 0)',
    'rgba(44, 110, 255, 0)',
    'rgba(22, 242, 217, 0)',
    'rgba(254, 33, 30, 0)',
    'rgba(250, 105, 0, 0)'
  ]

  // 处理数据
  // 类目轴的数据
  const timeArr = allData.value.common.month
  // y 轴的数据 series 下的数据
  const valueArr = allData.value[choiceType.value].data
  const seriesArr = valueArr.map((item, index) => ({
    name: item.name,
    type: 'line',
    data: item.data,
    // 堆叠图
    stack: choiceType.value,
    // 面积图
    areaStyle: {
      color: new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: colorArr1[index]
      }, {
        offset: 1,
        color: colorArr2[index]
      }])
    }
  }))
  // 图例的数据
  const legendArr = valueArr.map(item => item.name)
  const dataOption = {
    xAxis: {
      data: timeArr
    },
    legend: {
      data: legendArr
    },
    series: seriesArr
  }
  echartInstance.setOption(dataOption)
}
// 浏览器屏幕发生变化调用，屏幕适配
const screenAdapter = () => {
  titleFontSize.value = trendRef.value.offsetWidth / 100 * 3.6
  const adapterOption = {
    // 图例大小
    legend: {
      itemWidth: titleFontSize.value,
      itemHeight: titleFontSize.value,
      // 间隔
      itemGap: titleFontSize.value,
      textStyle: {
        fontSize: titleFontSize.value / 1.5
      }
    }
  }
  echartInstance.setOption(adapterOption)
  echartInstance.resize()
}

onUnmounted(() => {
  // 取消监听
  window.removeEventListener('resize', screenAdapter)
})

// 选择
const showChoice = ref(false)
// 显示数据类型
const choiceType = ref('map')
// 切换类型
const handleSelected = (currentType) => {
  choiceType.value = currentType
  showChoice.value = false
  updateChart()
}
// 显示标题
const showTitle = computed(() => {
  if (!allData.value) return ''
  return allData.value[choiceType.value].title
})
// 动态设置大小
const titleFontSize = ref(0)
const comStyle = computed(() => {
  return {
    fontSize: titleFontSize.value + 'px'
  }
})
const marginStyle = computed(() => {
  return {
    marginLeft: titleFontSize.value + 'px'
  }
})

// 组件创建注册回调函数
proxy.$socket.registerCallBack('trendData', getData)
// 组件销毁注销回调函数
onUnmounted(() => {
  proxy.$socket.unRegisterCallBack('trendData')
})
onMounted(() => {
  // 发送数据给服务器
  proxy.$socket.send({
    action: 'getData',
    socketType: 'trendData',
    chartName: 'trend',
    value: ''
  })
})

// 让父组件可拿到自己方法
defineExpose({
  screenAdapter
})
</script>

<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <div @click="showChoice = !showChoice">
        <span>{{ '▎ ' + showTitle }}</span>
        <span class="iconfont title-icon" :style="comStyle">&#xe6eb;</span>
      </div>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item" v-for="item in allData?.type" :key="item.key" v-show="item.key !== choiceType"
          @click="handleSelected(item.key)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<style lang="less" scoped>
.title {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  color: white;

  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }

  .select-con {
    background-color: #222733;
  }
}
</style>
