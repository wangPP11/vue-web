import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import axios from "./config/axios.tool";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vueAxios from  "vue-axios";

Vue.config.productionTip = false;
Vue.use(vueAxios, axios);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
