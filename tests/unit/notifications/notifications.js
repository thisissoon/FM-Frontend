"use strict";

describe("FM.notifications", function (){
    var service, $rootScope, $q, $httpBackend, $notification, PlayerTransportResource, TracksResource, UsersResource,
        user, current, track, spy;

    beforeEach(module("FM.notifications", function ($provide){
        $provide.value("$notification", jasmine.createSpy("$notificationSpy"));
    }));

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_

        current = {"player": { "elapsed_time": 10 }, "track": {"album": {"id": "d7b737a9-d70b-49a9-9f42-8c204b342000", "images": [{"url": "http://placehold.it/640x629?text=Album+Art", "width": 640, "height": 629}, {"url": "http://placehold.it/300x295?text=Album+Art", "width": 300, "height": 295}, {"url": "http://placehold.it/64x63?text=Album+Art", "width": 64, "height": 63}], "name": "Boston", "uri": "spotify:album:2QLp07RO6anZHmtcKTEvSC"}, "name": "More Than a Feeling", "uri": "spotify:track:1QEEqeFIZktqIpPI4jSVSF", "play_count": 0, "artists": [{"id": "8c22640a-02ef-4ee0-90eb-87c9c9a2534f", "uri": "spotify:artist:29kkCKKGXheHuoO829FxWK", "name": "Boston"}], "duration": 285133, "id": "0739b113-ad3a-47a4-bea9-edb00ba192f5"}, "user": {"family_name": "Light", "display_name": "Alex Light", "avatar_url": "http://placehold.it/400", "spotify_playlists": null, "given_name": "Alex", "id": "16369f65-6aa5-4d04-8927-a77016d0d721"}};
        user =  {"family_name": "Light", "display_name": "Alex Light", "avatar_url": "http://placehold.it/400", "spotify_playlists": null, "given_name": "Alex", "id": "16369f65-6aa5-4d04-8927-a77016d0d721"};
        track = {"album": {"id": "d7b737a9-d70b-49a9-9f42-8c204b342000", "images": [{"url": "http://placehold.it/640x629?text=Album+Art", "width": 640, "height": 629}, {"url": "http://placehold.it/300x295?text=Album+Art", "width": 300, "height": 295}, {"url": "http://placehold.it/64x63?text=Album+Art", "width": 64, "height": 63}], "name": "Boston", "uri": "spotify:album:2QLp07RO6anZHmtcKTEvSC"}, "name": "More Than a Feeling", "uri": "spotify:track:1QEEqeFIZktqIpPI4jSVSF", "play_count": 0, "artists": [{"id": "8c22640a-02ef-4ee0-90eb-87c9c9a2534f", "uri": "spotify:artist:29kkCKKGXheHuoO829FxWK", "name": "Boston"}], "duration": 285133, "id": "0739b113-ad3a-47a4-bea9-edb00ba192f5"};

        $httpBackend.whenGET(/.*player\/current/).respond(200, current);
        $httpBackend.whenGET(/.*users.*/).respond(200, user);
        $httpBackend.whenGET(/.*tracks.*/).respond(200, track);

    }));

    beforeEach(inject(function (_$rootScope_, $injector){

        $rootScope = _$rootScope_;

        $q = $injector.get("$q");

        service = $injector.get("Notifications");

        $notification = $injector.get("$notification");

        PlayerTransportResource = $injector.get("PlayerTransportResource");
        spyOn(PlayerTransportResource, "get").and.callThrough();

        TracksResource = $injector.get("TracksResource");
        spyOn(TracksResource, "get").and.callThrough();

        UsersResource = $injector.get("UsersResource");
        spyOn(UsersResource, "get").and.callThrough();

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should display notification on add event", function(){
        $rootScope.$broadcast("fm:player:add", {}, { uri: "foo", user: "bar" });
        $httpBackend.flush();
        $rootScope.$digest();
        expect($notification).toHaveBeenCalled();
    });

    it("should display notification on play event", function(){
        $rootScope.$broadcast("fm:player:play");
        $httpBackend.flush();
        $rootScope.$digest();
        expect($notification).toHaveBeenCalled();
    });
});
