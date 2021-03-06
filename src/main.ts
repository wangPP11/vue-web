import Vue from 'vue';
import App from './App.vue';
import router from './config/router';
import store from './config/store';
import './config/registerServiceWorker';
import axios from "./config/axios.tool";
import vueAxios from  "vue-axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/fonts/element-icons.ttf';
import 'element-ui/lib/theme-chalk/fonts/element-icons.woff';
import 'bootstrap/fonts/glyphicons-halflings-regular.ttf';
import 'bootstrap/fonts/glyphicons-halflings-regular.woff';

Vue.config.productionTip = false;
Vue.use(vueAxios, axios);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
