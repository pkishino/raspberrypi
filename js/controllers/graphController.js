angular.module('cilAssistant').controller('GraphsCtrl', ['$rootScope', '$scope', '$state', '$http',
    function ($rootScope, $scope, $state, $http) {
        $scope.error = false;
        $scope.tabs = [{
            heading: getDate(),
            route: "toilets.stats_day",
            active: false
        }, {
            heading: "Availability",
            route: "toilets.stats_combined",
            active: false
        }, {
            heading: "Daily totals",
            route: "toilets.stats_amount",
            active: false
        }];

        $scope.go = function (route) {
            if ($scope.show_stats === true) {
                $state.go(route);
            }
        };

        $scope.active = function (route) {
            return $state.is(route);
        };

        $scope.$on("$stateChangeSuccess", function () {
            $scope.tabs.forEach(function (tab) {
                tab.active = $scope.active(tab.route);
            });
        });
        $scope.$on('$viewContentLoaded',
            function (event, viewConfig) {
                console.log("View Load: the view is loaded, and DOM rendered!");
                switch ($state.current.name) {
                    case "toilets.stats_day":
                        $scope.day_stat();
                        break;
                    case "toilets.stats_amount":
                        $scope.amount();
                        break;
                    case "toilets.stats_combined":
                        $scope.combined();
                        break;
                    default:
                        break;
                }
            });

        $scope.$watch('show_stats', function () {
            if ($scope.show_stats === true) {
                $scope.go('toilets.stats_day');
            }
        });

        $scope.amount = [0, 0];

        function get_data(offset, callback, id) {
            var params = {};
            if (typeof (id) !== 'undefined') {
                params = {
                    offset: offset,
                    id: id
                };
            } else {
                params = {
                    offset: offset
                };
            }

            $http.get('../bin/graph.php', {
                params: params
            }).
            success(function (data, status, headers, config) {
                callback(data);
            }).
            error(function (data, status, headers, config) {
                console.log('Error');
                $scope.loading = false;
            });
        }

        function getDate() {
            var currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 1);
            var day = currentDate.getDate();
            var month = currentDate.getMonth() + 1;
            var year = currentDate.getFullYear();
            if (month < 10) {
                month = "0" + month;
            }
            if (day < 10) {
                day = "0" + day;
            }
            return "Times for " + year + "-" + month + "-" + day;
        }

        function getDataWithID(id, offset) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            var options = {
                colors: ['#00A9D4', '#5fbadd', '#f0f1f1'],
                timeline: {
                    showRowLabels: false,
                    rowLabelStyle: {
                        fontName: 'Helvetica',
                        fontSize: 36,
                        color: '#000000'
                    },
                    barLabelStyle: {
                        fontName: 'Helvetica',
                        fontSize: 34
                    }
                }
            };
            var data = createDataTable(id, offset, function (data) {
                if (data.getNumberOfRows() > 0) {
                    google.setOnLoadCallback(drawChart(data, 'toilet' + id, options));
                } else {
                    console.error("No Data collected yet");
                    $scope.error = true;
                }
            });

        }

        function getAmount(id, offset) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            var data = createDataTable(id, offset, function (data) {
                var amount = data.getNumberOfRows();
                if (amount > 0) {
                    drawAmountData(amount, id);
                } else {
                    console.error("No Data collected yet");
                    $scope.error = true;
                }
            });
        }

        function getAvailability(offset) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            var options = {
                colors: ['#00A9D4', '#E32119', '#f0f1f1'],
                avoidOverlappingGridLines: true,
                timeline: {
                    showRowLabels: false,
                    barLabelStyle: {
                        fontName: 'Helvetica',
                        fontSize: 34
                    }
                }
            };
            var data = createAvailabilityData(offset, function (data) {
                if (data.getNumberOfRows() > 0) {
                    google.setOnLoadCallback(drawChart(data, 'availability', options));
                } else {
                    console.error("No Data collected yet");
                    $scope.error = true;
                }
            });
        }

        function createDataTable(id, offset, callback) {

            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn({
                type: 'string',
                id: 'Toilet'
            });
            dataTable.addColumn({
                type: 'date',
                id: 'Start'
            });
            dataTable.addColumn({
                type: 'date',
                id: 'End'
            });

            var startDate = '';
            get_data(offset, function (data) {
                var rows = data.split(';');
                rows.forEach(function (element, index) {
                    var array = element.split(','),
                        timestamp = array[0],
                        state = array[1];
                    if (state == 1) {
                        startDate = dateFromUTC(timestamp, '-');
                    } else if (timestamp) {
                        endDate = dateFromUTC(timestamp, '-');
                        if (startDate !== '') {
                            dataTable.addRows([
                                ['toilet:' + id, new Date(startDate), new Date(endDate)]
                            ]);
                            startDate = '';
                        }
                    }
                });
                callback(dataTable);
            }, id);
        }

        function createAvailabilityData(offset, callback) {
            var dataTable = new google.visualization.DataTable();
            dataTable.addColumn({
                type: 'string',
                id: 'Row'
            });
            dataTable.addColumn({
                type: 'string',
                id: 'Toilet'
            });
            dataTable.addColumn({
                type: 'date',
                id: 'Start'
            });
            dataTable.addColumn({
                type: 'date',
                id: 'End'
            });

            var offset_end = offset + 1;

            var startDate = '';
            var endDate = '';

            get_data(offset, function (data) {
                var rows = data.split(';');
                rows.forEach(function (element, index) {
                    var array = element.split(','),
                        timestamp = array[0],
                        state = array[1];
                    if (state == 1) {
                        if (startDate !== '') {
                            endDate = dateFromUTC(timestamp, '-');
                            dataTable.addRows([
                                ['Row', 'One in use', new Date(startDate), new Date(endDate)]
                            ]);
                        }
                        startDate = dateFromUTC(timestamp, '-');
                    } else if (timestamp) {
                        if (endDate !== '') {
                            endDate = dateFromUTC(timestamp, '-');
                            dataTable.addRows([
                                ['Row', 'Two in use', new Date(startDate), new Date(endDate)]
                            ]);
                            startDate = endDate;
                            endDate = '';
                        } else if (startDate !== '') {
                            endDate = dateFromUTC(timestamp, '-');
                            dataTable.addRows([
                                ['Row', 'One in use', new Date(startDate), new Date(endDate)]
                            ]);
                            endDate = startDate = '';
                        }
                    }
                });
                callback(dataTable);
            });
        }

        function drawChart(dataTable, id, options) {
            var elements = document.getElementsByName(id);
            for (var i = elements.length - 1; i >= 0; i--) {
                if (elements[i].clientWidth > 0) {
                    var chart = new google.visualization.Timeline(elements[0]);
                    chart.draw(dataTable, options);
                }
            };
        }

        function drawAmountData(amount, id) {
            $scope.amount[id - 1] = '' + amount;
        }

        function dateFromUTC(dateAsString, ymdDelimiter) {
            var pattern = new RegExp("(\\d{4})" + ymdDelimiter + "(\\d{2})" + ymdDelimiter + "(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})");
            var parts = dateAsString.match(pattern);
            return new Date(Date.UTC(
                parseInt(parts[1]), parseInt(parts[2], 10) - 1, parseInt(parts[3], 10), parseInt(parts[4], 10), parseInt(parts[5], 10), parseInt(parts[6], 10), 0
            ));
        }

        $scope.day_stat = function () {
            getDataWithID(1, 0);
            getDataWithID(2, 0);
        }

        $scope.amount = function () {
            getAmount(1, 0);
            getAmount(2, 0);
        }

        $scope.combined = function () {
            getAvailability(0);
        }
    }
]);
