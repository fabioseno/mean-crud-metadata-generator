/*global angular*/
(function () {
    'use strict';

    function mdSelectDirective() {
        return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                element.after('<div class="md-errors-spacer"></div>');
            }
        };
    }

    angular.module('app').directive('mdSelect', mdSelectDirective);

}());