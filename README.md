#### 介绍

 - koa2模板、脚手架，数据库用到的mysql,简洁mvc分离、参数验证、winston日志封装、中间件验证封装等；
 - 目前提供一个简单的查询、jwt鉴权验证token、上传解析excel并保存到数据库、简单爬虫功能等；
 - 后续更新优化，有好的建议请提issue，谢谢


#### 目录结构
```
.
|————config ------------------- 配置文件目录
| |————config.js  ------------- 主配置文件，优先获取这里的配置，一般用于生产环境
| |————config_default.js  ----- 所有环境的默认配置项
| |————index.js --------------- 配置逻辑
|————common ------------------- 公共代码
| |————util.js  --------------- 常规工具类函数
| |————mysql.js  -------------- mysql连接初始化
| |————redis.js  -------------- redis连接初始化
| |————log.js ----------------- 日志模块初始化
|————controller --------------- 业务逻辑，控制层目录
| |————example.js  ------------ 验证相关、业务api样例、excel处理、爬虫
|————model  ------------------- 数据模型层
| |————user.js ---------------- 简单模型示例
|————middleware --------------- 自定义中间件目录
|————router ------------------- 路由目录
| |————index.js --------------- 路由加载
|————test --------------------- 单元测试
|————CHANGELOG.md ------------- 项目发布版本历史记录
|————Makefile ----------------- 执行安装，打包等
|————README.md  --------------- 项目描述文件
|————.eslintrc  --------------- eslint静态检查配置文件
|————.eslintignore  ----------- eslint静态检查忽略的文件
|————package-lock.json  ------- npm包版本锁定文件, 确保每个环境安装的版本一致
|————package.json ------------- npm包依赖配置
|————app.js ------------------- 入口文件
```

#### 开发环境
准备： 本地开启mysql，开启端口3306
```
$ npm install          安装依赖
$ node app.js           启动程序
```


#### 自定义配置文件目录启动(生产环境)

```
// 生产环境服务器新建配置文件，如：
/opt/conf/demo/config.js
// 自定义启动：
CONFIG_PATH=/opt/conf/demo/config.js pm2 start app.js

```

#### 单元测试

```
$ make test
```

#### 测试覆盖率

```
$ make test-cov
```

#### 代码规范检查：

> eslint配置可参考 http://www.maplechain.cn/article/15 提到的配置
> 新建 .eslintrc 配置

#### curl测试

 - http://127.0.0.1:3000/api/v1/koa/mobile?name=华为


#### 注意事项

1、登录接口中，获取token，初始化user后去数据库拿秘钥作为post参数即可，如：
```
{
  "password": "e10adc3949ba59abbe56e057f20f883e"
}
```

2、用于上传测试excel存放于 /excel 目录，接口请求时请在headers带上token,body选择form-data, key = src 类型选择file上传方式

#### mysql配置

```
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '123',
      database: 'koa',
```

#### TODO: 
- 初始化默认不连接mysql
