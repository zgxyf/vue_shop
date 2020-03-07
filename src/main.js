import Vue from 'vue'
import ZkTable from 'vue-table-with-tree-grid'
import router from './router'
import App from './App.vue'

import './util/Interception'

import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式

import './assets/css/global.css'

Vue.use(ZkTable)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
