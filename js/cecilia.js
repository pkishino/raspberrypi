angular.module('cecilia', [])
    .controller('mainController', ['$scope', '$http',
        function ($scope, $http) {
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
                commitItem($scope.model.items[idx], $scope.model.selected);
                $scope.model.items[idx] = angular.copy($scope.model.selected);
                $scope.reset();

            };

            $scope.deleteItem = function (idx) {
                deleteItem($scope.model.items[idx]);
                $scope.model.items.splice(idx, 1);
            };

            $scope.addItem = function () {
                var idx = $scope.model.items.length + 1;
                $scope.model.items.push({
                    id: idx,
                    day: 0,
                    time: '00:00',
                    repeat: 0,
                    text: 'Placeholder'
                });
                $scope.editItem($scope.model.items[idx]);
            };

            $scope.reset = function () {
                $scope.model.selected = {};
            };

            function getText() {
                $scope.model = {
                    selected: {},
                    items: []
                };
                $http.get('http://136.225.5.207/cecilia.php').
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
                                text: element.slice(3, element.length).join(" ")
                            };
                            $scope.model.items[$scope.model.items.length] = item;
                        }
                    });
                }).
                error(function (data, status, headers, config) {
                    console.log('Error');
                });
            }

            function commitItem(olditem, newitem) {
                $http.get('http://136.225.5.207/cecilia.php', {
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
                $http.get('http://136.225.5.207/cecilia.php', {
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
