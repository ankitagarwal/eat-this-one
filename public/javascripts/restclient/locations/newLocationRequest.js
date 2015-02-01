angular.module('eat-this-one')
    .factory('newLocationRequest', ['redirecter', '$http', 'eatConfig', 'sessionManager', 'appStatus', 'notifier', 'newLogRequest', function(redirecter, $http, eatConfig, sessionManager, appStatus, notifier, newLogRequest) {

    return function($scope, name, locationCallback, errorCallback) {

        $http({
            method : 'POST',
            url : eatConfig.backendUrl + '/locations',
            data : {
                name : name,
                token : sessionManager.getToken()
            }

        }).success(locationCallback).error(errorCallback);
    };
}]);
