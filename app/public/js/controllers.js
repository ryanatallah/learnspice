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
}).controller('noteCreationController', function($scope, socket) {
    socket.on('create:note', function(data) {
        alert(data.shortlink);
    });

    $scope.createNote = function() {
        socket.emit('create:note', {userid: $scope.user.userid, title: $scope.noteTitle});
    };
}).controller('noteController', function($scope, socket) {
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
