/**
 * Main AngularJS Web Application
 */
angular.module('cilAssistant', [
        'ngRoute',
        'angularMoment',
        'ui.bootstrap',
        'angularSpinner'
    ])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
        // Home
            .when("/", {
                templateUrl: "partials/home.html"
            })
            // Pages
            .when("/breakfast", {
                templateUrl: "partials/breakfast.html",
                controller: "BreakfastCtrl"
            })
            .when("/cecilia", {
                templateUrl: "partials/cecilia.html",
                controller: "CeciliaCtrl"
            })
            .when("/toilets", {
                templateUrl: "partials/toilets.html",
                controller: "ToiletsCtrl"
            })
            .when("/whoishere", {
                templateUrl: "partials/whoishere.html",
                controller: "WhoIsHereCtrl"
            })
            .when("/rotator", {
                templateUrl: "partials/rotator.html",
                controller: "RotatorCtrl"
            })
            // else 404
            .otherwise("/", {
                templateUrl: "partials/home.html"
            });
        $locationProvider.html5Mode(true);
    }]);
