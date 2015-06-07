/**
 * Main AngularJS Web Application
 */
angular.module('cilAssistant', [
        'ui.router',
        'angularMoment',
        'ui.bootstrap',
        'angularSpinner'
    ])
    .config(['$stateProvider', '$urlRouterProvider','$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise("/");
        $stateProvider
        // Home
            .state("home", {
                url: "/",
                templateUrl: "partials/home.html"
            })
            // Pages
            .state("breakfast", {
                url:"/breakfast",
                templateUrl: "partials/breakfast.html",
                controller: "BreakfastCtrl"
            })
            .state("cecilia", {
                url:"/cecilia",
                templateUrl: "partials/cecilia.html",
                controller: "CeciliaCtrl"
            })
            .state("toilets", {
                url:"/toilets",
                templateUrl: "partials/toilets.html",
                controller: "ToiletsCtrl"
            })
            .state("whoishere", {
                url:"/whoishere",
                templateUrl: "partials/whoishere.html",
                controller: "WhoIsHereCtrl"
            })
            .state("rotator", {
                url:"/rotator",
                templateUrl: "partials/rotator.html",
                controller: "RotatorCtrl"
            });
        $locationProvider.html5Mode(true);
    }]);
