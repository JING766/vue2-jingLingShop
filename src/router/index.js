import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: () => import('@/components/Welcome.vue'),
        meta: {
          titleTxt: '精灵购物'
        }
      },
      {
        path: 'users',
        component: () => import('@/components/users/Users.vue'),
        meta: {
          titleTxt: '用户列表'
        }
      },
      {
        path: 'roles',
        component: () => import('@/components/power/Roles.vue'),
        meta: {
          titleTxt: '角色列表'
        }

      },
      {
        path: 'rights',
        component: () => import('@/components/power/Rights.vue'),
        meta: {
          titleTxt: '权限列表'
        }
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/components/goods/Goods.vue'),
        meta: {
          titleTxt: '商品列表'
        }
      },
      {
        path: 'goodsAdd',
        name: 'goodsAdd',
        component: () => import('@/components/goods/GoodsAdd.vue'),
        meta: {
          titleTxt: '添加商品'
        }
      },

      {
        path: 'params',
        component: () => import('@/components/goods/Params.vue'),
        meta: {
          titleTxt: '分类参数'
        }
      },
      {
        path: 'categories',
        component: () => import('@/components/goods/Categories.vue'),
        meta: {
          titleTxt: '商品分类'
        }
      },
      {
        path: 'orders',
        component: () => import('@/components/order/Orders.vue'),
        meta: {
          titleTxt: '订单列表'
        }
      },
      {
        path: 'reports',
        component: () => import('@/components/reports/Reports.vue'),
        meta: {
          titleTxt: '数据报表'
        }
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      titleTxt: '精灵购物'
    }
  }
]

const router = new VueRouter({
  routes
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  // login 不需要token
  if (to.path != '/login') {
    let token = sessionStorage.getItem('token');
    if (token) {
      next() //放行
    } else {
      next('/login')  //去login
    }
  } else {
    next() //放行
  }
})


// 全局后置路由守卫

router.afterEach((to, from) => {
  // console.log('to::', to);
  // console.log(to.meta.titleTxt);

  document.title = to.meta.titleTxt
})

export default router
