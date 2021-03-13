<template>
	<div class="login_container">
		<div class="login_box">
			<div class="avatar_box">
				<img src="../assets/images/logo.png" alt="">
			</div>
			<el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="0" class="login_form">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" prefix-icon="iconfont iconuser"></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" type="password" prefix-icon="iconfont iconmima"></el-input>
				</el-form-item>
				<el-form-item class="btns">
					<el-button type="primary" @click="onSubmit">登录</el-button>
					<el-button @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Login',
	data: function () {
		return {
			loginForm: {
				username: 'admin',
				password: '123456'
			},
			rules: {
				username: [
					{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					},
					{
						min: 3,
						max: 5,
						message: '长度在 3 到 5 个字符',
						trigger: 'blur'
					}
				],
				password: [
					{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					},
					{
						min: 6,
						max: 8,
						message: '长度在 6 到 8 个字符',
						trigger: 'blur'
					}
				]
			}
		}
	},
	methods: {
		onSubmit () {
			this.$refs.loginFormRef.validate(async (isValid, args) => {
				if (isValid) {
					const { data: res } = await this.$http.post('login', this.loginForm)
					console.log(res)
					if (res.meta.status !== 200) {
						return this.$message.error(res.meta.msg)
					}
					this.$message.success('恭喜你，登录成功!')
					window.sessionStorage.setItem('token', res.data.token)
					this.$router.push('/home')
				}
			})
		},
		reset () {
			this.$refs.loginFormRef.resetFields()
		}
	}
}
</script>

<style scoped lang="less">
.login_container {
	height: 100%;
	background-color: #2b4b6b;

	.login_box {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 450px;
		height: 300px;
		border-radius: 4px;
		top: 50%;
		background-color: #fff;

		.avatar_box {
			background-color: #fff;
			position: absolute;
			left: 50%;
			-webkit-transform: translate(-50%, -50%);
			transform: translate(-50%, -50%);
			height: 130px;
			width: 130px;
			border: 1px solid #eee;
			border-radius: 50%;
			padding: 10px;
			-webkit-box-shadow: 0 0 10px #ddd;
			box-shadow: 0 0 10px #ddd;

			img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
				background-color: #eee;
			}
		}

		.login_form {
			position: absolute;
			bottom: 0;
			width: 100%;
			padding: 0 20px;
			-webkit-box-sizing: border-box;
			box-sizing: border-box;

			.btns {
				display: flex;
				justify-content: flex-end;
			}
		}
	}
}
</style>
