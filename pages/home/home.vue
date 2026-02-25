<template>
	<view class="page">
		<!-- 顶部切换 tabs -->
		<view class="tabs">
			<view
				class="tab-item"
				:class="{ active: activeTab === 'new' }"
				@click="switchTab('new')"
			>
				新建报告
			</view>
			<view
				class="tab-item"
				:class="{ active: activeTab === 'history' }"
				@click="switchTab('history')"
			>
				历史报告
			</view>
		</view>

		<!-- 工作报告编辑区域 -->
		<view v-if="activeTab === 'new'" class="card form-card">
			<view class="form-item">
				<text class="label">标题</text>
				<input
					class="input"
					type="text"
					placeholder="请输入工作报告标题"
					v-model="form.title"
				/>
			</view>

			<view class="form-item">
				<text class="label">报告日期</text>
				<picker
					mode="date"
					:value="form.date"
					@change="onDateChange"
				>
					<view
						class="input picker-input"
						:class="{ placeholder: !form.date }"
					>
						{{ form.date || '请选择报告日期' }}
					</view>
				</picker>
			</view>

			<view class="form-item">
				<text class="label">工作内容</text>
				<textarea
					class="textarea"
					placeholder="请填写今日主要工作内容、进展情况等"
					v-model="form.content"
					auto-height
				/>
			</view>
			<button class="submit-btn" type="primary" @click="submitReport">
				提交报告（仅前端示例）
			</button>
		</view>

		<!-- 历史工作报告列表 -->
		<view v-if="activeTab === 'history'" class="card list-card">
			<view class="card-title">历史报告</view>
			<view v-if="reports.length === 0" class="empty-text">
				暂无报告记录
			</view>
			<scroll-view
				v-else
				class="list-scroll"
				scroll-y="true"
			>
				<view
					v-for="item in reports"
					:key="item.id"
					class="report-item"
					@click="viewDetail(item)"
				>
					<view class="report-main">
						<view class="report-title">{{ item.title }}</view>
						<view class="report-date">{{ item.date }}</view>
					</view>
					<view class="report-status">
						<text
							class="status-tag"
							:class="item.leaderComment ? 'status-done' : 'status-pending'"
						>
							{{ item.leaderComment ? '已批复' : '待批复' }}
						</text>
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 报告详情 + 领导批语（仅在历史报告 tab 下显示） -->
		<view v-if="activeTab === 'history' && selectedReport" class="card detail-card">
			<view class="detail-header">
				<view class="card-title">报告详情</view>
				<text class="detail-close" @click="closeDetail">关闭</text>
			</view>
			<view class="detail-field">
				<text class="detail-label">日期：</text>
				<text class="detail-value">{{ selectedReport.date }}</text>
			</view>
			<view class="detail-field">
				<text class="detail-label">标题：</text>
				<text class="detail-value">{{ selectedReport.title }}</text>
			</view>
			<view class="detail-field detail-content">
				<text class="detail-label">工作内容：</text>
				<text class="detail-value">{{ selectedReport.content }}</text>
			</view>
			<view class="detail-field detail-comment">
				<text class="detail-label">领导批语：</text>
				<text class="detail-value">
					{{ selectedReport.leaderComment || '暂未批复' }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 'new',
				form: {
					date: '',
					title: '',
					content: ''
				},
				// 历史报告列表，从云端查询
				reports: [],
				selectedReport: null
			}
		},
		async onLoad(options) {
			if (options && options.tab === 'history') {
				this.activeTab = 'history'
			}

			// 进入页面时拉取当前用户的历史报告
			await this.fetchReports()
		},
		methods: {
			switchTab(type) {
				this.activeTab = type
			},
			onDateChange(e) {
				this.form.date = e.detail.value
			},
			async submitReport() {
				if (!this.form.date || !this.form.title || !this.form.content) {
					uni.showToast({
						title: '请先完善报告信息',
						icon: 'none'
					})
					return
				}

				// 调用云对象，将报告保存到云数据库
				try {
					const crudBaogao = uniCloud.importObject('crud-baogao')
					const res = await crudBaogao.addReport({
						date: this.form.date,
						title: this.form.title,
						content: this.form.content
					})

					if (res && res.errCode === 0) {
						// 新增成功后重新获取历史列表
						await this.fetchReports()

						uni.showToast({
							title: '提交成功',
							icon: 'success'
						})
					} else {
						uni.showToast({
							title: (res && (res.errMsg || res.message)) || '提交失败',
							icon: 'none'
						})
						return
					}
				} catch (err) {
					console.error(err)
					uni.showToast({
						title: '提交失败',
						icon: 'none'
					})
					return
				}

				// 清空表单
				this.form.date = ''
				this.form.title = ''
				this.form.content = ''
			},
			// 从云端查询当前用户的历史报告
			async fetchReports() {
				try {
					const crudBaogao = uniCloud.importObject('crud-baogao')
					const res = await crudBaogao.listReports()
					if (res && res.errCode === 0) {
						this.reports = res.data || []
					} else {
						this.reports = []
					}
				} catch (err) {
					console.error(err)
					this.reports = []
				}
			},
			viewDetail(item) {
				this.selectedReport = item
			},
			closeDetail() {
				this.selectedReport = null
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		padding: 16rpx;
		background-color: #f5f5f5;
		min-height: 100vh;
		box-sizing: border-box;
	}

	.tabs {
		display: flex;
		flex-direction: row;
		background-color: #ffffff;
		border-radius: 16rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 18rpx 0;
		font-size: 28rpx;
		color: #666666;
	}

	.tab-item.active {
		color: #007aff;
		font-weight: 600;
		background-color: #e8f2ff;
	}

	.card {
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.card-title {
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
		color: #333333;
	}

	.form-item {
		margin-bottom: 20rpx;
	}

	.label {
		font-size: 26rpx;
		color: #666666;
		margin-bottom: 8rpx;
		display: block;
	}

	.input {
		width: 100%;
		border-radius: 8rpx;
		border: 1rpx solid #e0e0e0;
		padding: 8rpx 16rpx;
		font-size: 28rpx;
		line-height: 60rpx;
		height: 60rpx;
		box-sizing: border-box;
		background-color: #fafafa;
	}

	.picker-input {
		display: flex;
		align-items: center;
	}

	.picker-input.placeholder {
		color: #bfbfbf;
	}

	.textarea {
		width: 100%;
		min-height: 120rpx;
		border-radius: 8rpx;
		border: 1rpx solid #e0e0e0;
		padding: 8rpx 16rpx;
		font-size: 28rpx;
		line-height: 40rpx;
		box-sizing: border-box;
		background-color: #fafafa;
	}

	.submit-btn {
		margin-top: 8rpx;
	}

	.list-card {
		max-height: 420rpx;
	}

	.list-scroll {
		max-height: 360rpx;
	}

	.report-item {
		padding: 18rpx 10rpx;
		border-bottom: 1rpx solid #f0f0f0;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	.report-item:last-child {
		border-bottom-width: 0;
	}

	.report-main {
		flex: 1;
		margin-right: 16rpx;
	}

	.report-title {
		font-size: 30rpx;
		color: #333333;
		margin-bottom: 6rpx;
	}

	.report-date {
		font-size: 24rpx;
		color: #999999;
	}

	.report-status {
	}

	.status-tag {
		font-size: 22rpx;
		padding: 4rpx 12rpx;
		border-radius: 20rpx;
	}

	.status-done {
		background-color: #e6f7ff;
		color: #1890ff;
	}

	.status-pending {
		background-color: #fff7e6;
		color: #fa8c16;
	}

	.detail-card {
	}

	.detail-header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12rpx;
	}

	.detail-close {
		font-size: 26rpx;
		color: #1890ff;
	}

	.detail-field {
		margin-bottom: 10rpx;
	}

	.detail-label {
		font-size: 26rpx;
		color: #666666;
	}

	.detail-value {
		font-size: 28rpx;
		color: #333333;
		white-space: pre-wrap;
	}

	.detail-content {
		margin-top: 8rpx;
	}

	.detail-comment {
		margin-top: 8rpx;
	}
</style>