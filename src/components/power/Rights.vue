<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="mt20">
			<el-row>
				<el-table
					:data="rightsList"
					border
					style="width: 100%">
					<el-table-column type="index"></el-table-column>
					<el-table-column prop="authName" label="权限名称"></el-table-column>
					<el-table-column prop="path" label="路径"></el-table-column>
					<el-table-column label="权限等级" width="200">
						<template slot-scope="el">
							<el-tag v-if="el.row.level===`0`">一级</el-tag>
							<el-tag type="success" v-else-if="el.row.level===`1`">二级</el-tag>
							<el-tag type="warning" v-else>三级</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</el-row>
		</el-card>
	</div>
</template>

<script>
export default {
	name: 'Rights',
	data () {
		return {
			rightsList: [],
		}
	},
	created () {
		this.getRightsList()
	},
	methods: {
		async getRightsList () {
			const { data: res } = await this.$http.get('rights/list')
			if (res.meta.status !== 200) {
				return this.$message.error(res.meta.msg)
			}
			this.rightsList = res.data
		}
	}
}
</script>

<style scoped lang="less">

</style>
