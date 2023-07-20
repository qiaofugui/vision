<script setup>
import { getCurrentInstance, onMounted, ref, onUnmounted } from 'vue'
const { proxy } = getCurrentInstance()

// 图表实例
let echartInstance = null
// 图表 dom 元素
const trendRef = ref(null)
// 图表数据
const allData = ref(null)

onMounted(() => {
  initChart()
  getData()
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
  const initOption = {}
  echartInstance.setOption(initOption)
}
// 获取图表数据
const getData = async () => {
  const { data: res } = await proxy.$http.get('/trend')
  allData.value = res
  updateChart()
}
// 更新图表
const updateChart = () => {
  // 处理数据
  const dataOption = {}
  echartInstance.setOption(dataOption)
}
// 浏览器屏幕发生变化调用，屏幕适配
const screenAdapter = () => {
  const adapterOption = {}
  echartInstance.setOption(adapterOption)
  echartInstance.resize()
}

onUnmounted(() => {
  // 取消监听
  window.removeEventListener('resize', screenAdapter)
})
</script>

<template>
  <div class="com-container">
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<style lang="less" scoped></style>
