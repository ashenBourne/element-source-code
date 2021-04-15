import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Message from "@/components/Message/index"
Vue.config.productionTip = false
// 挂载圆形方法
Vue.prototype.$messageSelf = Message;
Vue.use(ElementUI);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
