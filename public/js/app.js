'use strict';

angular.module('myApp', [
    'myApp.controllers',
    'myApp.directives',
    'myApp.filters',
    'myApp.services'
  ]).config(function ($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/createNote',
        controller: 'noteCreationController'
      }).
      when('/:shortlink', {
        templateUrl: 'partials/note',
        controller: 'noteController'
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  });
