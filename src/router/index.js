import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from 'comps/Login'
import Home from '@/views/Home'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		component: Login
	},
	{
		path: '/home',
		component: Home
	}
	/*{
		path: '/about',
		name: 'About',
		component: () => import(/!* webpackChunkName: "about" *!/ '../views/About.vue')
	}*/
]

const router = new VueRouter({
	routes
})

router.beforeEach((to, from, next) => {
	if (to.path === '/login') {
		return next()
	}
	if (!window.sessionStorage.getItem('token')) {
		return next('/login')
	}
	return next()
})

export default router
