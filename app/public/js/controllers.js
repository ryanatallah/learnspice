'use strict';

angular.module('myApp.controllers', []).controller('mainController', function($scope, $http, $location, $window, socket) {
    $scope.user = {};
    $scope.authenticate = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
    $scope.logout = function() {
        $http.post('/logout').success(function(){
            $window.location.href = $location.path();
        });
    };
    socket.on('self', function(data) {
        $scope.user = data;
    });
}).controller('noteCreationController', function($scope, $location, socket) {
    socket.on('create:note', function(data) {
        if(data) {
            $location.path('/' + data.shortlink);
        } else {
            alert('Unable to create note.');
        }
    });
    $scope.createNote = function() {
        if($scope.user.id) {
            socket.emit('create:note', {title: $scope.noteTitle});
        } else {
            alert('Login required.');
        }
    };
}).controller('noteController', function($scope, $routeParams, $location, socket) {
    $scope.note = {};
    socket.on('get:note', function(data) {
        if (data) {
            $scope.note = data;
            socket.on('update:section', function(data) {
                if($scope.note.sections[data._id]) {
                    data.lines = $scope.note.sections[data._id].lines;
                }
                $scope.note.sections[data._id] = data;
            });
            socket.on('update:line', function(data) {
                if(!$scope.note.sections[data.sectionid]) {
                    $scope.note.sections[data.sectionid] = {};
                }
                $scope.note.sections[data.sectionid].lines[data._id] = data;
            });
            $scope.addSection = function() {
                socket.emit('create:section', {header: $scope.newHeader});
                $scope.newHeader = '';
            };
            $scope.addLine = function(sectionid) {
                socket.emit('create:line', {sectionid: sectionid, content: $scope[sectionid + 'newContent']});
                $scope[sectionid + 'newContent'] = '';
            };
        } else {
            $location.path('/');
        }
    });
    socket.emit('get:note', {shortlink: $routeParams.shortlink});
}).controller('ChatController', function($scope, socket) {
});
