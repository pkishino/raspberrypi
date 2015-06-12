angular.module('cilAssistant').controller('BreakfastCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.week = Date.prototype.getWeekNumber();
        var diff = 4 - new Date().getDay();
        if (diff < 0) {
            diff += 7;
        }
        $scope.days_left = diff;
        $scope.team = [];
        getTeam();

        function getTeam() {
            $scope.team = [];
            $http.get('/views/breakfast/breakfast.php').
            success(function (data, status, headers, config) {
                data = data.split('\n');
                data.forEach(function (element, index) {
                    element = element.trim();
                    if (element !== "") {
                        element = element.split(',');
                        var member = {
                            name: element[1],
                            week: element[0]
                        };
                        if (member.week == $scope.week) {
                            $scope.bringer = member.name;
                        }
                        $scope.team[$scope.team.length] = member;
                    }
                });
            }).
            error(function (data, status, headers, config) {
                console.log('Error');
            });
        }
    }
]);
