"use strict";

describe("FM.users.UserStatsCtrl", function() {

    var $rootScope, $location, $route, $scope, $filter, $q, $httpBackend,
        CHART_COLOURS, CHART_OPTIONS, UsersResource, stats, user;

    beforeEach(function (){
        module("FM.users.UserStatsCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;

        stats = {"most_played_tracks": [{"track": {"album": {"id": "0fad2b5a-e947-4d2a-81e5-f1df52389895", "spotify_uri": "spotify:album:0BFzNaeaNv4mahOzwZFGHK", "name": "Royal Blood"}, "name": "Figure It Out", "spotify_uri": "spotify:track:3MjrueDQKVr6xDDseZwhEd", "artists": [], "duration": 184053, "id": "32edd7b4-7f5d-42e3-8a0e-0b54c9f02d15"}, "total": 6}, {"track": {"album": {"id": "a1da5909-3431-4154-b412-27bee155fb59", "spotify_uri": "spotify:album:6Clg4KBsvQUwCxf9dADoIt", "name": "Crying Lightning"}, "name": "Red Right Hand", "spotify_uri": "spotify:track:4eMHHSB98QBxOECsXInbxv", "artists": [], "duration": 259813, "id": "6bd3aa37-9916-43d4-a66a-29c762f4052f"}, "total": 4}, {"track": {"album": {"id": "78cad758-bd0b-4d8b-8dd5-5ca8a5bc76ae", "spotify_uri": "spotify:album:1XOSDyhzUmOFrp3ChmYFKO", "name": "Ship To Wreck"}, "name": "Ship To Wreck", "spotify_uri": "spotify:track:6WFpbFOV9q3Aa1I9tegWNN", "artists": [], "duration": 234526, "id": "fec6875e-a58d-4616-bdb6-4984a93a404d"}, "total": 3}, {"track": {"album": {"id": "26a21322-8495-4444-94f0-f016cf2daf24", "spotify_uri": "spotify:album:4AZpJ7WG1RFcimSggc05ZC", "name": "The Warning"}, "name": "Over And Over", "spotify_uri": "spotify:track:6m5D7zGVbzAxceDXQTsRSX", "artists": [], "duration": 347880, "id": "3b227506-cdac-4495-9799-cc5bd85697b5"}, "total": 3}, {"track": {"album": {"id": "3d78823d-b4d4-4a44-8a08-dec210d8a229", "spotify_uri": "spotify:album:26Bm3PBTkGz1eIMzXsfc6g", "name": "Ritual"}, "name": "Turn The Bells", "spotify_uri": "spotify:track:1ZMPQa4U9Sx7HZna41kvpS", "artists": [], "duration": 304093, "id": "5a0b7624-43ff-4761-b30f-792ff8101e6e"}, "total": 3}, {"track": {"album": {"id": "1d3f6c97-2a68-4ddb-9959-fd2463e85543", "spotify_uri": "spotify:album:2wart5Qjnvx1fd7LPdQxgJ", "name": "Drones"}, "name": "The Globalist - Premium Only", "spotify_uri": "spotify:track:6BGxbBw5J314z6BDxbEanm", "artists": [], "duration": 607282, "id": "4ee0bbe4-4895-44d3-8025-eeb5d89596e9"}, "total": 3}, {"track": {"album": {"id": "71b5c930-1936-47e3-b13e-8273ebe4200d", "spotify_uri": "spotify:album:7x7oLEHfjiYLzLHS93G1lr", "name": "Little Black Submarines"}, "name": "Little Black Submarines - radio edit", "spotify_uri": "spotify:track:17609ifVvJ7Npd8IqVnRFc", "artists": [], "duration": 204692, "id": "9143e2e6-7695-4918-98d4-9edfbd78d2ac"}, "total": 3}, {"track": {"album": {"id": "132e8bfb-7f1c-4457-98ca-41c3867ad98d", "spotify_uri": "spotify:album:76FdMKQqoDqPf95j5vq1AJ", "name": "Why Make Sense?"}, "name": "Huarache Lights", "spotify_uri": "spotify:track:6awtKwZBUZQzBFuqxjLsjO", "artists": [], "duration": 329169, "id": "68bc5bf0-d299-41d5-be66-94be78aab599"}, "total": 2}, {"track": {"album": {"id": "562b4369-9127-4223-af2a-3021981bf5f1", "spotify_uri": "spotify:album:25irJgxRNTlyg8pUmWfDVG", "name": "Greatest Hits"}, "name": "Homeward Bound", "spotify_uri": "spotify:track:1WCx3vqkBSPhwDz584C9tk", "artists": [], "duration": 162173, "id": "df8bdcf1-008d-48b6-b306-41ad25336368"}, "total": 2}, {"track": {"album": {"id": "3d78823d-b4d4-4a44-8a08-dec210d8a229", "spotify_uri": "spotify:album:26Bm3PBTkGz1eIMzXsfc6g", "name": "Ritual"}, "name": "Bad Love", "spotify_uri": "spotify:track:6IyNytssOakxZyyhef8Rmj", "artists": [], "duration": 237920, "id": "b1bd98a0-323b-43cd-a69e-587c09d0f3ff"}, "total": 2}], "total_plays": 215, "total_play_time": 57697107, "most_played_genres": [{"total": 63, "name": "rock"}, {"total": 55, "name": "indie rock"}, {"total": 53, "name": "permanent wave"}, {"total": 38, "name": "indietronica"}, {"total": 33, "name": "folk-pop"}, {"total": 31, "name": "new rave"}, {"total": 29, "name": "indie folk"}, {"total": 26, "name": "chamber pop"}, {"total": 25, "name": "piano rock"}, {"total": 25, "name": "indie pop"}], "most_played_artists": [{"total": 24, "artist": {"id": "ec32ec9e-6c15-4a6b-8a66-a1f4a86ed31c", "uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI", "name": "Muse"}}, {"total": 9, "artist": {"id": "d01f6913-264f-40b6-9018-7a26c7fc7537", "uri": "spotify:artist:023YMawCG3OvACmRjWxLWC", "name": "The Cat Empire"}}, {"total": 9, "artist": {"id": "d2a9b543-7fa0-4438-b44a-1c32114dbceb", "uri": "spotify:artist:6ssXMmc5EOUrauZxirM910", "name": "White Lies"}}, {"total": 8, "artist": {"id": "ccf27755-ca07-4421-bc9f-5a7fa00b8624", "uri": "spotify:artist:6fBF4MULW5yMzyGaon1kUt", "name": "John Butler Trio"}}, {"total": 8, "artist": {"id": "8b292f2f-95cd-4a5c-9fa4-295ea5ab012d", "uri": "spotify:artist:7sjttK1WcZeyLPn3IsQ62L", "name": "Noel Gallagher's High Flying Birds"}}, {"total": 8, "artist": {"id": "d8ac4824-32b6-48c7-8ab5-1a0540d8ff51", "uri": "spotify:artist:3pTE9iaJTkWns3mxpNQlJV", "name": "Bombay Bicycle Club"}}, {"total": 7, "artist": {"id": "cb141ddf-4764-40c8-a368-1f0246b883fe", "uri": "spotify:artist:7Ln80lUS6He07XvHI8qqHH", "name": "Arctic Monkeys"}}, {"total": 7, "artist": {"id": "fa5bacd8-8631-4e40-83dc-32eb94a047ff", "uri": "spotify:artist:37uLId6Z5ZXCx19vuruvv5", "name": "Hot Chip"}}, {"total": 7, "artist": {"id": "fcb3373b-b5bc-4305-aa2d-b4ff60791fc6", "uri": "spotify:artist:5schNIzWdI9gJ1QRK8SBnc", "name": "Ben Howard"}}, {"total": 7, "artist": {"id": "4b4a124d-fd96-45b7-9fb5-e174e2369b26", "uri": "spotify:artist:7mnBLXK823vNxN3UWB7Gfz", "name": "The Black Keys"}}]}; // jshint ignore:line
        user = { "avatar_url": "https://lh6.googleusercontent.com/-WOwGfU-QYjE/AAAAAAAAAAI/AAAAAAAAABE/lqC4XiCND18/photo.jpg", "display_name": "James Warren", "family_name": "Warren", "given_name": "James", "id": "785bc064-0e08-4ea3-98d5-446e497bd213", "spotify_playlists": null };

        $httpBackend.whenGET(/.*users\/.*\/stats.*/).respond(200, stats);
        $httpBackend.whenGET(/.*users\/.*/).respond(200, user);
        $httpBackend.whenGET(/partials\/.*/).respond(200);
    }));


    beforeEach(inject(function ( _$rootScope_, $injector, $controller ) {
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $q = $injector.get("$q");

        $filter = $injector.get("$filter");
        $route = $injector.get("$route");

        $location = $injector.get("$location");
        $location.search = function () {
            return {
                from: "2015-01-14",
                to: "2015-01-15"
            }
        };
        spyOn($location, "search").and.callThrough();

        UsersResource = $injector.get("UsersResource");
        spyOn(UsersResource, "stats").and.callThrough();

        CHART_COLOURS = [];
        CHART_OPTIONS = {};

        var today = new Date("2015-07-01");
        jasmine.clock().mockDate(today);

        $controller("UserStatsCtrl", {
            $scope: $scope,
            $q: $q,
            $filter: $filter,
            $location: $location,
            CHART_OPTIONS: CHART_OPTIONS,
            CHART_COLOURS: CHART_COLOURS,
            UsersResource: UsersResource,
            stats: stats,
            user: user
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load views", function() {
        $location.path("/users/2448a459-1bcc-4855-9a94-504004364242");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("UserStatsCtrl");
    });

    it("should attach data to $scope", function(){
        $httpBackend.flush();
        expect($scope.stats).toEqual(stats);
        expect($scope.chartColours).toEqual(CHART_COLOURS);
    });

    it("should open datepicker", function(){
        $httpBackend.flush();
        var event = {
            preventDefault: jasmine.createSpy(),
            stopPropagation: jasmine.createSpy()
        };

        $scope.openDatepicker(event, "test");
        expect($scope.datepickerOpened.test).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();

        $scope.openDatepicker(event, "test");
        expect($scope.datepickerOpened.test).toBe(false);
    });

    describe("filter", function () {

        it("should filter from JS dates", function(){
            $scope.filter = {
                from: new Date("2015-07-01"),
                to: new Date("2015-07-02")
            };
            $httpBackend.flush();
            $scope.updateFilter();
            expect($location.search).toHaveBeenCalledWith({
                from: "2015-07-01",
                to: "2015-07-02"
            });
        });

        it("should filter from date strings", function(){
            $scope.filter = { from: "2015-07-01", to: "2015-07-02" };
            $httpBackend.flush();
            $scope.updateFilter();
            expect($location.search).toHaveBeenCalledWith({
                from: "2015-07-01",
                to: "2015-07-02"
            });
        });

        it("should clear filters", function(){
            $scope.filter = { from: undefined, to: undefined };
            $httpBackend.flush();
            $scope.updateFilter();
            expect($location.search).toHaveBeenCalledWith({ from: undefined, to: undefined, all: true });
        });

    });

    describe("init", function () {

        it("should add playTime data", function(){
            $httpBackend.flush();
            expect($scope.playTime.data).toEqual([[ 962, 962, 962, 962 ]]);
            expect($scope.playTime.labels).toEqual(["11-07-2015", "12-07-2015", "13-07-2015", "14-01-2015"]);
        });

        it("should load historic data based on start/end dates", function(){
            $httpBackend.flush();
            $scope.playTime.data = [[]];
            $scope.playTime.labels = [];

            UsersResource.stats.calls.reset();
            $scope.loadHistoricData("2015-07-14","2015-07-21");
            $httpBackend.flush();

            expect(UsersResource.stats).toHaveBeenCalledWith({ from: "2015-07-07", to: "2015-07-13", id: "785bc064-0e08-4ea3-98d5-446e497bd213" });
            expect(UsersResource.stats).toHaveBeenCalledWith({ from: "2015-06-30", to: "2015-07-06", id: "785bc064-0e08-4ea3-98d5-446e497bd213" });
            expect(UsersResource.stats).toHaveBeenCalledWith({ from: "2015-06-23", to: "2015-06-29", id: "785bc064-0e08-4ea3-98d5-446e497bd213" });
            expect($scope.playTime.data).toEqual([[ 962, 962, 962 ]]);
            expect($scope.playTime.labels).toEqual(["23-06-2015", "30-06-2015", "07-07-2015"]);
        });

    });

});
