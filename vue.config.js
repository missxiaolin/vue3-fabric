const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  lintOnSave: false,
  transpileDependencies: true,
  resolve: {
    alias: {
      '@xiaolin/core-fabric': '/src/packages/core', // 设置一个别名 '@'，对应路径为 '/src'
    },
  },
})
