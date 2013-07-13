'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
        controller('AppCtrl', function($scope, socket) {
    socket.on('send:name', function(data) {
        $scope.name = data.name;
    });
}).
        controller('MyCtrl1', function($scope, socket) {
    socket.emit('create:user', {username: 'tester', email: 'tester@tester.com', password: 'tester'});

    socket.on('create:user', function(data) {
        $scope.userid = data.userid;
        alert('User successfully created.');
    });
}).
        controller('MyCtrl2', function($scope) {
    // write Ctrl here
});
