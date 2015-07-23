angular.module('starter.controllers', [])
  .controller('LoginCtrl', function ($scope, austack, $state, $window) {
    function doAuth() {
      austack.signin({}, function (profile, idToken, accessToken, state, refreshToken) {
        $window.localStorage.setItem('profile', profile);
        $window.localStorage.setItem('token', idToken);
        $window.localStorage.setItem('refreshToken', refreshToken);
        $state.go('tab.dash');
      }, function (error) {
        console.log("There was an error logging in", error);
      });
    }

    $scope.$on('$ionic.reconnectScope', function () {
      doAuth();
    });

    doAuth();
  })

.controller('DashCtrl', function ($scope) {})

.controller('ChatsCtrl', function ($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function (chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope) {
  $scope.settings = {
    enableFriends: true
  };
});