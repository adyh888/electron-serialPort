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

