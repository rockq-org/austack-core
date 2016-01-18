> 已经有几个月没有更新了，2016年依旧有计划进行维护。 感兴趣的朋友联系我微信 hai_liang_wang, 或者 hailiang.hl.wang@gmail.com, 并说明是在github上看到austack的。

# Austack 认证即服务

![image](https://cloud.githubusercontent.com/assets/3538629/9595072/c6767052-5096-11e5-949d-99d9267a1703.png)

什么是认证即服务？

http://blog.austack.com/2015/08/16/austack-nodejs-ionic-2/


## 成功案例
[Auth0](https://www.auth0.com)


## Demo

[video](http://v.youku.com/v_show/id_XMTMyNTAxNDA5Ng==.html?firsttime=0&from=y1.4-2#paction)


## Project skeleton
https://github.com/michaelkrone/generator-material-app

## Style Guide
https://github.com/johnpapa/angular-styleguide#style-y190

## Theme and View - Material Design
https://material.angularjs.org/latest/#/
http://design.1sters.com/

## Launch Application
```
git clone git@github.com:arrking/austack-core.git
cd austack-core
npm install
bower install
touch .env # inject env by https://www.npmjs.com/package/dotenv
npm start # start server at http://localhost:9001/
gulp serve # start client at http://localhost:3000/
```

> trouble shooting https://github.com/arrking/austack-core/issues/2

## Config

### Server
Checkout ```server/config/index.js```

### Client
Checkout ```client/app/config/developement|production|staging.json```

## Build producion

### Server
```
cd austack-core
export NODE_ENV=production
npm start
```

### Client
```
cd austack-core
export NODE_ENV=production
gulp build
```


### Login Accounts for development
```
exports.users = [{
  provider: 'local',
  role: 'admin',
  name: 'dave1',
  password: 'dave1',
  userId: 'dave1',
  active: true
}, {
  provider: 'local',
  role: 'admin',
  name: 'dave2',
  password: 'dave2',
  userId: 'dave2',
  active: true
}, {
  provider: 'local',
  role: 'root',
  name: 'root',
  userId: 'root',
  password: 'root',
  active: true
}];
```

# License
Copyright (c) 2015 contributors.

## Product Owner
[Hai Liang Wang](https://github.com/Samurais)


## Frontend && Backend Developer 
[Lyman Lai](https://github.com/lymanlai)


## User Experience & Frontend Developer
[Neo Nie](https://github.com/nihgwu)

## Graphics Designer
[Wen Zhen Yu](https://github.com/wendy-yu)

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

