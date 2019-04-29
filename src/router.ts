import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('./views/Login.vue'),
    },
    { path: '/home', component: Home, name: '系统模块', /*iconCls: 'fa fa-cog',*/
      children: [
        { path: '/menu',  name: '菜单管理', component: () => import('./views/Login.vue')},
        { path: '/role',  name: '角色管理', component: () => import('./views/Login.vue')},
        { path: '/user',  name: '用户管理', component: () => import('./views/Login.vue')}
      ]
    },
  ],
});
