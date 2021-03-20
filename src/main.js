import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'reset-css/less/reset.less'
import './assets/css/iconfont.css'
import 'assets/css/global.less'

import axios from 'axios'

axios.defaults.baseURL = '/api/'
axios.interceptors.request.use(config => {
	// console.log(config)
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
