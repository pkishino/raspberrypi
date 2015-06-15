angular.module('cilAssistant').controller('CeciliaCtrl', ['$scope', '$http',
    function ($scope, $http) {
        $scope.adding = false;
        getText();
        // gets the template to ng-include for a table row / item
        $scope.getTemplate = function (item) {
            if (item.id === $scope.model.selected.id) return 'edit';
            else return 'display';
        };

        $scope.editItem = function (item) {
            $scope.model.selected = angular.copy(item);
        };

        $scope.saveItem = function (idx) {
            console.log("Saving item");
            if ($scope.adding === true) {
                addItem($scope.model.selected);
            } else {
                commitItem($scope.model.items[idx], $scope.model.selected);
            }
            $scope.model.items[idx] = angular.copy($scope.model.selected);
            $scope.adding = false;
            $scope.reset();

        };

        $scope.deleteItem = function (idx) {
            if ($scope.adding === false) {
                deleteItem($scope.model.items[idx]);
            }
            $scope.adding = false;
            $scope.model.items.splice(idx, 1);
        };

        $scope.addItem = function () {
            var idx = $scope.model.items.length;
            $scope.model.items.push({
                id: idx,
                day: '',
                time: '',
                repeat: '',
                text: ''
            });
            $scope.adding = true;
            $scope.editItem($scope.model.items[idx]);
        };

        $scope.reset = function () {
            if ($scope.adding === true) {
                $scope.deleteItem($scope.model.selected.id);
            }
            $scope.model.selected = {};
        };

        $scope.playItem = function (item) {
            playItem(item);
        };

        function playItem(item) {
            $http.get('http://cil-pi/cecilia.php', {
                    params: {
                        say: item.text
                    }
                })
                .then(function (response) {
                    console.log(response);
                }, function () {
                    console.log('Error');
                });
        }

        function getText() {
            $scope.model = {
                selected: {},
                items: []
            };
            $http.get('http://cil-pi/cecilia.php').
            success(function (data, status, headers, config) {
                data = data.split('\n');
                data.forEach(function (element, index) {
                    element = element.trim();
                    if (element !== "") {
                        element = element.split(" ");
                        var item = {
                            id: index,
                            day: element[0],
                            time: element[1],
                            repeat: element[2],
                            text: element.slice(3, element.length).join(" ").replace(/^"?(.+?)"?$/, '$1')
                        };
                        $scope.model.items.push(item);
                    }
                });
            }).
            error(function (data, status, headers, config) {
                console.log('Error');
            });
        }

        function addItem(newitem) {
            $http.get('http://cil-pi/cecilia.php', {
                    params: {
                        cmd: 'save',
                        day: newitem.day,
                        time: newitem.time,
                        repeat: newitem.repeat,
                        text: newitem.text
                    }
                })
                .then(function (response) {
                    console.log(response);
                }, function () {
                    console.log('Error');
                });
        }

        function commitItem(olditem, newitem) {
            $http.get('http://cil-pi/cecilia.php', {
                    params: {
                        cmd: 'save',
                        day: newitem.day,
                        time: newitem.time,
                        repeat: newitem.repeat,
                        text: newitem.text,
                        old_day: olditem.day,
                        old_time: olditem.time,
                        old_repeat: olditem.repeat,
                        old_text: olditem.text
                    }
                })
                .then(function (response) {
                    console.log(response);
                }, function () {
                    console.log('Error');
                });
        }

        function deleteItem(item) {
            $http.get('http://cil-pi/cecilia.php', {
                    params: {
                        cmd: 'delete',
                        day: item.day,
                        time: item.time,
                        repeat: item.repeat,
                        text: item.text
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
