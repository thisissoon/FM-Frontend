"use strict";

describe("FM.playlist.PlaylistCtrl", function() {

    var $rootScope, $location, $route, $scope, $q, $httpBackend, $notification, notificationSpy,
        TracksResource, UsersResource, PlayerQueueResource, playlistData;

    beforeEach(function (){
        module("FM.playlist.PlaylistCtrl");
    });

     beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_

        $httpBackend.whenGET(/.*player\/queue/).respond(200, [{ track: { uri: "foo" } },{ track: { uri: "bar" } }]);
        $httpBackend.whenGET(/.*users.*/).respond(200, { "id": 123 });
        $httpBackend.whenGET(/.*tracks.*/).respond(200, { uri: "foo", album: { name: "some album name", images: [{ url: "track/image.png" }] }, artists: [{ name: "some artist name" }] });
        $httpBackend.whenGET(/partials\/.*/).respond(200);
    }));


    beforeEach(inject(function ( _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = $injector.get("$q");
        $notification = jasmine.createSpy();

        $location = $injector.get("$location");
        $route = $injector.get("$route");


        TracksResource = $injector.get("TracksResource");
        spyOn(TracksResource, "get").and.callThrough();

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "query").and.callThrough();

        UsersResource = $injector.get("UsersResource");
        spyOn(UsersResource, "get").and.callThrough();

        playlistData = [{ track: { uri: "foo" } },{ track: { uri: "bar" } }];

        $controller("PlaylistCtrl", {
            $scope: $scope,
            $q: $q,
            $notification: $notification,
            TracksResource: TracksResource,
            UsersResource: UsersResource,
            PlayerQueueResource: PlayerQueueResource,
            playlistData: playlistData
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load views", function() {
        $location.path("/");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("PlaylistCtrl");
    });

    it("should attach data to $scope", function(){
        $httpBackend.flush();
        expect($scope.playlist).toEqual(playlistData);
    });

    it("should refresh playlist data", function(){
        $scope.refreshPlaylist();
        $httpBackend.flush();
        expect(PlayerQueueResource.query).toHaveBeenCalled();
    });

    it("should refresh playlist data on play event", function(){
        spyOn($scope, "refreshPlaylist").and.callThrough();
        $scope.onPlay();
        $httpBackend.flush();
        expect($scope.refreshPlaylist).toHaveBeenCalled();
    });

    it("should remove item from playlist on end event", function(){
        $scope.onEnd({},{ uri: "baz" });
        expect($scope.playlist.length).toBe(2);

        $scope.onEnd({},{ uri: "foo" });
        expect($scope.playlist.length).toBe(1);

        $scope.onEnd({},{ uri: "bar" });
        expect($scope.playlist.length).toBe(0);

        $httpBackend.flush();
    });

    it("should add item to playlist on add event", function(){
        $scope.onAdd({},{ uri: "foo", user: 123 });
        $httpBackend.flush();
        expect($scope.playlist.length).toBe(3);
        expect($notification).toHaveBeenCalledWith("Track Added", { body: "undefined added some artist name - some album name: undefined", icon: "track/image.png" });
    });


});
