### electron  + vite + Vue3 + TypeScript + SerialPort + pinia
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
