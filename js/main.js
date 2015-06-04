/**
 * Main AngularJS Web Application
 */
angular.module('cilAssistant', [
        'ngRoute'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
        // Home
            .when("/", {
                templateUrl: "partials/home.html",
                controller: "PageCtrl"
            })
            // Pages
            .when("/breakfast", {
                templateUrl: "partials/breakfast.html",
                controller: "PageCtrl"
            })
            .when("/cecilia", {
                templateUrl: "partials/cecilia.html",
                controller: "PageCtrl"
            })
            .when("/toilets", {
                templateUrl: "partials/toilets.html",
                controller: "PageCtrl"
            })
            .when("/whoishere", {
                templateUrl: "partials/whoishere.html",
                controller: "PageCtrl"
            })
            .when("/rotator", {
                templateUrl: "partials/rotator.html",
                controller: "PageCtrl"
            })
            // else 404
            .otherwise("/404", {
                templateUrl: "partials/404.html",
                controller: "PageCtrl"
            });
    }])
    .controller('PageCtrl', ['$scope', function ($scope) {
        console.log('PageCtrl loaded');
    }]);
