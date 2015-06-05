"use strict";
/*
 * @module   sn.infiniteScroll
 * @author   SOON_
 */
angular.module("sn.infiniteScroll", [

])
/**
 * Directive to trigger function when element reaches the bottom of its scroll
 * @example
 *   <div sn-infinite-scroll="loadMore()" data-container="ng-view" data-offset="-100" data-disabled="loading"></div>
 * @constructor
 * @class    snInfiniteScroll
 * @require $window
 * @require $document
 * @require $timeout
 */
.directive("snInfiniteScroll", [
    "$window",
    "$document",
    "$timeout",
    function ($window, $document, $timeout){
        return {
            restrict: "A",
            scope: {
                container: "@",
                offset: "=?",
                snInfiniteScroll: "&",
                disabled: "=?"
            },
            link: function($scope, $element){

                /**
                 * Element to attach scroll listener to
                 * Default to $element or lookup `container` identifier if defined
                 * @property {Object} scrollElement
                 */
                var scrollElement = $scope.container ? $document[0].querySelector($scope.container) : $element;

                /**
                 * Offset from bottom of scroll to call trigger function (px)
                 * @property {Number} offset
                 */
                $scope.offset = $scope.offset || 0;

                /**
                 * Determine if element has come to the end of its scroll and call the trigger function
                 * @function onScroll
                 */
                var onScroll = function onScroll(){

                    var elementScrollEnd = ( $window.innerHeight >= ($element[0].getBoundingClientRect().bottom - $scope.offset) );

                    if (elementScrollEnd && !$scope.disabled) {
                        $scope.snInfiniteScroll();
                    }
                };

                /**
                 * Cleanup event listeners
                 * @function removeListeners
                 */
                var removeListeners = function removeListeners(){
                    angular.element(scrollElement).off("scroll");
                    angular.element($window).off("resize");
                };

                $scope.$on("$destroy", removeListeners);

                // attach event listeners
                angular.element(scrollElement).on("scroll", onScroll);
                angular.element($window).on("resize", onScroll);

                $timeout(onScroll, 500);

            }
        };
    }
]);
