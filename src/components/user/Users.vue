<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<el-card class="mb20">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input v-model="params.query" clearable @clear="getUsers"
										placeholder="请输入内容">
						<el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addUserDialogVisible = true">添加</el-button>
				</el-col>
			</el-row>
		</el-card>

		<el-table
			:data="tableData"
			border
			style="width: 100%">
			<el-table-column type="index"></el-table-column>
			<el-table-column prop="username" label="姓名"></el-table-column>
			<el-table-column prop="email" label="邮箱"></el-table-column>
			<el-table-column prop="mobile" label="电话"></el-table-column>
			<el-table-column prop="role_name" label="角色"></el-table-column>
			<el-table-column label="状态">
				<template slot-scope="el">
					<el-switch v-model="el.row.mg_state" @change="changeStatus(el.row)"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="200">
				<template slot-scope="el">
					<el-button size="mini" type="primary" icon="el-icon-edit" @click="editUser(el.row.id)"></el-button>
					<el-button size="mini" type="danger" icon="el-icon-delete" @click="delUser(el.row.id)"></el-button>
					<el-tooltip effect="dark" content="设置" placement="top" :enterable="false">
						<el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="params.pagenum"
			:page-sizes="[1, 2, 3, 5]"
			:page-size="params.pagesize"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total">
		</el-pagination>
		<!--新增用户弹窗-->
		<el-dialog title="添加用户" :visible.sync="addUserDialogVisible" @close="closeUser">
			<el-form :model="userForm" :rules="userRules" ref="userForm">
				<el-form-item label="姓名" label-width="80px" prop="username">
					<el-input v-model="userForm.username" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" label-width="80px" prop="password">
					<el-input v-model="userForm.password" autocomplete="off" type="password"></el-input>
				</el-form-item>
				<el-form-item label="手机" label-width="80px" prop="mobile">
					<el-input v-model="userForm.mobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" label-width="80px" prop="email">
					<el-input v-model="userForm.email" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addUserDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addUser">确 定</el-button>
			</div>
		</el-dialog>
		<!--修改用户弹窗-->
		<el-dialog title="修改用户" :visible.sync="editUserDialogVisible" @close="closeUser2">
			<el-form :model="editUserForm" :rules="userRules" ref="editUserForm">
				<el-form-item label="姓名" label-width="80px">
					<el-input v-model="editUserForm.username" autocomplete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="手机" label-width="80px" prop="mobile">
					<el-input v-model="editUserForm.mobile" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" label-width="80px" prop="email">
					<el-input v-model="editUserForm.email" autocomplete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editUserDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitEditUser">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'Users',
	data () {
		const mobileRule = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入电话'))
			} else {
				if (/^1[3|4|5|7|8][0-9]{9}$/.test(value)) {
					callback()
				} else {
					callback(new Error('请输入正确的电话'))
				}
			}
		}
		const emailRule = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入邮箱'))
			} else {
				if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value)) {
					callback()
				} else {
					callback(new Error('请输入正确的邮箱'))
				}
			}
		}

		return {
			tableData: [],
			params: {
				query: '',
				pagenum: 1,
				pagesize: 5
			},
			total: 0,
			addUserDialogVisible: false,
			editUserDialogVisible: false,
			userForm: {},
			editUserForm: {},
			userRules: {
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
				],
				mobile: [
					{
						required: true,
						validator: mobileRule,
						trigger: 'blur'
					}
				],
				email: [
					{
						required: true,
						validator: emailRule,
						trigger: 'blur'
					}
				]
			}
		}
	},
	created () {
		this.getUsers()
	},
	methods: {
		async getUsers () {
			const { data: res } = await this.$http.get('users', {
				params: this.params
			})
			if (res.meta.status !== 200) {
				return this.$message.error(res.meta.msg)
			}
			this.tableData = res.data.users
			this.total = res.data.total
		},
		handleSizeChange (pagesize) {
			this.params.pagenum = 1
			this.params.pagesize = pagesize
			this.getUsers()
		},
		handleCurrentChange (pagenum) {
			this.params.pagenum = pagenum
			this.getUsers()
		},
		async changeStatus (userInfo) {
			const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
			if (res.meta.status !== 200) {
				userInfo.mg_state = !userInfo.mg_state
				return this.$message.error(res.meta.msg)
			}
			this.$message.success('修改成功')
		},
		addUser () {
			this.$refs.userForm.validate(async (isValid, args) => {
				if (isValid) {
					const { data: res } = await this.$http.post('users', this.userForm)
					if (res.meta.status !== 201) {
						return this.$message.error(res.meta.msg)
					}
					this.addUserDialogVisible = true
					this.getUsers()
				}
			})
		},
		closeUser () {
			this.$refs.userForm.resetFields()
		},
		async editUser (id) {
			const { data: res } = await this.$http.get(`users/${id}`)
			if (res.meta.status !== 200) {
				return this.$message.error(res.meta.msg)
			}
			this.editUserForm = res.data
			this.editUserDialogVisible = true
		},
		submitEditUser () {
			this.$refs.editUserForm.validate(async (isValid, args) => {
				if (isValid) {
					const { id, email, mobile } = this.editUserForm
					const { data: res } = await this.$http.put(`users/${id}`, {
						email,
						mobile
					})
					if (res.meta.status !== 200) {
						return this.$message.error(res.meta.msg)
					}
					this.editUserDialogVisible = false
					this.getUsers()
				}
			})
		},
		closeUser2 () {
			this.$refs.editUserForm.resetFields()
		},
		async delUser (id) {
			const msg = await this.$confirm('确定删除用户, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(e => e)

			if (msg === 'confirm') {
				const { data: res } = await this.$http.delete(`users/${id}`)
				if (res.meta.status !== 200) {
					return this.$message.error(res.meta.msg)
				}
				this.getUsers()
				return this.$message({
					type: 'success',
					message: '删除成功!'
				})
			} else {
				return this.$message({
					type: 'info',
					message: '已取消删除'
				})
			}
		}
	}
}
</script>

<style scoped>

</style>
