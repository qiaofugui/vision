<script setup>
// import { getCurrentInstance } from 'vue'
// const { proxy } = getCurrentInstance()
// import { useStoreStore } from '@/store/index.js'
// const store = useStoreStore()
</script>

<template>
  <RouterView />
</template>

<style lang="less"></style>

<!--
  用法：vue-cli-service build [options] [entry|pattern]
  选项：

  --mode        指定环境模式 (默认值：production)
  --dest        指定输出目录 (默认值：dist)
  --modern      面向现代浏览器带自动回退地构建应用
  --target      app | lib | wc | wc-async (默认值：app)
  --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
  --no-clean    在构建项目之前不清除目标目录的内容
  --report      ** 生成 report.html 以帮助分析包内容 **
  --report-json 生成 report.json 以帮助分析包内容
  --watch       监听文件变化
-->
