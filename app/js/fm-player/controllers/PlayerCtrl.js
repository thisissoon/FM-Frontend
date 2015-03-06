"use strict";
/**
 * Controller for thisissoon FM player
 * @class  PlayerCtrl
 * @module sn.fm.player
 * @author SOON_
 */
angular.module("sn.fm.player").controller("PlayerCtrl", [
    "$scope",
    /**
     * @constructor
     * @param {Object} $scope
     */
    function ($scope) {

        $scope.playlist = [{
            album: {
                artists: [
                    {
                        id: "26556f7e-3304-4e51-8243-dd2199fcf6fa",
                        name: "Nightwish",
                        spotify_uri: "spotify:artist:2NPduAUeLVsfIauhRwuft1"
                    }
                ],
                id: "7f8bda77-5364-4902-9a98-208f1cdd7643",
                images: [
                    {
                        height: 640,
                        url: "https://i.scdn.co/image/7928fc9bd902b917aae0ef1bee41cb51598a2d27",
                        width: 640
                    },
                    {
                        height: 300,
                        url: "https://i.scdn.co/image/e80cb4d324d16881e2f7653abdbd70497bbab68d",
                        width: 300
                    },
                    {
                        height: 64,
                        url: "https://i.scdn.co/image/bf567406035a8e2b162c6a23470c6cdd5dd560f3",
                        width: 64
                    }
                ],
                name: "Showtime, Storytime",
                spotify_uri: "spotify:album:1tZlCjdI2dcfBXP8iSDsSI"
            },
            duration: 272906,
            id: "4b170737-017c-4e85-965c-47b8a158c789",
            name: "Dark Chest Of Wonders - Live @ Wacken 2013",
            spotify_uri: "spotify:track:6FshvOVICpRVkwpYE5BYTD"
        },
        {
            album: {
                artists: [
                    {
                        id: "26556f7e-3304-4e51-8243-dd2199fcf6fa",
                        name: "Nightwish",
                        spotify_uri: "spotify:artist:2NPduAUeLVsfIauhRwuft1"
                    }
                ],
                id: "7f8bda77-5364-4902-9a98-208f1cdd7643",
                images: [
                    {
                        height: 640,
                        url: "https://i.scdn.co/image/7928fc9bd902b917aae0ef1bee41cb51598a2d27",
                        width: 640
                    },
                    {
                        height: 300,
                        url: "https://i.scdn.co/image/e80cb4d324d16881e2f7653abdbd70497bbab68d",
                        width: 300
                    },
                    {
                        height: 64,
                        url: "https://i.scdn.co/image/bf567406035a8e2b162c6a23470c6cdd5dd560f3",
                        width: 64
                    }
                ],
                name: "Showtime, Storytime",
                spotify_uri: "spotify:album:1tZlCjdI2dcfBXP8iSDsSI"
            },
            duration: 272906,
            id: "4b170737-017c-4e85-965c-47b8a158c789",
            name: "Dark Chest Of Wonders - Live @ Wacken 2013",
            spotify_uri: "spotify:track:6FshvOVICpRVkwpYE5BYTD"
        },
        {
            album: {
                artists: [
                    {
                        id: "26556f7e-3304-4e51-8243-dd2199fcf6fa",
                        name: "Nightwish",
                        spotify_uri: "spotify:artist:2NPduAUeLVsfIauhRwuft1"
                    }
                ],
                id: "7f8bda77-5364-4902-9a98-208f1cdd7643",
                images: [
                    {
                        height: 640,
                        url: "https://i.scdn.co/image/7928fc9bd902b917aae0ef1bee41cb51598a2d27",
                        width: 640
                    },
                    {
                        height: 300,
                        url: "https://i.scdn.co/image/e80cb4d324d16881e2f7653abdbd70497bbab68d",
                        width: 300
                    },
                    {
                        height: 64,
                        url: "https://i.scdn.co/image/bf567406035a8e2b162c6a23470c6cdd5dd560f3",
                        width: 64
                    }
                ],
                name: "Showtime, Storytime",
                spotify_uri: "spotify:album:1tZlCjdI2dcfBXP8iSDsSI"
            },
            duration: 272906,
            id: "4b170737-017c-4e85-965c-47b8a158c789",
            name: "Dark Chest Of Wonders - Live @ Wacken 2013",
            spotify_uri: "spotify:track:6FshvOVICpRVkwpYE5BYTD"
        }]

        // list of `state` value/display objects
        $scope.states        = loadAll();
        $scope.selectedItem  = null;
        $scope.searchText    = null;
        $scope.querySearch   = querySearch;
        $scope.simulateQuery = false;
        // ******************************
        // Internal methods
        // ******************************
        /**
        * Search for states... use $timeout to simulate
        * remote dataservice call.
        */
        function querySearch (query) {
            var results = query ? $scope.states.filter( createFilterFor(query) ) : [],
                deferred;
            if ($scope.simulateQuery) {
                deferred = $q.defer();
                $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                return deferred.promise;
            } else {
              return results;
            }
        }
        /**
         * Build `states` list of key/value pairs
         */
        function loadAll() {
            var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
                      Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
                      Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
                      Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
                      North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
                      South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
                      Wisconsin, Wyoming';

            return allStates.split(/, +/g).map( function (state) {
                return {
                    value: state.toLowerCase(),
                    display: state,
                    artwork: 'http://upload.wikimedia.org/wikipedia/en/b/b9/Nothing_Was_the_Same_cover_2.png'
                };
            });
        }
        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(state) {
                return (state.value.indexOf(lowercaseQuery) === 0);
            };
        }

    }

]);
