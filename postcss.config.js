export default {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 16, // 基于 16px 基础字体大小
      unitPrecision: 5, // 保留小数位数
      propList: ['font', 'font-size', 'margin*', 'padding*', '*width', '*height', 'border', 'grid', 'gap',], // 需要转换的属性
      selectorBlackList: ['html'], // 不需要转换的选择器（排除 html）
      replace: true, // 替换规则
      mediaQuery: false, // 不转换媒体查询中的 px
      minPixelValue: 2, // 最小转换值，小于 2px 的不转换
      exclude: /node_modules/i, // 排除 node_modules
    },
  },
}
