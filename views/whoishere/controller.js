angular.module('cilAssistant').controller('WhoIsHereCtrl', ['$scope', '$http', '$modal',
        function ($scope, $http, $modal) {
            $scope.teammembers = [];
            getTeam();
            $scope.queryMember = function (member) {
                var i = $scope.teammembers.indexOf(member);
                queryList([member]);
                $scope.teammembers[i] = member;
            };
            $scope.queryTeam = function () {
                queryList($scope.teammembers);
            };
            setInterval($scope.queryTeam, 300000);

            function queryList(members) {
                $scope.loading = true;
                var finished = false;
                for (var i = 0; i < members.length; i++) {
                    (function (i) {
                        var member = members[i];
                        $http.get('http://cil-pi/members.php', {
                                params: {
                                    cmd: 'seen',
                                    name: member.name
                                }
                            })
                            .then(function (response) {
                                if (response.data) {
                                    var datestring = response.data.trim();
                                    if (datestring == 'never') {
                                        members[i].seen = new Date(0);
                                    } else {
                                        datestring = datestring.replace(/ /g, "T");
                                        datestring += '.000+0200';
                                        var dateObject = new Date(datestring);
                                        members[i].seen = dateObject;
                                    }
                                }
                                if (i == members.length - 1) {
                                    finished = true;
                                }
                                if (finished) {
                                    $scope.loading = false;
                                }
                            }, function () {
                                console.log('Error');
                                $scope.loading = false;
                            });
                    })(i);
                }
            }

            $scope.getTeam = function () {
                getTeam();
            };

            function getTeam() {
                $scope.loading = true;
                $scope.teammembers = [];
                $http.get('http://cil-pi/members.php', {
                    params: {
                        cmd: 'fetchall'
                    }
                }).
                success(function (data, status, headers, config) {
                    data = data.split(';');
                    data.forEach(function (element, index) {
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
                error(function (data, status, headers, config) {
                    console.log('Error');
                    $scope.loading = false;
                });
            }

            $scope.addNewMember = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'newMember.html',
                    controller: 'NewMemberModalCtrl',
                });
                modalInstance.result.then(function () {
                    getTeam();
                });
            };
            $scope.removeMember = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'removeMember.html',
                    controller: 'RemoveMemberModalCtrl',
                    resolve: {
                        members: function () {
                            return $scope.teammembers;
                        }
                    }
                });
                modalInstance.result.then(function () {
                    getTeam();
                });
            };

            $scope.getDiff = function (member) {
                var diff = moment(member.seen).fromNow(true);
                if (diff.indexOf('year') > -1 || diff.indexOf('month') > -1) {
                    return 'btn-default';
                } else if (diff.indexOf("day") > -1) {
                    return 'btn-danger';
                } else if (diff.indexOf('hour') > -1) {
                    return 'btn-warning';
                } else if (diff.indexOf('minutes') > -1) {
                    var time = diff.split(' ')[0].valueOf();
                    if (time > 10) {
                        return 'btn-info';
                    }
                }
                return 'btn-success';
            };
        }
    ])
    .controller('NewMemberModalCtrl', ['$scope', '$modalInstance', '$http',
        function ($scope, $modalInstance, $http) {
            $scope.ok = function () {
                addNewMembers();
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.rescan = function () {
                readBluetooth();
            };
            readBluetooth();

            function readBluetooth() {
                $scope.error = false;
                $scope.nodevice = false;
                $scope.loading = true;
                $scope.results = [];
                $http.get('http://cil-pi/inquiry.php').
                success(function (data, status, headers, config) {
                    $scope.loading = false;
                    data = data.trim();
                    if (data.length > 0) {
                        var results = data.split('\n');
                        for (var i = results.length - 1; i >= 0; i--) {
                            var member = {
                                address: results[i],
                                name: ''
                            };
                            $scope.results[$scope.results.length] = member;
                        }
                    } else {
                        $scope.nodevice = true;
                    }
                }).
                error(function (data, status, headers, config) {
                    console.log('Error' + data);
                    $scope.error = true;
                    $scope.loading = false;
                });
            }

            function addNewMembers() {
                $scope.loading = true;
                var finished = false;
                if ($scope.results.length === 0) {
                    $scope.loading = false;
                    $modalInstance.close();
                }
                for (var i = 0; i < $scope.results.length; i++) {
                    (function (i) {
                        var member = $scope.results[i];
                        if (member.name) {
                            var address = member.address.split(',')[0];
                            $http.get('http://cil-pi/members.php', {
                                    params: {
                                        cmd: 'insert',
                                        name: member.name,
                                        address: address
                                    }
                                })
                                .then(function (response) {
                                    console.log(response);
                                }, function () {
                                    console.log('Error');
                                });
                        }
                        if (i == $scope.results.length - 1) {
                            finished = true;
                        }
                        if (finished) {
                            $scope.loading = false;
                            $modalInstance.close();
                        }
                    })(i);
                }
            }
        }
    ]).controller('RemoveMemberModalCtrl', ['$scope', '$modalInstance', '$http', 'members',
        function ($scope, $modalInstance, $http, members) {
            $scope.teammembers = members;
            $scope.removeMember = function (member) {
                removeMember(member);
            };
            $scope.exit = function () {
                $modalInstance.close();
            };

            function removeMember(member) {
                $http.get('http://cil-pi/members.php', {
                    params: {
                        cmd: 'remove',
                        name: member.name
                    }
                }).
                success(function (data, status, headers, config) {
                    var index = $scope.teammembers.indexOf(member);
                    if (index > -1) {
                        $scope.teammembers.splice(index, 1);
                    }
                }).
                error(function (data, status, headers, config) {
                    alert('Error,Could not delete member');
                    console.log('Error');
                });
            }
        }
    ]);
