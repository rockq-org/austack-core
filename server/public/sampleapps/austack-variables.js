var AUSTACK = {
  clinetId: '#clientId#',
  loginUrl: '#loginUrl#',
  callbackUrl: location.href,
  tokenKey: 'token',
  refreshTokenKey: 'refreshToken',

  loginStateName: 'login',
  loginStateConfig: {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: 'LoginCtrl'
  },

  userInfoUrl: 'http://localhost:4000/austack-demo/me'
};