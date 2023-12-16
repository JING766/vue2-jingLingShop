import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 1、全局导入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 导入vue-table-with-tree-grid组件
import TreeTable from "vue-table-with-tree-grid";

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require stvles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 2、使用axios
import axios from 'axios'
import VueAxios from 'vue-axios'

axios.defaults.baseURL = 'http://www.chenfuguo.cn:8899/api/private/v1'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  let token_ = sessionStorage.getItem('token')
  if (token_) {
    config.headers['Authorization'] = token_;
    return config
  }
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

// 注册vue-table-with-tree-grid
Vue.component("tree-table", TreeTable);

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)

// 调整日期时间格式
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
