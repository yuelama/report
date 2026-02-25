<!-- 用户资料页 -->
<template>
	<view class="uni-content">
		<!-- 头像和昵称卡片 -->
		<view class="profile-card">
			<view class="avatar">
				<uni-id-pages-avatar width="200rpx" height="200rpx"></uni-id-pages-avatar>
			</view>
			<view class="profile-main">
				<text class="profile-name">{{ userInfo.nickname || '未设置昵称' }}</text>
				<text class="profile-id" v-if="userInfo._id">ID：{{ userInfo._id }}</text>
			</view>
		</view>

		<!-- 基本信息 -->
		<uni-list>
			<uni-list-item class="item" @click="setNickname('')" title="昵称" :rightText="userInfo.nickname||'未设置'" link>
			</uni-list-item>
			<uni-list-item class="item" @click="setGender" title="性别" :rightText="userInfo.gender || '未设置'" link>
			</uni-list-item>
			<uni-list-item class="item" @click="bindMobile" title="手机号码" :rightText="userInfo.mobile||'未绑定'" link>
			</uni-list-item>
			<uni-list-item class="item" @click="setWechat('')" title="微信" :rightText="userInfo.wechat || '未设置'" link>
			</uni-list-item>
			<uni-list-item v-if="userInfo.email" class="item" title="电子邮箱" :rightText="userInfo.email">
			</uni-list-item>
			<!-- #ifdef APP -->
      <!-- 如未开通实人认证服务，可以将实名认证入口注释 -->
			<uni-list-item class="item" @click="realNameVerify" title="实名认证" :rightText="realNameStatus !== 2 ? '未认证': '已认证'" link>
			</uni-list-item>
			<!-- #endif -->
			<uni-list-item v-if="hasPwd" class="item" @click="changePassword" title="修改密码" link>
			</uni-list-item>
		</uni-list>

		<!-- 工作报告入口，与主页功能联动 -->
	<!-- 	<uni-list class="mt10">
			<uni-list-item
				class="item"
				title="我的工作报告"
				note="查看历史工作报告及批语"
				link
				@click="toReportHistory"
			></uni-list-item>
		</uni-list> -->
		<!-- #ifndef MP -->
		<uni-list class="mt10">
			<uni-list-item @click="deactivate" title="注销账号" link="navigateTo"></uni-list-item>
		</uni-list>
		<!-- #endif -->
		<uni-popup ref="dialog" type="dialog">
			<uni-popup-dialog
				mode="input"
				:value="userInfo.nickname"
				@confirm="setNickname"
				:inputType="setNicknameIng ? 'nickname' : 'text'"
				title="设置昵称"
				placeholder="请输入要设置的昵称"
			>
			</uni-popup-dialog>
		</uni-popup>

		<uni-popup ref="wechatDialog" type="dialog">
			<uni-popup-dialog
				mode="input"
				:value="tempWechat"
				@confirm="setWechat"
				title="设置微信"
				placeholder="请输入微信号"
			>
			</uni-popup-dialog>
		</uni-popup>
		<uni-id-pages-bind-mobile ref="bind-mobile-by-sms" @success="bindMobileSuccess"></uni-id-pages-bind-mobile>

		<button
			v-if="userInfo._id"
			class="logout-btn"
			@click="logout"
		>
			退出登录
		</button>
	</view>
</template>
<script>
const uniIdCo = uniCloud.importObject("uni-id-co")
  import {
    store,
    mutations
  } from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
    computed: {
      userInfo() {
        return store.userInfo
      },
	  realNameStatus () {
		  if (!this.userInfo.realNameAuth) {
			  return 0
		  }

		  return this.userInfo.realNameAuth.authStatus
	  }
    },
		data() {
			return {
				univerifyStyle: {
					authButton: {
						"title": "本机号码一键绑定", // 授权按钮文案
					},
					otherLoginButton: {
						"title": "其他号码绑定",
					}
				},
				// userInfo: {
				// 	mobile:'',
				// 	nickname:''
				// },
				hasPwd: false,
				showLoginManage: false ,//通过页面传参隐藏登录&退出登录按钮
				setNicknameIng:false,
				tempWechat: ''
			}
		},
		async onShow() {
			this.univerifyStyle.authButton.title = "本机号码一键绑定"
			this.univerifyStyle.otherLoginButton.title = "其他号码绑定"
		},
		async onLoad(e) {
			if (e.showLoginManage) {
				this.showLoginManage = true //通过页面传参隐藏登录&退出登录按钮
			}
			//判断当前用户是否有密码，否则就不显示密码修改功能
			let res = await uniIdCo.getAccountInfo()
			this.hasPwd = res.isPasswordSet
		},
		methods: {
			login() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd',
					complete: (e) => {
						// console.log(e);
					}
				})
			},
			logout() {
				mutations.logout()
			},
			bindMobileSuccess() {
				mutations.updateUserInfo()
			},
			changePassword() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/change_pwd/change_pwd',
					complete: (e) => {
						// console.log(e);
					}
				})
			},
			bindMobile() {
				// #ifdef APP-PLUS
				uni.preLogin({
					provider: 'univerify',
					success: this.univerify(), //预登录成功
					fail: (res) => { // 预登录失败
						// 不显示一键登录选项（或置灰）
						console.log(res)
						this.bindMobileBySmsCode()
					}
				})
				// #endif

				// #ifdef MP-WEIXIN
				this.$refs['bind-mobile-by-sms'].open()
				// #endif

				// #ifdef H5
				//...去用验证码绑定
				this.bindMobileBySmsCode()
				// #endif
			},
			univerify() {
				uni.login({
					"provider": 'univerify',
					"univerifyStyle": this.univerifyStyle,
					success: async e => {
						uniIdCo.bindMobileByUniverify(e.authResult).then(res => {
							mutations.updateUserInfo()
						}).catch(e => {
							console.log(e);
						}).finally(e => {
							// console.log(e);
							uni.closeAuthView()
						})
					},
					fail: (err) => {
						console.log(err);
						if (err.code == '30002' || err.code == '30001') {
							this.bindMobileBySmsCode()
						}
					}
				})
			},
			bindMobileBySmsCode() {
				uni.navigateTo({
					url: './bind-mobile/bind-mobile'
				})
			},
			setNickname(nickname) {
				if (nickname) {
					mutations.updateUserInfo({
						nickname
					})
					this.setNicknameIng = false
					this.$refs.dialog.close()
				} else {
					this.$refs.dialog.open()
				}
			},
			setGender() {
				const list = ['男', '女', '保密']
				uni.showActionSheet({
					itemList: list,
					success: (res) => {
						const gender = list[res.tapIndex]
						mutations.updateUserInfo({
							gender
						})
					}
				})
			},
			setWechat(wechat) {
				if (wechat) {
					mutations.updateUserInfo({
						wechat
					})
					this.tempWechat = wechat
					this.$refs.wechatDialog.close()
				} else {
					this.tempWechat = this.userInfo.wechat || ''
					this.$refs.wechatDialog.open()
				}
			},
			deactivate(){
				uni.navigateTo({
					url:"/uni_modules/uni-id-pages/pages/userinfo/deactivate/deactivate"
				})
			},
			toReportHistory() {
				uni.switchTab({
					url: '/pages/home/home',
					success: () => {
						// 为了与首页联动，可通过事件总线或全局状态再次控制 tab，但这里仅做简单跳转
					}
				})
			},
			async bindThirdAccount(provider) {
				const uniIdCo = uniCloud.importObject("uni-id-co")
				const bindField = {
					weixin: 'wx_openid',
					alipay: 'ali_openid',
					apple: 'apple_openid',
					qq: 'qq_openid'
				}[provider.toLowerCase()]

				if (this.userInfo[bindField]) {
					await uniIdCo['unbind' + provider]()
					await mutations.updateUserInfo()
				} else {
					uni.login({
						provider: provider.toLowerCase(),
						onlyAuthorize: true,
						success: async e => {
							const res = await uniIdCo['bind' + provider]({
								code: e.code
							})
							if (res.errCode) {
								uni.showToast({
									title: res.errMsg || '绑定失败',
									duration: 3000
								})
							}
							await mutations.updateUserInfo()
						},
						fail: async (err) => {
							console.log(err);
							uni.hideLoading()
						}
					})
				}
			},
			realNameVerify () {
				uni.navigateTo({
					url: "/uni_modules/uni-id-pages/pages/userinfo/realname-verify/realname-verify"
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	@import "@/uni_modules/uni-id-pages/common/login-page.scss";

	.uni-content {
		padding: 0;
	}

	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	@media screen and (min-width: 690px) {
		.uni-content {
			padding: 0;
			max-width: 690px;
			margin-left: calc(50% - 345px);
			border: none;
			max-height: none;
			border-radius: 0;
			box-shadow: none;
		}
	}

	/* #endif */
	.profile-card {
		flex-direction: row;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #ffffff;
		border-radius: 20rpx;
		margin: 20rpx 16rpx 10rpx;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
	}

	.avatar {
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}

	.profile-main {
		flex: 1;
	}

	.profile-name {
		font-size: 32rpx;
		color: #333333;
		font-weight: 600;
	}

	.profile-id {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #999999;
	}

	.item {
		flex: 1;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.logout-btn {
		margin: 40px 10%;
		border-radius: 999rpx;
		background-color: #ff4d4f;
		color: #ffffff;
		width: 80%;
		text-align: center;
	}

	.mt10 {
		margin-top: 10px;
	}
</style>
