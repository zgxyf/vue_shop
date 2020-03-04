import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
import Login from '../components/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import( '@/components/Home.vue'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@/components/Welcome.vue'),
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('@/components/user/Users.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫

router.beforeEach((to, from, next) => {
  //to and from are Route Object,next() must be called to resolve the hook}
  // to 将要访问的路径  from 从哪里来  next() 放行  next('/login') 强制跳转
  if(to.path === '/login') {
    return next();
  }
  // 先获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) {
    return next('/login')
  }
  next();
})

export default router
