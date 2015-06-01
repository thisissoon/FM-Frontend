"use strict";
/**
 * @module FM.player.sliderDirective
 * @author SOON_
 */
angular.module("FM.player.sliderDirective", [

])
/**
 * @example
 *  <fm-slider
 *      ng-model="model"
 *      ng-change="update()"
 *      data-min="0"
 *      data-max="100">
 *  </fm-slider>
 * @constructor
 * @class fmSlider
 */
.directive("fmSlider",[
    function (){
        return {
            restrict: "EA",
            require: "ngModel",
            scope: {
                min: "@",
                max: "@"
            },
            templateUrl: "partials/slider.html",
            link:  function($scope, $element, $attrs, ngModel) {

                /**
                 * Update ngModel.$viewValue with new slider value onChange
                 * @method onChange
                 */
                $scope.onChange = function onChange(){
                    ngModel.$setViewValue($scope.sliderValue);
                };

                /**
                 * Update slider value on ngModel change
                 */
                ngModel.$render = function () {
                    $scope.sliderValue = ngModel.$viewValue;
                };

            }
        };
    }
]);
