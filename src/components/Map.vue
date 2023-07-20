<script setup>
import { getCurrentInstance, onMounted, ref, onUnmounted } from 'vue'
import axios from 'axios'
import { getProvinceMapInfo } from '@/utils/map_utils'
const { proxy } = getCurrentInstance()

// 图表实例
let echartInstance = null
// 图表 dom 元素
const mapRef = ref(null)
// 图表数据
const allData = ref(null)
// 缓存省份地图数据
const mapData = ref({})

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
const initChart = async () => {
  echartInstance = proxy.$echarts.init(mapRef.value, 'chalk')

  // 获取中国矢量地图
  const { data: res } = await axios.get('/static/map/china.json')
  proxy.$echarts.registerMap('china', res)

  const initOption = {
    title: {
      text: '▎ 商家分布与销量排行',
      left: 20,
      top: 20
    },
    geo: {
      type: 'map',
      map: 'china',
      // 设置允许拖动和缩放
      roam: true,
      label: {
        show: true,
        color: '#fff'
      },
      top: '5%',
      bottom: '5%',
      itemStyle: {
        areaColor: '#2E72BF',
        borderColor: '#333'
      }
    },
    legend: {
      left: '5%',
      bottom: '5%',
      orient: 'vertical'
    }
  }
  echartInstance.setOption(initOption)

  // 监听图表点击事件
  echartInstance.on('click', async (arg) => {
    const provinceInfo = getProvinceMapInfo(arg.name)
    // 如果已经缓存了，就不再请求了
    if (!mapData.value[provinceInfo.key]) {
      // 获取相应的省份地图
      const { data: res } = await axios.get(provinceInfo.path)
      // 缓存
      mapData.value[provinceInfo.key] = res
      proxy.$echarts.registerMap(provinceInfo.key, res)
    }
    // 切换地图显示
    const changeOption = {
      geo: {
        map: provinceInfo.key
      }
    }
    echartInstance.setOption(changeOption)
  })
}
// 获取图表数据
const getData = async (res) => {
  // const { data: res } = await proxy.$http.get('/map')
  console.log(res)
  allData.value = res
  updateChart()
}
// 更新图表
const updateChart = () => {
  // 处理数据
  // 图例的数据
  const legendArr = allData.value.map(item => item.name)
  const seriesArr = allData.value.map(item => ({
    // 一个类别下所有散点数据
    // 如果想要在地图中显示散点的数据，需要给散点的图表增加一个 coordinateSystem 属性，值为 geo
    type: 'effectScatter',
    // 散点涟漪效果
    rippleEffect: {
      scale: 5,
      // 空心的涟漪效果
      brushType: 'stroke'
    },
    name: item.name,
    data: item.children,
    coordinateSystem: 'geo'
  }))
  const dataOption = {
    legend: {
      data: legendArr
    },
    series: seriesArr
  }
  echartInstance.setOption(dataOption)
}
// 浏览器屏幕发生变化调用，屏幕适配
const screenAdapter = () => {
  const titleFontSize = mapRef.value.offsetWidth / 100 * 3.6
  const adapterOption = {
    title: {
      textStyle: {
        fontSize: titleFontSize
      }
    },
    legend: {
      itemWidth: titleFontSize / 2,
      itemHeight: titleFontSize / 2,
      itemGap: titleFontSize / 2,
      textStyle: {
        fontSize: titleFontSize / 2
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

// 双击重新回到中国地图
const revertMap = () => {
  const revertOption = {
    geo: {
      map: 'china'
    }
  }
  echartInstance.setOption(revertOption)
}

// 组件创建注册回调函数
proxy.$socket.registerCallBack('mapData', getData)
// 组件销毁注销回调函数
onUnmounted(() => {
  proxy.$socket.unRegisterCallBack('mapData')
})
onMounted(() => {
  // 发送数据给服务器
  proxy.$socket.send({
    action: 'getData',
    socketType: 'mapData',
    chartName: 'map',
    value: ''
  })
})
</script>

<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>

<style lang="less" scoped></style>
