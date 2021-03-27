<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="mt20">
			<el-row>
				<el-table
					:data="rolesList"
					border
					style="width: 100%">
					<el-table-column type="expand">
						<template slot-scope="el">
							<el-row v-for="(item1, index1) in el.row.children"
											:class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'v-center']"
											:key="item1.id">
								<el-col :span="5">
									<el-tag closable @close="delRightById(el.row, item1.id)">{{ item1.authName }}</el-tag>
									<i class="el-icon-caret-right"></i>
								</el-col>
								<el-col :span="18">
									<el-row v-for="(item2, index2) in item1.children"
													:class="[index2 !== item1.children.length - 1 ? 'bdbottom' : '', 'v-center']"
													:key="item2.id">
										<el-col :span="5">
											<el-tag type="success" closable @close="delRightById(el.row, item2.id)">{{
													item2.authName
												}}
											</el-tag>
											<i class="el-icon-caret-right"></i>
										</el-col>
										<el-col :span="18">
											<el-tag v-for="(item3) in item2.children" closable @close="delRightById(el.row, item3.id)"
															:key="item3.id" type="warning">{{ item3.authName }}
											</el-tag>
										</el-col>
									</el-row>
								</el-col>
							</el-row>
						</template>
					</el-table-column>
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="roleName" label="角色名称"></el-table-column>
					<el-table-column prop="roleDesc" label="角色描述"></el-table-column>
					<el-table-column label="权限等级" width="300">
						<template slot-scope="el">
							<el-button size="mini" type="primary" icon="el-icon-edit" @click="editUser(el.row.id)">编辑</el-button>
							<el-button size="mini" type="danger" icon="el-icon-delete" @click="delUser(el.row.id)">删除</el-button>
							<el-button size="mini" type="warning" icon="el-icon-setting" @click="setRight(el.row)">分配权限</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</el-card>

		<!--分配权限弹窗-->
		<el-dialog title="分配权限" :visible.sync="setRightDialogVisible">
			<el-tree
				:data="rightsList"
				:props="treeProps"
				:default-checked-keys="checkedNode"
				ref="rightsTree"
				node-key="id"
				default-expand-all
				show-checkbox>
			</el-tree>
			<div slot="footer" class="dialog-footer">
				<el-button @click="setRightDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="submitSetRight">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
export default {
	name: 'Rights',
	data () {
		return {
			rolesList: [],
			rightsList: [],
			setRightDialogVisible: false,
			treeProps: {
				children: 'children',
				label: 'authName'
			},
			checkedNode: [],
			roleId: ''
		}
	},
	created () {
		this.getRolesList()
	},
	methods: {
		async getRolesList () {
			const { data: res } = await this.$http.get('roles')
			if (res.meta.status !== 200) {
				return this.$message.error(res.meta.msg)
			}
			this.rolesList = res.data
		},
		async delRightById (row, id) {
			const msg = await this.$confirm('确定删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).catch(e => e)

			if (msg === 'confirm') {
				const { data: res } = await this.$http.delete(`roles/${row.id}/rights/${id}`)
				if (res.meta.status !== 200) {
					return this.$message.error(res.meta.msg)
				}
				row.children = res.data
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
		},
		async setRight (row) {
			const { data: res } = await this.$http.get('rights/tree')
			if (res.meta.status !== 200) {
				return this.$message.error(res.meta.msg)
			}
			this.roleId = row.id
			this.checkedNode = []
			this.getCheckedNode(row, this.checkedNode)
			this.rightsList = res.data
			this.setRightDialogVisible = true
		},
		getCheckedNode (node, arr) {
			if (!node.children) {
				arr.push(node.id)
			} else {
				node.children.forEach(el => this.getCheckedNode(el, arr))
			}
		},
		async submitSetRight () {
			const rids = [
				...this.$refs.rightsTree.getCheckedKeys(),
				...this.$refs.rightsTree.getHalfCheckedKeys()
			].toString()

			const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids })
			if (res.meta.status !== 200) {
				return this.$message.error(res.meta.msg)
			}
			this.getRolesList()
			this.setRightDialogVisible = false
		}
	}
}
</script>

<style scoped lang="less">
.el-tag {
	margin: 7px;
}

.v-center {
	display: flex;
	align-items: center;
}
</style>
