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
        $httpBackend.whenGET(/.*users.*/).respond(200, {"family_name": "Light", "display_name": "Alex Light", "avatar_url": "http://placehold.it/400", "spotify_playlists": null, "given_name": "Alex", "id": "16369f65-6aa5-4d04-8927-a77016d0d721"});
        $httpBackend.whenGET(/.*tracks.*/).respond(200, {"album": {"id": "d7b737a9-d70b-49a9-9f42-8c204b342000", "images": [{"url": "http://placehold.it/640x629?text=Album+Art", "width": 640, "height": 629}, {"url": "http://placehold.it/300x295?text=Album+Art", "width": 300, "height": 295}, {"url": "http://placehold.it/64x63?text=Album+Art", "width": 64, "height": 63}], "name": "Boston", "uri": "spotify:album:2QLp07RO6anZHmtcKTEvSC"}, "name": "More Than a Feeling", "uri": "spotify:track:1QEEqeFIZktqIpPI4jSVSF", "play_count": 0, "artists": [{"id": "8c22640a-02ef-4ee0-90eb-87c9c9a2534f", "uri": "spotify:artist:29kkCKKGXheHuoO829FxWK", "name": "Boston"}], "duration": 285133, "id": "0739b113-ad3a-47a4-bea9-edb00ba192f5"});
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

        playlistData = { items: [{ track: { uri: "foo" } },{ track: { uri: "bar" } }]};

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
        expect($scope.playlist).toEqual(playlistData.items);
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
        expect($notification).toHaveBeenCalledWith("Track Added", { body: "Alex Light added Boston - Boston: More Than a Feeling", icon: "http://placehold.it/640x629?text=Album+Art" });
    });


});
