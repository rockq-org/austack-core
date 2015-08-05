var AUSTACK = {
    clinetId: '7e37446147bc5224fa420725',
    loginUrl: 'http://localhost:9001/tenant/login?clientId=7e37446147bc5224fa420725',
    callbackUrl: location.href,
    tokenKey: 'token',
    refreshTokenKey: 'refreshToken',

    loginStateName: 'login',
    loginStateConfig: {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    },

    userInfoUrl: 'http://localhost:4000/me'
};