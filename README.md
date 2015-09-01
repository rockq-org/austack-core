# Austack 认证即服务

什么是认证即服务？

http://blog.austack.com/2015/08/16/austack-nodejs-ionic-2/


## 成功案例
[Auth0](https://www.auth0.com)


## Online Demo
```
http://console-stg.austack.com/
account: dave1 password: dave1 
```


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
Copyright (c) 2015 Hain, Lyman, Neo, Wendy, contributors.

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

