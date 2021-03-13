const path = require('path')

function resolve (dir) {
	return path.join(__dirname, dir)
}

module.exports = {
	lintOnSave: true,
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('assets', resolve('src/assets'))
			.set('comps', resolve('src/components'))
	},
	devServer: {
		proxy: {
			'/api': { // 这个是你要替换的位置

				/** 比如你要讲http://localhost:8080/index/xxx 替换成 http://10.20.30.120:8080/sth/xxx
				 * 那么就需要将 index 前面的值替换掉, 或者说是替换掉根地址,
				 *你可能发现了index也是需要替换的, 没错, 我会在后续操作中处理.
				 */

				target: 'http://timemeetyou.com:8889/api/private/v1/', //这个是被替换的目标地址

				changeOrigin: true, // 默认是false,如果需要代理需要改成true

				pathRewrite: {
					'^/api': '' //在这里 http://localhost:8080/index/xxx 已经被替换成 http://10.20.30.120:8080/
				}
			}
		}

	}
}
