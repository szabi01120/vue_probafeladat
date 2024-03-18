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
  let sessionId = '';
  try { //sessionId cookie kiolvasása
      sessionId = document.cookie.split('; ').find(row => row.startsWith('sessionId=')).split('=')[1];
  } catch (e) { sessionId = ''; }

  try { //user logged in check
    if (to.path === '/home') {
      const response = await axios.get('http://192.168.0.133:4000/checkLogin', {
          headers: {
          'x-session-id': sessionId,
          },
          withCredentials: true
      });
      next();
    }
  } catch (e) {
    console.error(e);
  }

  if (to.matched.some(record => record.meta.requiresAuth) && sessionId.length === 0) { //ha nincs bejelentkezve, redirect to login
    next({ path: '/' });
  } else if (to.path === '/' && sessionId.length > 0) { //ha be van jelentkezve, redirect to home
    next({ path: '/home' });
  } else {
    next();
  }
});

export default router;