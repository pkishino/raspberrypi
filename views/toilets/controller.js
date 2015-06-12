angular.module('cilAssistant').controller('ToiletsCtrl', ['$scope', '$http', '$window', '$state',
    function ($scope, $http, $window, $state) {
        $scope.toilets = [];
        $scope.show_stats = false;
        if ($state.current.name !== 'toilets') {
            $('#collapseStatistics').collapse('show');
            $scope.show_stats = true;
        }

        $scope.showStats = function () {
            if ($scope.show_stats == false) {
                $scope.show_stats = true;
            } else {
                $scope.show_stats = false;
            }
        };

        $scope.start = function () {
            window.blurred = false;
            interval = setInterval(load, 1000);
        };

        function load() {
            if (window.blurred) {
                return;
            }
            readToilets(1);
            readToilets(2);
        }

        $window.onfocus = function () {
            window.blurred = false;
        };

        $window.onblur = function () {
            window.blurred = true;
            console.log("lost focus");
        };

        function readToilets(id) {
            $http.get('/views/toilets/toiletstate.php', {
                params: {
                    id: id
                }
            }).
            success(function (data, status, headers, config) {
                $scope.toilets[id - 1] = data;
            }).
            error(function (data, status, headers, config) {
                console.log('Error');
                $scope.toilets[id - 1] = '/views/toilets/images/toilet_error.png';
            });
        }
    }
]);
