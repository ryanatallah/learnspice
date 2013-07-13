'use strict';

/* Directives */

angular.module('myApp.directives', []).directive('appVersion', function (version) {
	return function(scope, elm, attrs) {
		elm.text(version);
	};
}).directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if(event.which === 13) {
                scope.$apply(function(){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});;
