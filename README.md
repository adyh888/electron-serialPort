### electron  + vite + Vue3 + TypeScript + SerialPort + pinia + Socket + ElementPlus
* 前提条件
* node必须16.16.0以上版本。
* 不需要安装python，node-gyp等对应的编码解析工具
* 安装electron对应的版本
* 用的node-serialPort方式导入
* mac打包的时候 sudo npm run build 解决可能会出现打包空间不足的报错问题
#### 1.0.1
* 1.项目架构初始化
* 2.导入环境包
* 3.增加serialPort类
* 4.增加全局的bus事件
#### 1.0.2
* 1.登录和首页的完成封装
* 2.去除打包的TS验证
* 3.修复静态资源打包的BUG
#### 1.0.3
* 1.更换全局事件总线
* 2.增加socket指纹服务
* 3.增加serialPort指纹服务
* 4.请求封装
* 5.登录页的逻辑
#### 1.0.4
* 1.指纹同步的异常判断
* 2.修复字段的错误
#### 1.0.5
* 1.修复同等数据的对比判断
* 2.修复混合指纹异常数据的判断
* 3.增加页面卸载后的socket服务关闭
#### 1.0.6
* 1.封装串口指纹类
* 2.封装串口类的工具
#### 1.0.7
* 1.增加图片上传裁减缩放
* 2.增加同步下载界面的搜索功能
* 3.增加本地数据的分页
* 4.增加组织架构的传参处理
* 5.增加串口指纹录入功能
* 6.修复当选择设备的时候,设备服务器地址为空的判断
* 7.增加人员录入功能
#### 1.0.8
* 1.修复搜索条件的模糊功能
* 2.串口指纹模块的分包数据处理
* 3.增加环境配置页面
* 4.增加生命周期卸载关闭串口解决堵塞的问题
* 5.增加图片转buffer的node环境函数
#### 1.0.9
* 1.封装通用的search组件
* 2.增加用户列表页
* 3.增加用户编辑删除功能
* 4.增加版本号
#### 1.1.0
* 1.增加人员人脸录入功能
* 2.请求设备获取人脸服务地址和异常的请求判断
#### 1.1.1
* 1.修复指纹验证的异常数据的显示问题
* 2.增加异常数据的搜索条件判断
* 3.增加密码回显编辑的逻辑
#### 1.1.2
* 1.修复登录页的异常加载中的状态
* 2.增加进入串口页面的时候，新增页面的数据状态保存
* 3.修改了表格自定义高度
* 4.增加人脸验证的返回错误提醒
* 5.修复批量请求接口的index恢复默认值
#### 1.1.3
* 1.修改table表的操作栏
* 2.人脸上传统一确认提交操作
* 3.显示总条数
* 4.录入指纹的提醒
* 5.更新组织架构的筛选
* 6.批量人脸上传绑定用户
#### 1.1.4
* 1.人脸注册未绑定用户的筛选
* 2.人脸超时时间更换15s超时
* 3.排除serverIP为空的判断
* 4.优化人脸编辑上传人脸图片的报错提醒
#### 1.1.5
* 1.指纹类的整合
* 2.排除null的槽位的判断由原先一次一起写入改成循环写入
* 3.人脸超时时间更换20s超时
#### 1.1.6
* 1.解决文件名称中文乱码问题
* 2.增加人脸接口的报错提醒
* 3.人脸接口的异常更换后的异常数据处理
* 4.添加和更新用户的传参处理
#### 1.1.6-pre-1
* 1.修复搜索重置条件的异常
* 2.增加source的版本号
* 3.变更注册用户的传参
#### 1.1.6-pre-2
* 1.修复编辑和注册用户的成功提示提醒
#### 1.1.6-pre-3
* 1.增加批量人脸上传请求find接口获取用户的uid
* 2.增加工号的搜索查询
#### 1.1.6-pre-4
* 1.已注册的人脸faceId的显示
#### 1.1.6-pre-5
* 1.更改姓名取nickname字段
#### 1.1.6-pre-6
* 1.更换图片文件的名称分割改为下划线分割
* 2.增加未注册,已注册和新注册的人脸列表显示
#### 1.1.6-pre-7
* 1.增加批量上传的状态搜索
* 2.增加未注册的人员信息的tips提示
#### 1.1.6-pre-8
* 1.更换应用名称
* 2.加入配置生效后,自动重启应用
#### 1.1.6-pre-9
* 1.修复超管的组织架构筛选
* 2.增加人脸的本地摄像头硬件调用及录入
#### 1.1.6-pre-10
* 1.增加本地刷卡器录入卡号
* 2.增加用户列表组织架构传参
* 3.修复操作显示的bug
* 4.编辑用户的组织架构跟登录用户关联
#### 1.1.6-pre-11
* 1.修复组织架构回显
