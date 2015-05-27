"use strict";

describe("FM.playlist.PlaylistCtrl", function() {

    var $rootScope, $location, $route, $scope, $q,
        TracksResource, UsersResource, PlayerQueueResource, playlistData,
        playerQueueCallback, trackCallback, userCallback;

    beforeEach(function (){
        module("FM.playlist.PlaylistCtrl");
    });


    beforeEach(inject(function ( _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        $location = $injector.get("$location");
        $route = $injector.get("$route");

        playerQueueCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this, [[{ track: { uri: "foo" } },{ track: { uri: "bar" } }]]);
                    }
                }
            }
        }

        trackCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this, [{ track: { uri: "foo" } }]);
                    }
                }
            }
        }

        userCallback = function(){
            return {
                $promise: {
                    then: function(fn){
                        fn.apply(this, [{ id: 123 }]);
                    }
                }
            }
        }

        TracksResource = $injector.get("TracksResource");
        spyOn(TracksResource, "get").and.callFake(trackCallback);

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "query").and.callFake(playerQueueCallback);

        UsersResource = $injector.get("UsersResource");
        spyOn(UsersResource, "get").and.callFake(userCallback);

        playlistData = [{ track: { uri: "foo" } },{ track: { uri: "bar" } }];

        $controller("PlaylistCtrl", {
            $scope: $scope,
            $q: $q,
            TracksResource: TracksResource,
            UsersResource: UsersResource,
            PlayerQueueResource: PlayerQueueResource,
            playlistData: playlistData
        });
    }));

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200);
    }));

    it("should load views", function() {
        $location.path("/");
        $rootScope.$digest();
        expect($route.current.controller).toBe("PlaylistCtrl");
    });

    it("should attach data to $scope", function(){
        expect($scope.playlist).toEqual(playlistData);
    });

    it("should refresh playlist data", function(){
        $scope.refreshPlaylist();
        expect(PlayerQueueResource.query).toHaveBeenCalled();
    });

    it("should refresh playlist data on play event", function(){
        $scope.onPlay();
        expect($scope.paused).toBe(false);
    });

    it("should remove item from playlist on end event", function(){
        $scope.onEnd({},{ uri: "foo" });
        expect($scope.playlist.length).toBe(1);

        $scope.onEnd({},{ uri: "foo" });
        expect($scope.playlist.length).toBe(2);
    });

    it("should add item to playlist on add event", function(){
        $scope.onAdd({},{ uri: "foo", user: 123 });
        $scope.$apply();
        expect($scope.playlist.length).toBe(3);
    });


});
