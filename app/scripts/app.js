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
    'ui.bootstrap',
    'highcharts-ng',
    'angularUtils.directives.dirPagination'
  ])
  .constant('FIREBASE_URL', 'https://meerkat-test.firebaseio.com/')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/caselog.html',
        controller: 'CaseLogCtrl'
      })
      .when('/caselog/', {
        templateUrl: 'views/caselog.html',
        controller: 'CaseLogCtrl'
      })
      .when('/students/', {
        templateUrl: 'views/students.html',
        controller: 'StudentsCtrl'
      })
      .when('/cases/', {
        templateUrl: 'views/cases.html',
        controller: 'CaseViewerCtrl'
      })
      .when('/clinicians/', {
        templateUrl: 'views/clinicians.html',
        controller: 'CliniciansCtrl'
      })
      .when('/patients/', {
        templateUrl: 'views/patients.html',
        controller: 'PatientsCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
  // .config(['$animateProvider', function($animateProvider) {
  //   $animateProvider.classNameFilter(/animate/);
  // }]);

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

// angular.module('ui.bootstrap.carousel', ['ui.bootstrap.transition'])
//     .controller('CarouselController', ['$scope', '$timeout', '$transition', '$q', function        ($scope, $timeout, $transition, $q) {
// }]).directive('carousel', [function() {
//     return {

//     }
// }]);