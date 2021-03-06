"use strict";
/**
 * Removes leading 0's from time but leaves
 * minutes and seconds intacted
 * @module FM.player.removeLeadingZeros
 * @author SOON_
 */
angular.module("FM.player.removeLeadingZeros", [

])
/**
 * @example
 *     {{ time | date: "H:mm:ss" | removeLeadingZeros }}
 * @class removeLeadingZeros
 */
.filter("removeLeadingZeros", [
    function (){
        return function (input) {

            var s = input;

            if ( s && s.split ){
                var arr = s.split(":");

                arr.map(function (currentValue, index, arr){
                    if ((index < arr.length - 2) && (parseInt(currentValue) === 0)){
                        arr.splice(index, 1);
                    }
                });

                s = arr.join(":");
            }

            return s;
        };
    }
]);
