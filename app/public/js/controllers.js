'use strict';

/* Controllers */

angular.module('myApp.controllers', ['ngCookies']).controller('AppCtrl', function($scope, $cookies, socket) {
    if ($cookies.user) {
        var user = JSON.parse($cookies.user);
        if (user.temp) {
            socket.emit('authenticate:tempuser', {userid: user.userid, username: user.username});
        } else {
            socket.emit('authenticate:user', {userid: user.userid, username: user.username});
        }
    } else {
        socket.emit('create:tempuser', {});
    }

    socket.on('authenticate:tempuser', function(data) {
        $scope.user = data;
        $scope.user.temp = true;
        setCookie('user', JSON.stringify(data), 30);
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
}).controller('MyCtrl1', function($scope, socket) {
}).controller('MyCtrl2', function($scope, socket) {
});

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}