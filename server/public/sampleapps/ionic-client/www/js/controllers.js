angular.module('starter.controllers', [])
.controller('DashCtrl', function($scope) {})
.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    }
})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})
.controller('AccountCtrl', function($scope, austack, $window, $location) {

    $scope.settings = {
        enableFriends: true
    };

    $scope.token = $window.localStorage.getItem('token');
    $scope.callApi = function() {
        //do not work yet!
        // Just call the API as you'd do using $http
        $http({
            url: 'http://localhost:3001/secured/ping', //TODO: replace with config
            method: 'GET'
        }).then(function() {
            alert("We got the secured data successfully");
        }, function(response) {
            if (response.status == 0) {
                alert("Please download the API seed so that you can call it.");
            } else {
                alert(response.data);
            }
        });
    }

    $scope.logout = function() {
        austack.signout();
        $window.localStorage.removeItem('profile');
        $window.localStorage.removeItem('token');
        $location.path('/login');
    }
});

angular.module('starter.controllers')
.controller('LoginCtrl', function($scope, austack, $state, $window) {
    console.log('start LoginCtrl');

    function doAuth() {
        console.log('start doing signin');
        austack.signin({}, function(result) {
            // $window.localStorage.setItem('profile', result.profile);
            // $window.localStorage.setItem('refreshToken', result.refreshToken);
            $window.localStorage.setItem('token', result.idToken);
            alert(result.idToken);
            $state.go('tab.dash');
        }, function(error) {
            console.log(error);
        });
    }

    $scope.$on('$ionic.reconnectScope', function() {
        doAuth();
    });

    doAuth();
});