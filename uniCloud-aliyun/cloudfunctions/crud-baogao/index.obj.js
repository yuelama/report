// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const uniID = require('uni-id-common')
const db = uniCloud.database()
const baogaoCollection = db.collection('baogao')

module.exports = {
	// 通用预处理器：在云对象实例上挂载 uni-id 实例
	_before() {
		const clientInfo = this.getClientInfo()
		this.uniID = uniID.createInstance({
			clientInfo
		})
	},

	/**
	 * 新增工作报告
	 * @param {object} payload
	 * @param {string} payload.title 报告标题
	 * @param {string} payload.date 报告日期（如 2026-02-25）
	 * @param {string} payload.content 报告内容
	 */
	async addReport(payload) {
		const { title, date, content } = payload || {}

		if (!title || !date || !content) {
			return {
				errCode: 'PARAM_INVALID',
				errMsg: '标题、日期、内容均为必填项'
			}
		}

		// 从客户端请求中获取 token，并校验解密，得到 uid
		const uniIdToken = this.getUniIdToken()
		const tokenInfo = await this.uniID.checkToken(uniIdToken)

		if (tokenInfo.code) {
			// token 校验失败，直接返回给前端
			return tokenInfo
		}

		const uid = tokenInfo.uid
		const now = Date.now()

		const addRes = await baogaoCollection.add({
			uid,
			title,
			date,
			content,
			leaderComment: '',
			createTime: now
		})

		return {
			errCode: 0,
			errMsg: 'ok',
			id: addRes.id
		}
	},

	/**
	 * 查询当前用户的全部工作报告
	 */
	async listReports() {
		const uniIdToken = this.getUniIdToken()
		const tokenInfo = await this.uniID.checkToken(uniIdToken)

		if (tokenInfo.code) {
			return tokenInfo
		}

		const uid = tokenInfo.uid

		const listRes = await baogaoCollection
			.where({ uid })
			.orderBy('createTime', 'desc')
			.get()

		return {
			errCode: 0,
			errMsg: 'ok',
			data: listRes.data || []
		}
	}
}

