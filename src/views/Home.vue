<template>
	<el-container class="el-container">
		<el-header>
			<div class="logo">
				<img src="../assets/images/logo.png" alt="">
				<span class="logo-title">vue商城</span>
			</div>
			<el-button @click="logout">退出</el-button>
		</el-header>
		<el-container>
			<el-aside :width="collapse ? '64px' : '200px'">
				<div class="toggle-button" @click="toggleMenu">|||</div>
				<el-menu
					unique-opened
					router
					:collapse="collapse"
					:collapse-transition="false"
					:default-active="activePath"
					class="el-menu-vertical-demo"
					@open="handleOpen"
					@close="handleClose"
					background-color="#333744"
					text-color="#fff"
					active-text-color="#409eff">
					<el-submenu :index="'/' + item.path" v-for="item in menuList" :key="item.id">
						<template slot="title">
							<i :class="menuIcon[item.id]"></i>
							<span>{{ item.authName }}</span>
						</template>
						<template v-if="item.children.length">
							<el-menu-item :index="'/' + el.path" @click="saveActivePath('/' + el.path)"
														v-for="el in item.children"
														:key="el.id">
								<template slot="title">
									<i class="el-icon-menu"></i>
									<span>{{ el.authName }}</span>
								</template>
							</el-menu-item>
						</template>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>

export default {
	name: 'Home',
	components: {},
	data () {
		return {
			collapse: false,
			menuList: [],
			menuIcon: {
				'125': 'el-icon-user-solid',
				'103': 'el-icon-s-tools',
				'101': 'el-icon-s-goods',
				'102': 'el-icon-s-order',
				'145': 'el-icon-s-marketing'
			},
			activePath: ''
		}
	},
	created () {
		this.activePath = window.sessionStorage.getItem('activePath')
		this.getMenuList()
	},
	methods: {
		logout () {
			window.sessionStorage.clear()
			this.$router.push('/login')
		},
		handleOpen (key, keyPath) {
			console.log(key, keyPath)
		},
		handleClose (key, keyPath) {
			console.log(key, keyPath)
		},
		async getMenuList () {
			const { data: res } = await this.$http.get('/menus')
			console.log(res)
			if (res.meta.status !== 200) {
				return this.$message.error(res.meta.msg)
			}
			this.menuList = res.data
		},
		toggleMenu () {
			this.collapse = !this.collapse
		},
		saveActivePath (activePath) {
			window.sessionStorage.setItem('activePath', activePath)
			this.activePath = activePath
		}
	}
}
</script>
<style lang="less" scoped>
.el-container {
	height: 100%;

	.el-header {
		display: flex;
		justify-content: space-between;
		background-color: #666;

		.logo {
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 22px;

			img {
				width: 50px;
				height: 50px;
				margin-right: 10px;
			}
		}
	}

	.el-aside {
		background-color: #333744;

		.toggle-button {
			background-color: #999;
			color: #fff;
			line-height: 24px;
			font-size: 10px;
			text-align: center;
			letter-spacing: .2em;
			cursor: pointer;
		}
	}
}

.el-aside .el-menu {
	border-right: none;
}
</style>
