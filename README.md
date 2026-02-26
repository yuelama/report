用户中心、一键登录、微信登录、短信验证码登录、用户密码登录、邮箱登录、微信手机号登录、苹果apple登录、QQ登录、支付宝登录。  
提供极简教程，用最快的速度入门uni-id和uni-id-pages。用最小配置和操作就能测试运行。  

[更多功能介绍](https://uniapp.dcloud.net.cn/uniCloud/uni-id-pages.html)   

#项目文档结构

##项目概览
- 项目定位与功能边界
- 技术栈与运行平台（uni-app + uniCloud + uni-id）
- 核心能力清单（登录/注册/用户中心/工作报告）

##目录结构
- 根目录关键文件与用途：App.vue、main.js、pages.json、manifest.json、uni.scss
- 页面目录：pages/（主页/示例页）
- 业务模块：uni_modules/（用户中心与组件）
- 云端目录：uniCloud-aliyun/（云函数与数据库）
- 静态资源：static/

##前端应用
- 路由与启动页配置：pages.json
- 页面清单与职责
  - 主页：pages/home/home.vue
  - 示例入口：pages/index/index.vue
  - 用户中心：uni_modules/uni-id-pages/pages/**
- 公共样式与全局配置：uni.scss、App.vue、main.js

##用户中心（uni-id-pages）
- 功能页面结构：登录、注册、找回、用户资料、实名认证
- 组件分层：uni_modules/uni-id-pages/components/**
- 状态管理与用户信息：uni_modules/uni-id-pages/common/store.js
- 登录流程入口：uni_modules/uni-id-pages/pages/login/**

##云端架构
- 云函数与云对象
  - 工作报告云对象：uniCloud-aliyun/cloudfunctions/crud-baogao/
  - 用户中心云对象：uni_modules/uni-id-pages/uniCloud/cloudfunctions/uni-id-co/
- 公共云函数模块：uni_modules/uni-*/uniCloud/cloudfunctions/common/**

##数据库与权限
- 工作报告表：uniCloud-aliyun/database/baogao.schema.json
- 用户中心表：uni_modules/uni-id-pages/uniCloud/database/uni-id-users.schema.json
- 其他系统表：uni-id-log、uni-id-device 等

##配置与环境
- uniCloud 配置：uni_modules/uni-config-center/uniCloud/**
- 平台构建配置：manifest.json、project.config.json
- 依赖与模块信息：package.json、各 uni_modules/*/package.json

##开发流程
- 本地启动与调试步骤
- 登录/鉴权调试方法
- 常用页面与入口路径

##发布与部署
- 小程序/H5/App 打包要点
- 云函数上传与数据库 schema 同步

##规范与约定
- 目录命名与模块边界
- 权限控制与数据访问策略

##常见问题
- 权限校验失败排查
- 登录/绑定手机号异常处理

##变更记录
- 版本号与重要变更摘要

#教程
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/other/doc.png" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/other/doc1.png" />

#手机
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/oneKey.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/wxlogin.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/bind.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/bind1.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/msg.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/msg1.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/oneKey.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/userp.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/profile.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/upAvatar.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/modify.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/reg.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/reset.jpg" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/m/delAcc.jpg" />

#PC
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/pc/pc_wx.png" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/pc/pc_sms.png" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/pc/pc_sms1.png" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/pc/pc_user.png" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/pc/pc_zc.png" />
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/ila-user-id-login/pc/pc_zhmm.png" />


#联系方式
<img alt="" src="https://mp-848725e2-a2cc-430f-939b-e398ae9fad5c.cdn.bspapp.com/other/weixin.jpg" />

