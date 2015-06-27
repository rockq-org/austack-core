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
  name: '15801213126',
  password: 'auth4fun',
  userId: 'dave',
  active: true
}, {
  provider: 'local',
  role: 'root',
  name: 'Root',
  userId: 'root',
  password: 'auth4fun',
  active: true
}];
```