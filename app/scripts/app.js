/* global app:true */
/* exported app */
'use strict';

/**
 * @ngdoc overview
 * @name meerkatApp
 * @description
 * # meerkatApp
 *
 * Main module of the application.
 */
var app = angular
  .module('meerkatApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'firebase',
    'ui.bootstrap'
  ])
  .constant('FIREBASE_URL', 'https://meerkat-test.firebaseio.com/')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/students.html',
        controller: 'StudentsCtrl'
      })
      .when('/caselog/', {
        templateUrl: 'views/caselog.html',
        controller: 'CaseLogCtrl'
      })
      .when('/students/', {
        templateUrl: 'views/students.html',
        controller: 'StudentsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.directive('datepickerPopup', ['datepickerPopupConfig', 'dateParser', 'dateFilter', function (datepickerPopupConfig, dateParser, dateFilter) {
    return {
        'restrict': 'A',
        'require': '^ngModel',
        'link': function ($scope, element, attrs, ngModel) {
            var dateFormat;

            //*** Temp fix for Angular 1.3 support [#2659](https://github.com/angular-ui/bootstrap/issues/2659)
            attrs.$observe('datepickerPopup', function(value) {
                dateFormat = value || datepickerPopupConfig.datepickerPopup;
                ngModel.$render();
              });

            ngModel.$formatters.push(function (value) {
                return ngModel.$isEmpty(value) ? value : dateFilter(value, dateFormat);
              });
          }
      };
  }]);