'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngCookies']).controller('AppCtrl', function($scope, $cookies, socket) {
    if ($cookies.user) {
        var user = JSON.parse($cookies.user);
        if (user.temp) {
            socket.emit('check:tempuser', {userid: user.userid, username: user.username});
        } else {
            socket.emit('check:user', {userid: user.userid, username: user.username});
        }
    } else {
        socket.emit('create:tempuser', {});
    }

    socket.on('check:tempuser', function(data) {
        if(data) {
            $scope.user = data;
            $scope.user.temp = true;
            setCookie('user', JSON.stringify(data), 30);
        } else {
            setCookie('user', '', 30);
            socket.emit('create:tempuser', {});
        }
    });

    socket.on('check:user', function(data) {
        if(data) {
            $scope.user = data;
            setCookie('user', JSON.stringify(data), 30);
        } else {
            setCookie('user', '', 30);
            socket.emit('create:tempuser', {});
        }
    });

    socket.on('authenticate:user', function(data) {
        $scope.user = data;
        setCookie('user', JSON.stringify(data), 30);
    });

    socket.on('create:tempuser', function(data) {
        $scope.user = data;
        $scope.user.temp = true;
        setCookie('user', JSON.stringify(data), 30);
    });

    socket.on('create:user', function(data) {
        $scope.user = data;
        setCookie('user', JSON.stringify(data), 30);
    });

    $scope.createUser = function() {
        socket.emit('create:user', {userid: $scope.user.userid, oldUsername: $scope.user.username, username: $scope.newUsername, email: $scope.newEmail, password: $scope.newPassword});
    };
}).controller('noteCreationController', function($scope, $location, socket) {
    socket.on('create:note', function(data) {
        $location.path('/' + data.shortlink);
    });

    $scope.createNote = function() {
        socket.emit('create:note', {userid: $scope.user.userid, title: $scope.noteTitle});
    };
}).controller('noteController', function($scope, $routeParams, $location, socket) {
    var shortlink = $routeParams.shortlink;

    $scope.sections = [];

    socket.emit('get:note', {shortlink: shortlink});

    socket.on('get:note', function(data) {
        if (data) {
            $scope.note = data;

            socket.emit('get:sections', {noteid: $scope.note.noteid});

            socket.on('get:sections', function(data) {
                $scope.sections = data;
            });

            socket.on('create:section', function(data){
                $scope.sections.push(data);
            });

            socket.on('change:section', function(data){
                for (var i = 0; i < $scope.sections.length; i++) {
                    if ($scope.sections[i]._id == data._id) {
                        $scope.sections[i] = data._id;
                        break;
                    }
                }
            });

            socket.on('get:lines', function(data) {
                $scope.lines = data;
            });

            socket.on('create:line', function(data){
                $scope.lines.push(data);
            });

            socket.on('change:section', function(data){
                for (var i = 0; i < $scope.lines.length; i++) {
                    if ($scope.lines[i]._id == data._id) {
                        $scope.lines[i] = data._id;
                        break;
                    }
                }
            });

            $scope.addLine = function(section) {
                console.log(section);
                socket.emit('create:line', {shortlink: shortlink, noteid: $scope.note.noteid, sectionid: section, userid: $scope.user.userid, content: $scope.newContent});
                $scope.newContent = '';
            };

            $scope.addSection = function() {
                socket.emit('create:section', {shortlink: shortlink, noteid: $scope.note.noteid, userid: $scope.user.userid, header: $scope.newHeader});
                $scope.newHeader = '';
            };
        } else {
            $location.path('/');
        }
    });
}).controller('ChatController', function($scope, socket) {
    socket.on('send:messages', function(data) {
        $scope.messages = data[0];
        console.log('MESSAGES SENT');
    });
    socket.on('create:message', function(data) {
        $scope.message = data[0];
        console.log('Message posted: ' + data[0]);
    });
});

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}
