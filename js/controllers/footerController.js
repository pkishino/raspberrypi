angular.module('cilAssistant').controller('CountCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('../bin/counter.php', {
        params: {
            page: 'hits'
        }
    }).
    success(function (data, status, headers, config) {
        $scope.count = data;
    }).
    error(function (data, status, headers, config) {
        console.log('Error');
    });
}])
