/**
 * Main AngularJS Web Application
 */
angular.module('cilAssistant', [
        'ui.router',
        'angularMoment',
        'ui.bootstrap',
        'angularSpinner',
        'ui.router.tabs'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
        // Home
            .state("home", {
                url: "/",
                templateUrl: "views/home/site.html"
            })
            // Pages
            .state("breakfast", {
                url: "/breakfast",
                templateUrl: "views/breakfast/site.html",
                controller: "BreakfastCtrl"
            })
            .state("cecilia", {
                url: "/cecilia",
                templateUrl: "views/cecilia/site.html",
                controller: "CeciliaCtrl"
            })
            .state("toilets", {
                url: "/toilets",
                templateUrl: "views/toilets/site.html",
                controller: "ToiletsCtrl"
            })
            .state("toilets.stats_day", {
                url: "/day",
                templateUrl: "views/toilets/partials/day_stat.html"
            })
            .state("toilets.stats_amount", {
                url: "/amount",
                templateUrl: "views/toilets/partials/amount_stat.html"
            })
            .state("toilets.stats_combined", {
                url: "/combined",
                templateUrl: "views/toilets/partials/combined_stat.html"
            })
            .state("whoishere", {
                url: "/whoishere",
                templateUrl: "views/whoishere/site.html",
                controller: "WhoIsHereCtrl"
            })
            .state("rotator", {
                url: "/rotator",
                templateUrl: "views/rotator/site.html",
                controller: "RotatorCtrl"
            });
        $locationProvider.html5Mode(true);
    }])
    .controller('NavCtrl', ['$scope', function ($scope) {
        $scope.tabData = [{
            heading: 'Home',
            route: 'home',
            params: {
                icon: 'glyphicon glyphicon-home'
            }
        }, {
            heading: 'Toilets',
            route: 'toilets'
        }, {
            heading: 'Who-Is-Here',
            route: 'whoishere'
        }, {
            heading: 'Breakfast',
            route: 'breakfast'
        }, {
            heading: 'ceCILia',
            route: 'cecilia'
        }, {
            heading: 'Site-Rotator',
            route: 'rotator'
        }];
    }]);
