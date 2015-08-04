"use strict";

describe("FM.playlist.PlaylistCtrl", function() {

    var $rootScope, $location, $route, $scope, $q, $httpBackend, env,
        TracksResource, UsersResource, PlayerQueueResource, playlistData, playlistMeta,
        queue, queueMeta, queueHeader, users, tracks;

    beforeEach(function (){
        module("FM.playlist.PlaylistCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;

        queue = [{ track: { uri: "foo", duration: 100 } },{ track: { uri: "bar", duration: 100 } }];
        queueHeader = {"Total-Pages": "2", "Total-Count": "4"};
        queueMeta = {"play_time": 20100, "genres": {"dirty south rap": 2, "pop": 12, "quiet storm": 1}, "total": 2, "users": {"fef86892-0a28-4b26-b0b3-90a1050cfffd": 2}};
        users = {"family_name": "Light", "display_name": "Alex Light", "avatar_url": "http://placehold.it/400", "spotify_playlists": null, "given_name": "Alex", "id": "16369f65-6aa5-4d04-8927-a77016d0d721"};
        tracks = {"album": {"id": "d7b737a9-d70b-49a9-9f42-8c204b342000", "images": [{"url": "http://placehold.it/640x629?text=Album+Art", "width": 640, "height": 629}, {"url": "http://placehold.it/300x295?text=Album+Art", "width": 300, "height": 295}, {"url": "http://placehold.it/64x63?text=Album+Art", "width": 64, "height": 63}], "name": "Boston", "uri": "spotify:album:2QLp07RO6anZHmtcKTEvSC"}, "name": "More Than a Feeling", "uri": "spotify:track:1QEEqeFIZktqIpPI4jSVSF", "play_count": 0, "artists": [{"id": "8c22640a-02ef-4ee0-90eb-87c9c9a2534f", "uri": "spotify:artist:29kkCKKGXheHuoO829FxWK", "name": "Boston"}], "duration": 285133, "id": "0739b113-ad3a-47a4-bea9-edb00ba192f5"};

        $httpBackend.whenGET(/.*player\/queue/).respond(200, queue, queueHeader);
        $httpBackend.whenGET(/.*player\/queue\/meta/).respond(200, queueMeta);
        $httpBackend.whenGET(/.*users.*/).respond(200, users);
        $httpBackend.whenGET(/.*tracks.*/).respond(200, tracks);
        $httpBackend.whenGET(/partials\/.*/).respond(200);
    }));


    beforeEach(inject(function ( _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        $location = $injector.get("$location");
        $route = $injector.get("$route");

        env = $injector.get("env");

        TracksResource = $injector.get("TracksResource");
        spyOn(TracksResource, "get").and.callThrough();

        PlayerQueueResource = $injector.get("PlayerQueueResource");
        spyOn(PlayerQueueResource, "query").and.callThrough();
        spyOn(PlayerQueueResource, "meta").and.callThrough();

        UsersResource = $injector.get("UsersResource");
        spyOn(UsersResource, "get").and.callThrough();

        playlistData = { items: [{ track: { uri: "foo", duration: 100 } },{ track: { uri: "bar", duration: 100 } }], meta: { totalCount: 4, totalPages: 2 }};
        playlistMeta = {"play_time": 20100, "genres": {"dirty south rap": 2, "pop": 12, "quiet storm": 1}, "total": 2, "users": {"fef86892-0a28-4b26-b0b3-90a1050cfffd": 9}};

        $controller("PlaylistCtrl", {
            $scope: $scope,
            $q: $q,
            TracksResource: TracksResource,
            UsersResource: UsersResource,
            PlayerQueueResource: PlayerQueueResource,
            playlistData: playlistData,
            playlistMeta: playlistMeta
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load views", function() {
        $location.path("/");
        $httpBackend.flush();
        $rootScope.$digest();
        expect($route.current.controller).toBe("PlaylistCtrl");
    });

    it("should attach data to $scope", function(){
        $httpBackend.flush();
        expect($scope.playlist).toEqual(playlistData.items);
        expect($scope.meta).toEqual(playlistMeta);
    });

    it("should refresh playlist data", function(){
        $scope.refreshPlaylist();
        $httpBackend.flush();
        expect(PlayerQueueResource.query).toHaveBeenCalled();
        expect(PlayerQueueResource.meta).toHaveBeenCalled();
    });

    it("should refresh playlist data on play event", function(){
        spyOn($scope, "refreshPlaylist").and.callThrough();
        $scope.onPlay();
        $httpBackend.flush();
        expect($scope.refreshPlaylist).toHaveBeenCalled();
    });

    it("should remove item from playlist on end event", function(){
        $scope.page.total = 1;

        $scope.onEnd({},{ uri: "baz" });
        expect($scope.playlist.length).toBe(2);

        $scope.onEnd({},{ uri: "foo" });
        expect($scope.playlist.length).toBe(1);

        $scope.onEnd({},{ uri: "bar" });
        expect($scope.playlist.length).toBe(0);

        $httpBackend.flush();
    });

    it("should update playlist meta on end event", function(){
        $scope.page.total = 1;

        $scope.onEnd({},{ uri: "foo" });
        $httpBackend.flush();
        expect($scope.meta.play_time).toEqual(20000);
        expect($scope.meta.total).toEqual(1);
    });

    it("should add item to playlist on add event", function(){
        $scope.page.total = 1;

        $scope.onAdd({},{ uri: "foo", user: 123 });
        $httpBackend.flush();
        $rootScope.$digest();
        expect($scope.playlist.length).toBe(3);
    });

    it("should NOT add item to playlist on add event but update total pages", function(){
        $scope.page.total = 2;
        $scope.meta.total = 4;

        env.SEARCH_LIMIT = 2;

        $scope.onAdd({},{ uri: "foo", user: 123 });
        $httpBackend.flush();
        $rootScope.$digest();
        expect($scope.playlist.length).toBe(2);
        expect($scope.page.total).toBe(3);
        expect($scope.meta.total).toBe(5);
    });

    it("should update playlist meta on add event", function(){
        var playTime = $scope.meta.play_time + 285133;
        $scope.onAdd({},{ uri: "foo", user: 123 });
        $httpBackend.flush();
        expect($scope.meta.total).toEqual(3);
        expect($scope.meta.play_time).toEqual(playTime);
    });

    it("should load more tracks", function(){
        expect($scope.playlist.length).toBe(2);

        $scope.loadMore();
        $httpBackend.flush();
        $rootScope.$digest();

        expect($scope.playlist.length).toBe(4);

        queueHeader["Total-Pages"] = undefined;

        $scope.loadMore();
        $httpBackend.flush();
        $rootScope.$digest();

        expect($scope.playlist.length).toBe(6);
    });

    it("should update playlist meta on deleted event", function(){
        $scope.page.total = 1;
        expect($scope.playlist.length).toBe(2);

        $scope.onDeleted({},{ uri: "foo" });
        $httpBackend.flush();
        expect($scope.meta.play_time).toEqual(20000);
        expect($scope.meta.total).toEqual(1);
        expect($scope.playlist.length).toBe(1);
        expect($scope.playlist).not.toContain({ track: { uri: "foo", duration: 100 } });
    });


});
