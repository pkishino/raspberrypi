angular.module('whoIsHere', ['angularMoment', 'ui.bootstrap', 'angularSpinner'])
    .controller('mainController', ['$scope', '$http', '$modal',
        function($scope, $http, $modal) {
            $scope.teammembers = [];
            getTeam();
            $scope.queryMember = function(member) {
                var i = $scope.teammembers.indexOf(member);
                queryList([member]);
                $scope.teammembers[i] = member;
            };
            $scope.queryTeam = function() {
                queryList($scope.teammembers);
            };

            function queryList(members) {
                for (var i = 0; i < members.length; i++) {
                    (function(i) {
                        var member = members[i];
                        $http.get('http://136.225.5.207/members.php', {
                                params: {
                                    cmd: 'seen',
                                    name: member.name
                                }
                            })
                            .then(function(response) {
                                if (response.data) {
                                    var datestring=response.data.trim();
                                    datestring = datestring.replace(/ /g,"T");
                                    datestring+='.000+0200';
                                    var dateObject = new Date(datestring);
                                    members[i].seen = dateObject;
                                }
                            }, function() {
                                console.log('Error');
                            });
                    })(i);
                }
            }

            $scope.getTeam = function() {
                getTeam();
            };

            function getTeam() {
                $scope.teammembers = [];
                $http.get('http://136.225.5.207/members.php', {
                    params: {
                        cmd: 'fetchall'
                    }
                }).
                success(function(data, status, headers, config) {
                    data = data.split(';');
                    data.forEach(function(element, index) {
                        element = element.trim();
                        if (element !== "") {
                            var member = {
                                name: element,
                                seen: 'Never seen'
                            };
                            $scope.teammembers[$scope.teammembers.length] = member;
                        }
                    });

                    $scope.queryTeam();
                }).
                error(function(data, status, headers, config) {
                    console.log('Error');
                });
            }

            $scope.addNewMember = function() {
                var modalInstance = $modal.open({
                    templateUrl: 'newMember.html',
                    controller: 'NewMemberModalCtrl',
                });
                modalInstance.result.then(function() {
                    getTeam();
                });
            };
        }
    ])
    .controller('NewMemberModalCtrl', ['$scope', '$modalInstance', '$http',
        function($scope, $modalInstance, $http) {
            $scope.ok = function() {
                addNewMembers();
            };
            $scope.cancel = function() {
                $modalInstance.dismiss('cancel');
            };
            readBluetooth();

            function readBluetooth() {
                $scope.loading = true;
                $http.get('http://136.225.5.207/inquiry.php').
                success(function(data, status, headers, config) {
                    $scope.loading = false;
                    data = data.trim();
                    var results = data.split('\n');
                    $scope.results = [];
                    for (var i = results.length - 1; i >= 0; i--) {
                        var member = {
                            address: results[i],
                            name: ''
                        };
                        $scope.results[$scope.results.length] = member;
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.loading = false;
                    console.log('Error');
                });
            }

            function addNewMembers() {
                $scope.loading = true;
                for (var i = 0; i < $scope.results.length; i++) {
                    (function(i) {
                        var member = $scope.results[i];
                        if (member.name) {
                            var address = member.address.split(',')[0];
                            $http.get('http://136.225.5.207/members.php', {
                                    params: {
                                        cmd: 'insert',
                                        name: member.name,
                                        address: address
                                    }
                                })
                                .then(function(response) {
                                    console.log(response);
                                }, function() {
                                    console.log('Error');
                                });
                        }
                        if (i == $scope.results.length - 1) {
                            $scope.loading = false;
                            $modalInstance.close();
                        }
                    })(i);
                }
            }
        }
    ]);
