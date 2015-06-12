angular.module('cilAssistant').controller('CountCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('/views/counter/counter.php', {
        params: {
            page: 'hits'
        }
    }).
    success(function (data, status, headers, config) {
        if (data.length < 100) {
            $scope.count = data;
        }
    }).
    error(function (data, status, headers, config) {
        console.log('Error');
    });
}])
