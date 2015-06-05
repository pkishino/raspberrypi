angular.module('cilAssistant').controller('ToiletsCtrl', ['$scope', '$http', '$window',
    function ($scope, $http, $window) {
        $scope.toilets = [];

        $scope.start = function () {
            window.blurred = false;
            interval = setInterval(load, 1000);
        }

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
            $http.get('http://cil-web/toiletstate.php', {
                    params: {
                        id: id
                    }
                })
                .then(function (response) {
                    if (response.data) {
                        $scope.toilets[id - 1] = response.data;
                    }
                }, function () {
                    console.log('Error');
                    $scope.loading = false;
                });
        }
    }
]);
