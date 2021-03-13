import Vue from 'vue'
import {
	Button,
	Form,
	FormItem,
	Input,
	Icon,
	Message,
	Header,
	Main,
	Aside,
	Container,
	Menu,
	MenuItem,
	Submenu,
	MenuItemGroup
} from 'element-ui'

Vue.use(Button)
	.use(Form)
	.use(FormItem)
	.use(Input)
	.use(Icon)
	.use(Header)
	.use(Main)
	.use(Aside)
	.use(Container)
	.use(Menu)
	.use(MenuItem)
	.use(MenuItemGroup)
	.use(Submenu)
Vue.prototype.$message = Message
