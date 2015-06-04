"use strict";
/*
 * @module   sn.infiniteScroll
 * @author   SOON_
 */
angular.module("sn.infiniteScroll", [

])
/**
 * @example
    <div sn-infinite-scroll="loadMore()" data-container="ng-view" data-offset="-100" data-disabled="loading">></div>
 * @constructor
 * @class    snInfiniteScroll
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
                offset: "@",
                snInfiniteScroll: "&",
                disabled: "="
            },
            link: function($scope, $element){

                var scrollingElement = $scope.container ? $document[0].querySelector($scope.container) : $element,
                    scrollOffset = $scope.offset || 0;

                var onScroll = function onScroll(){

                    var elementScrollEnd = ( $window.innerHeight >= ($element[0].getBoundingClientRect().bottom - scrollOffset) );

                    if (elementScrollEnd && !$scope.disabled) {
                        $scope.snInfiniteScroll();
                    }

                };

                var removeListeners = function removeListeners(){
                    angular.element(scrollingElement).off("scroll");
                    angular.element($window).off("resize");
                };

                $scope.$on("$destroy", removeListeners);

                angular.element(scrollingElement).on("scroll", onScroll);
                angular.element($window).on("resize", onScroll);

                $timeout(onScroll, 500);

            }
        };
    }
]);
