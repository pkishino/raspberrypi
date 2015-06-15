angular.module('cilAssistant').controller('RotatorCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.adding = false;
        getText();
        // gets the template to ng-include for a table row / site
        $scope.getTemplate = function (site) {
            if (site.id === $scope.model.selected.id) return 'edit';
            else return 'display';
        };

        $scope.editSite = function (site) {
            $scope.model.selected = angular.copy(site);
        };

        $scope.saveSite = function (idx) {
            console.log("Saving site");
            if ($scope.adding === true) {
                addSite($scope.model.selected);
            } else {
                commitSite($scope.model.sites[idx], $scope.model.selected);
            }
            $scope.model.sites[idx] = angular.copy($scope.model.selected);
            $scope.adding = false;
            $scope.reset();

        };

        $scope.deleteSite = function (idx) {
            if ($scope.adding === false) {
                deleteSite($scope.model.sites[idx]);
            }
            $scope.adding = false;
            $scope.model.sites.splice(idx, 1);
        };

        $scope.addSite = function () {
            var idx = $scope.model.sites.length;
            $scope.model.sites.push({
                id: idx,
                refresh: false,
                url: ''
            });
            $scope.adding = true;
            $scope.editSite($scope.model.sites[idx]);
        };

        $scope.reset = function () {
            if ($scope.adding === true) {
                $scope.deleteSite($scope.model.selected.id);
            }
            $scope.model.selected = {};
        };

        function getText() {
            $scope.model = {
                selected: {},
                sites: []
            };
            $http.get('http://cil-pi/rotator.php').
            success(function (data, status, headers, config) {
                data = data.split('\n');
                data.forEach(function (element, index) {
                    element = element.trim();
                    if (element !== "") {
                        element = element.split(",");
                        var site = {
                            id: index,
                            refresh: element[0] === 'yes',
                            url: element[1]
                        };
                        $scope.model.sites.push(site);
                    }
                });
            }).
            error(function (data, status, headers, config) {
                console.log('Error');
            });
        }

        function addSite(newsite) {
            $http.get('http://cil-pi/rotator.php', {
                    params: {
                        cmd: 'save',
                        refresh: newsite.refresh,
                        url: newsite.url
                    }
                })
                .then(function (response) {
                    console.log(response);
                }, function () {
                    console.log('Error');
                });
        }

        function commitSite(oldsite, newsite) {
            $http.get('http://cil-pi/rotator.php', {
                    params: {
                        cmd: 'save',
                        refresh: newsite.refresh,
                        url: newsite.url,
                        old_refresh: oldsite.refresh,
                        old_url: oldsite.url
                    }
                })
                .then(function (response) {
                    console.log(response);
                }, function () {
                    console.log('Error');
                });
        }

        function deleteSite(site) {
            $http.get('http://cil-pi/rotator.php', {
                    params: {
                        cmd: 'delete',
                        refresh: site.refresh,
                        url: site.url
                    }
                })
                .then(function (response) {
                    console.log(response);
                }, function () {
                    console.log('Error');
                });
        }
    }
]);
