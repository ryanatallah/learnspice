'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'btford.socket-io'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/partial1',
      controller: 'noteCreationController'
    }).
    when('/note', {
      templateUrl: 'partials/partial2',
      controller: 'noteController'
    }).
    when('/note/:id', {
      templateUrl: 'partials/note',
      controller: 'NoteController'
    }).
    otherwise({
      redirectTo: '/'
    });

  $locationProvider.html5Mode(true);
});
