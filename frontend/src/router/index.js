/* eslint-disable */
import Vue from 'vue';
import VueRouter from 'vue-router';
import login from '@/components/Login';
import home from '@/components/Home';
import axios from 'axios';
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: login
  },
  {
    path: '/home',
    component: home,
    meta: {
      requiresAuth: true
    }
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = false;

  try { //user logged in check
    if (to.path === '/home') {
      const response = await axios.get('http://localhost:4000/checkLogin', { withCredentials: true });
      isLoggedIn = response.status === 200;
      next();
    }
  } catch (e) {
    console.error(e);
    isLoggedIn = false;
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !isLoggedIn) { //ha nincs bejelentkezve, redirect to login
    next({ path: '/' });
  } else if (to.path === '/' && isLoggedIn) { //ha be van jelentkezve, redirect to home
    next({ path: '/home' });
  } else {
    next();
  }
});

export default router;