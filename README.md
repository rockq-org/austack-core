# Austack 认证即服务

documentation：https://github.com/arrking/austack-docs/


## Project skeleton
https://github.com/michaelkrone/generator-material-app

## Style Guide
https://github.com/johnpapa/angular-styleguide#style-y190

## Theme and View - Material Design
https://material.angularjs.org/latest/#/
http://design.1sters.com/

## Launch Application
```
git clone git@github.com:arrking/austack.git
npm install
bower install
npm start # start server at http://localhost:9001/
gulp serve # start client at http://localhost:3000/
```

> trouble shooting https://github.com/arrking/austack/issues/2


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

