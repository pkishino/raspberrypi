angular.module('breakfast', [])
    .controller('mainController', ['$scope', '$http',
        function($scope, $http, $modal) {
            $scope.week=Date.prototype.getWeekNumber();
            $scope.team = [];
            getTeam();
            function getTeam() {
                $scope.team = [];
                $http.get('../breakfast.php').
                success(function(data, status, headers, config) {
                    data = data.split('\n');
                    data.forEach(function(element, index) {
                        element = element.trim();
                        if (element !== "") {
                            element = element.split(',');
                            var member = {
                                name: element[1],
                                week: element[0]
                            };
                            $scope.team[$scope.team.length] = member;
                        }
                    });
                }).
                error(function(data, status, headers, config) {
                    console.log('Error');
                });
            }
        }
    ]);