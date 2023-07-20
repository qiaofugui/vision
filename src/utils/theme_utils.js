const headerBorderDarkSrc = require('../assets/img/header_border_dark.png')
const headerBorderLightSrc = require('../assets/img/header_border_light.png')
const themeDarkSrc = require('../assets/img/qiehuan_dark.png')
const themeLightSrc = require('../assets/img/qiehuan_light.png')
const logoDarkSrc = require('../assets/img/logo_dark.png')
const logoLightSrc = require('../assets/img/logo_light.png')

const theme = {
  chalk: {
    // 背景颜色
    backgroundColor: '#161522',
    // 标题文字颜色
    titleColor: '#fff',
    // LOGO
    logoSrc: logoDarkSrc,
    // 切换主题按钮的图片路径
    themeSrc: themeDarkSrc,
    // 主页顶部边框图片路径
    headerBorderSrc: headerBorderDarkSrc,

    selectedBgc: '#222733'
  },
  vintage: {
    // 背景颜色
    backgroundColor: '#eee',
    // 标题文字颜色
    titleColor: '#111',
    // LOGO
    logoSrc: logoLightSrc,
    // 切换主题按钮的图片路径
    themeSrc: themeLightSrc,
    // 主页顶部边框图片路径
    headerBorderSrc: headerBorderLightSrc,

    selectedBgc: '#fff'
  }
}

export function getThemeValue (themeValue) {
  return theme[themeValue]
}
