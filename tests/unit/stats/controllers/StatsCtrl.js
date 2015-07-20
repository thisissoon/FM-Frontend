"use strict";

describe("FM.stats.StatsCtrl", function() {

    var $rootScope, $location, $route, $scope, $filter, $q, $httpBackend,
        CHART_COLOURS, StatsResource, stats;

    beforeEach(function (){
        module("FM.stats.StatsCtrl");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;

        stats = {"total_play_time_per_user": [{"total": 695719855, "user": {"family_name": "French", "display_name": "Ryan French", "avatar_url": "https://lh4.googleusercontent.com/-M_7KW5W2jjM/AAAAAAAAAAI/AAAAAAAAABc/NYkXMt_LdLc/photo.jpg", "spotify_playlists": null, "given_name": "Ryan", "id": "da2f447e-1dc5-4f4f-91df-1a0d031c0532"}}, {"total": 409140445, "user": {"family_name": "Holmes", "display_name": "Florence Holmes", "avatar_url": "https://lh3.googleusercontent.com/-zijJ8z7XR-8/AAAAAAAAAAI/AAAAAAAAACk/WPtByWe1SlU/photo.jpg", "spotify_playlists": null, "given_name": "Florence", "id": "5db00514-2628-4017-99c1-01ffc601e696"}}, {"total": 362201929, "user": {"family_name": "Opare-Aryee", "display_name": "Edward Opare-Aryee", "avatar_url": "https://lh4.googleusercontent.com/-28HClpLQXVg/AAAAAAAAAAI/AAAAAAAAABI/8FS35wQA8to/photo.jpg", "spotify_playlists": null, "given_name": "Edward", "id": "fef86892-0a28-4b26-b0b3-90a1050cfffd"}}, {"total": 162213168, "user": {"family_name": "Los", "display_name": "Radek Los", "avatar_url": "https://lh6.googleusercontent.com/-aUQ5iEBtz8c/AAAAAAAAAAI/AAAAAAAAABE/k6nP8GmniHQ/photo.jpg", "spotify_playlists": null, "given_name": "Radek", "id": "e4d89664-d744-4a76-ba60-b0ba6ec92107"}}, {"total": 149930155, "user": {"family_name": "Flade", "display_name": "Fred Flade", "avatar_url": "https://lh6.googleusercontent.com/-pPH-pLvAvN4/AAAAAAAAAAI/AAAAAAAAAQc/O2UYKlZYUT0/photo.jpg", "spotify_playlists": null, "given_name": "Fred", "id": "4ad97115-c326-476f-854f-1edd854879f3"}}, {"total": 52584846, "user": {"family_name": "Bushueva", "display_name": "Lena Bushueva", "avatar_url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg", "spotify_playlists": null, "given_name": "Lena", "id": "aa06d7df-f740-45e9-a3eb-6cdb7ccf5561"}}, {"total": 52011009, "user": {"family_name": "Light", "display_name": "Alex Light", "avatar_url": "https://lh6.googleusercontent.com/-DZz9mCMYOfA/AAAAAAAAAAI/AAAAAAAAAAA/o4fsrDuZ37w/photo.jpg", "spotify_playlists": null, "given_name": "Alex", "id": "7173a85c-7a6b-451c-8baa-59d28a71c7c9"}}, {"total": 47549095, "user": {"family_name": "Warren", "display_name": "James Warren", "avatar_url": "https://lh6.googleusercontent.com/-WOwGfU-QYjE/AAAAAAAAAAI/AAAAAAAAABE/lqC4XiCND18/photo.jpg", "spotify_playlists": null, "given_name": "James", "id": "785bc064-0e08-4ea3-98d5-446e497bd213"}}, {"total": 45510290, "user": {"family_name": "Szekeres", "display_name": "Tom Szekeres", "avatar_url": "https://lh6.googleusercontent.com/-kSWoUNS2BR4/AAAAAAAAAAI/AAAAAAAAAYI/VCsGZimPG-M/photo.jpg", "spotify_playlists": null, "given_name": "Tom", "id": "0e5ac073-306c-4463-98ad-c569abee4a87"}}, {"total": 44076911, "user": {"family_name": "Reeves", "display_name": "Chris Reeves", "avatar_url": "https://lh5.googleusercontent.com/-8zjhd-e4yZA/AAAAAAAAAAI/AAAAAAAAAHM/pXsTxDpVfp4/photo.jpg", "spotify_playlists": null, "given_name": "Chris", "id": "68a1a6cd-fa05-4810-b7c6-bfee14056181"}}], "most_played_tracks": [{"track": {"album": {"id": "224d76e2-0032-44ad-bd06-34b2f80d96ad", "images": [{"url": "https://i.scdn.co/image/44013bc6d2c55c9e9f25a80916c2dca8b827364f", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/0f7ecde791b1269fb7016bc83579a707d23b2d78", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/7570c892b5e78828d916c0c20f25f52b21ce21a3", "width": 64, "height": 64}], "name": "Built on Glass", "uri": "spotify:album:2ytxqdwQ0Hn9JeQmcIWHuh"}, "name": "Talk Is Cheap", "uri": "spotify:track:0240T0gP9w6xEgIciBrfVF", "play_count": 1, "artists": [{"id": "0e1a6a57-0d0f-44f5-a044-71f0ac759412", "uri": "spotify:artist:2Q0MyH5YMI5HPQjFjlq5g3", "name": "Chet Faker"}], "duration": 218067, "id": "5cff97f0-57d1-4b2a-87fe-495bd718112b"}, "total": 24}, {"track": {"album": {"id": "25a0b399-4c46-4c56-a949-8f8ffa4d3162", "images": [{"url": "https://i.scdn.co/image/96590356c51b9bda71e511dc14688761dea5276d", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/98acf9b0e2d0c2c747fc0931275a72bcc8f99577", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/5ea41d60b0337fee3515337aa2418189e7205668", "width": 64, "height": 64}], "name": "Swimming Pool", "uri": "spotify:album:0n80SGeQBh7uq5zV0arvIb"}, "name": "Swimming Pool", "uri": "spotify:track:33ZalDbUq8NC7K3kWBxD2x", "play_count": 3, "artists": [{"id": "e551b487-8913-4b9a-b34e-cb88bede3b83", "uri": "spotify:artist:3BniKY9Gw01zy21IDlVhaM", "name": "Emmy The Great"}], "duration": 251233, "id": "db3d1834-e9bc-4e2b-afaf-c1b60f416250"}, "total": 19}, {"track": {"album": {"id": "03b4f064-d6bb-4785-b32a-fd617cc022b7", "images": [{"url": "https://i.scdn.co/image/e13bb2064954410756ebebf5bcab96de9cc9df39", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/57dfbcde5e19dcec384f2719f2b817fbe68a36b2", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/58f7f6dd45c79d380d05d4800f10fc11466bfbdf", "width": 64, "height": 64}], "name": "Complete Surrender", "uri": "spotify:album:7fVx3hAAvTmVtgUaM4gsxZ"}, "name": "Tears Of Joy", "uri": "spotify:track:6998HctHLAgH1CRtgKWZHW", "play_count": 1, "artists": [{"id": "aad2940b-ae97-4fac-a583-802562a1759c", "uri": "spotify:artist:75Kh0eqgzo9f43Dan1JzSV", "name": "Slow Club"}], "duration": 245117, "id": "09fe11cc-7664-4f0d-b329-9ca3a19b66f2"}, "total": 16}, {"track": {"album": {"id": "28a09211-94c5-4c14-ac06-6ab45a1d3102", "images": [{"url": "https://i.scdn.co/image/a97fbeb430377d1b48ebdb732a25c845d42c02f2", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/253157431b75893dc7242d95743995c4bf67a34e", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/e0cf840aa3c0e5d65da5eaaa222ef823c30ea77e", "width": 64, "height": 64}], "name": "Cupid Deluxe", "uri": "spotify:album:3KIRi1cU8yt3w7xhmiyehM"}, "name": "You're Not Good Enough", "uri": "spotify:track:3UNPA9XgUNAStNazmC67yF", "play_count": 3, "artists": [{"id": "0e0df9a1-09bd-4720-b0e0-23473dfc6dc6", "uri": "spotify:artist:6LEeAFiJF8OuPx747e1wxR", "name": "Blood Orange"}], "duration": 261360, "id": "12b5f732-c99b-4847-afc0-1083eb0c22fd"}, "total": 15}, {"track": {"album": {"id": "2d37f79e-ce21-4b4d-bc3c-48178f536c74", "images": [{"url": "https://i.scdn.co/image/9071b0c84be069d0d65906891042951885415419", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/2b81daeda94ae2e9ead8301708bce23b9ed240d8", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/a5b45080c7ddf65f9ba68fa58f897b2da76096bf", "width": 64, "height": 64}], "name": "Need You Now", "uri": "spotify:album:7rNb5nJIS8wi8hWbtkFphz"}, "name": "Need You Now", "uri": "spotify:track:6GQqMvqxGaSgF6WW5joxBI", "play_count": 0, "artists": [{"id": "fa5bacd8-8631-4e40-83dc-32eb94a047ff", "uri": "spotify:artist:37uLId6Z5ZXCx19vuruvv5", "name": "Hot Chip"}], "duration": 285565, "id": "6765d50f-ddec-4a9b-877a-debc3012ae23"}, "total": 15}, {"track": {"album": {"id": "2d392dc2-fcf9-49d1-ac67-f62a8b8610e5", "images": [{"url": "https://i.scdn.co/image/cf4cfbfb52e8f44147dd3a1be1e43c1b9b82e0c4", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/85d3156047162d83b77b95ee2029203c63e074c9", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/66406ce2a8572fc06c1816af06a7a956ad4f9d60", "width": 64, "height": 64}], "name": "Portraits", "uri": "spotify:album:4nNZ5UJCzhlfJbip0SDLI1"}, "name": "Steal", "uri": "spotify:track:0pAiyIHt9DyHOjWgF41kp6", "play_count": 0, "artists": [{"id": "63810709-b20d-4957-a48e-45a526783eaf", "uri": "spotify:artist:7zrkALJ9ayRjzysp4QYoEg", "name": "Maribou State"}, {"id": "48223d13-cc61-425c-a2f4-354dc250c998", "uri": "spotify:artist:5vssQp6TyMHsx4mihKVAsC", "name": "Holly Walker"}, {"id": "113d798b-080a-4391-9726-a07cfd09db07", "uri": "spotify:artist:23usQJ95w7f95tnN4MJEgy", "name": "Jono McCleery"}, {"id": "14274c37-9d2e-4bd9-99a5-6b3f91701192", "uri": "spotify:artist:4ijvN5KmKBcNXDYMP6X9E0", "name": "Pedestrian"}], "duration": 219945, "id": "7040a605-7534-45a5-9568-8829a8cd2a62"}, "total": 14}, {"track": {"album": {"id": "7dd691a4-283c-427a-a12b-44515c68a62d", "images": [{"url": "https://i.scdn.co/image/82d79ec3a4d55217bede2dbb614537c05ebbf066", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/6326ce05bf54ded1481b6ce90700750a50f1d16c", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/adbd085829ab5ccb4bb261ee80c722cd966cbbbd", "width": 64, "height": 64}], "name": "We Are The People", "uri": "spotify:album:2RPgY0JDnX1IBnmn9wM0LQ"}, "name": "We Are the People", "uri": "spotify:track:1JqTcOjOn7gEpeC0JcRVPa", "play_count": 1, "artists": [{"id": "edc928bf-d37d-4a3e-900a-54aacfe57c50", "uri": "spotify:artist:67hb7towEyKvt5Z8Bx306c", "name": "Empire Of The Sun"}], "duration": 272174, "id": "b67470fc-67c3-4401-8a30-afe89afbc077"}, "total": 14}, {"track": {"album": {"id": "73854e09-5439-4469-bd61-47969443d89b", "images": [{"url": "https://i.scdn.co/image/27e4186157529d8008f9e64969c71fedf032a030", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/fc87b0c0a179418f55341a737d604d04d77e1b05", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/63e1749a0572272fcb1b86bce0b2aeb784ff8f8c", "width": 64, "height": 64}], "name": "Ivory", "uri": "spotify:album:4naKAO4pgQN4Suh8xIYuYH"}, "name": "Ivory", "uri": "spotify:track:6PumjgRiPRyK8qsTELwfnr", "play_count": 0, "artists": [{"id": "373b8d7d-95ed-4ed6-b247-07edacaeecd5", "uri": "spotify:artist:3x7BaW5q1SDNv6bVrbOCmX", "name": "Movement"}], "duration": 222339, "id": "c4ad4b64-8223-43d8-b21e-d73d63be39be"}, "total": 13}, {"track": {"album": {"id": "5824fbc6-3081-45e0-9ff8-b4a2412dd27b", "images": [{"url": "https://i.scdn.co/image/9bfbbb51ae08dc6ac29eb884032923f7be2f34a9", "width": 640, "height": 640}, {"url": "https://i.scdn.co/image/04da6dfc1f5f45fdeba938a0cc71cf372524fd43", "width": 300, "height": 300}, {"url": "https://i.scdn.co/image/2070dddce121c3432e5ee0495393def3451d3925", "width": 64, "height": 64}], "name": "This Is All Yours", "uri": "spotify:album:6TbkWAqqY4nhQnYim61IU8"}, "name": "Hunger Of The Pine", "uri": "spotify:track:3Z0YN50RzRtmYre1bRG8H6", "play_count": 1, "artists": [{"id": "85cc1b44-7d56-40e3-8e34-a1cef50eb360", "uri": "spotify:artist:3XHO7cRUPCLOr6jwp8vsx5", "name": "alt-J"}], "duration": 299710, "id": "8b5e7426-8d76-4022-a67d-6cc6b9dbcb25"}, "total": 13}, {"track": {"album": {"id": "4ccc5ac9-d779-4312-a5ac-b3b29f3775dd", "images": [{"url": "https://i.scdn.co/image/4a4324f6d3f2d2fc210c50e47630df032197b3e5", "width": 640, "height": 637}, {"url": "https://i.scdn.co/image/298a995e98d5d7ed8b98e0625237f61856f2cad6", "width": 300, "height": 299}, {"url": "https://i.scdn.co/image/70680738d4935a6d7643f6169a475378bc260cd0", "width": 64, "height": 64}], "name": "Black Light", "uri": "spotify:album:1auJY23R5KD9YEgrvE3HQM"}, "name": "Paper Romance", "uri": "spotify:track:5JSt5uOkjLDMqWNTzVSMXX", "play_count": 4, "artists": [{"id": "fb1e8e6a-48e4-49b4-87e6-3c4df0e44b93", "uri": "spotify:artist:67tgMwUfnmqzYsNAtnP6YJ", "name": "Groove Armada"}], "duration": 379746, "id": "c04ae8ac-64df-4274-be55-416ed40a6a8d"}, "total": 13}], "most_active_djs": [{"total": 2613, "user": {"family_name": "French", "display_name": "Ryan French", "avatar_url": "https://lh4.googleusercontent.com/-M_7KW5W2jjM/AAAAAAAAAAI/AAAAAAAAABc/NYkXMt_LdLc/photo.jpg", "spotify_playlists": null, "given_name": "Ryan", "id": "da2f447e-1dc5-4f4f-91df-1a0d031c0532"}}, {"total": 1688, "user": {"family_name": "Holmes", "display_name": "Florence Holmes", "avatar_url": "https://lh3.googleusercontent.com/-zijJ8z7XR-8/AAAAAAAAAAI/AAAAAAAAACk/WPtByWe1SlU/photo.jpg", "spotify_playlists": null, "given_name": "Florence", "id": "5db00514-2628-4017-99c1-01ffc601e696"}}, {"total": 1444, "user": {"family_name": "Opare-Aryee", "display_name": "Edward Opare-Aryee", "avatar_url": "https://lh4.googleusercontent.com/-28HClpLQXVg/AAAAAAAAAAI/AAAAAAAAABI/8FS35wQA8to/photo.jpg", "spotify_playlists": null, "given_name": "Edward", "id": "fef86892-0a28-4b26-b0b3-90a1050cfffd"}}, {"total": 681, "user": {"family_name": "Los", "display_name": "Radek Los", "avatar_url": "https://lh6.googleusercontent.com/-aUQ5iEBtz8c/AAAAAAAAAAI/AAAAAAAAABE/k6nP8GmniHQ/photo.jpg", "spotify_playlists": null, "given_name": "Radek", "id": "e4d89664-d744-4a76-ba60-b0ba6ec92107"}}, {"total": 553, "user": {"family_name": "Flade", "display_name": "Fred Flade", "avatar_url": "https://lh6.googleusercontent.com/-pPH-pLvAvN4/AAAAAAAAAAI/AAAAAAAAAQc/O2UYKlZYUT0/photo.jpg", "spotify_playlists": null, "given_name": "Fred", "id": "4ad97115-c326-476f-854f-1edd854879f3"}}, {"total": 181, "user": {"family_name": "Reeves", "display_name": "Chris Reeves", "avatar_url": "https://lh5.googleusercontent.com/-8zjhd-e4yZA/AAAAAAAAAAI/AAAAAAAAAHM/pXsTxDpVfp4/photo.jpg", "spotify_playlists": null, "given_name": "Chris", "id": "68a1a6cd-fa05-4810-b7c6-bfee14056181"}}, {"total": 181, "user": {"family_name": "Light", "display_name": "Alex Light", "avatar_url": "https://lh6.googleusercontent.com/-DZz9mCMYOfA/AAAAAAAAAAI/AAAAAAAAAAA/o4fsrDuZ37w/photo.jpg", "spotify_playlists": null, "given_name": "Alex", "id": "7173a85c-7a6b-451c-8baa-59d28a71c7c9"}}, {"total": 179, "user": {"family_name": "Warren", "display_name": "James Warren", "avatar_url": "https://lh6.googleusercontent.com/-WOwGfU-QYjE/AAAAAAAAAAI/AAAAAAAAABE/lqC4XiCND18/photo.jpg", "spotify_playlists": null, "given_name": "James", "id": "785bc064-0e08-4ea3-98d5-446e497bd213"}}, {"total": 161, "user": {"family_name": "Bushueva", "display_name": "Lena Bushueva", "avatar_url": "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg", "spotify_playlists": null, "given_name": "Lena", "id": "aa06d7df-f740-45e9-a3eb-6cdb7ccf5561"}}, {"total": 152, "user": {"family_name": "Garthwaite", "display_name": "Jemima Garthwaite", "avatar_url": "https://lh4.googleusercontent.com/-0A-Jb53Dwl4/AAAAAAAAAAI/AAAAAAAAABI/dHD_vLQ3__U/photo.jpg", "spotify_playlists": null, "given_name": "Jemima", "id": "bf474a3d-333c-49c7-94d9-48ead4847e11"}}], "most_played_genres": [{"total": 1442, "name": "indie r&b"}, {"total": 937, "name": "indie rock"}, {"total": 852, "name": "pop"}, {"total": 826, "name": "chamber pop"}, {"total": 809, "name": "pop rap"}, {"total": 797, "name": "indie folk"}, {"total": 778, "name": "indietronica"}, {"total": 766, "name": "indie pop"}, {"total": 759, "name": "hip hop"}, {"total": 685, "name": "dance pop"}], "total_plays": 8089, "most_played_artists": [{"total": 137, "artist": {"id": "fa5bacd8-8631-4e40-83dc-32eb94a047ff", "uri": "spotify:artist:37uLId6Z5ZXCx19vuruvv5", "name": "Hot Chip"}}, {"total": 75, "artist": {"id": "f5001f14-5003-41ca-b481-71fe28d8a271", "uri": "spotify:artist:4MXUO7sVCaFgFjoTI5ox5c", "name": "Sufjan Stevens"}}, {"total": 60, "artist": {"id": "8fd94643-0855-4217-8707-7130a2e516db", "uri": "spotify:artist:7A0awCXkE1FtSU8B0qwOJQ", "name": "Jamie xx"}}, {"total": 60, "artist": {"id": "113d798b-080a-4391-9726-a07cfd09db07", "uri": "spotify:artist:23usQJ95w7f95tnN4MJEgy", "name": "Jono McCleery"}}, {"total": 60, "artist": {"id": "980e6491-9487-4d4c-a6e6-fe7e641a1637", "uri": "spotify:artist:360IAlyVv4PCEVjgyMZrxK", "name": "Miguel"}}, {"total": 60, "artist": {"id": "63810709-b20d-4957-a48e-45a526783eaf", "uri": "spotify:artist:7zrkALJ9ayRjzysp4QYoEg", "name": "Maribou State"}}, {"total": 59, "artist": {"id": "85cc1b44-7d56-40e3-8e34-a1cef50eb360", "uri": "spotify:artist:3XHO7cRUPCLOr6jwp8vsx5", "name": "alt-J"}}, {"total": 54, "artist": {"id": "14274c37-9d2e-4bd9-99a5-6b3f91701192", "uri": "spotify:artist:4ijvN5KmKBcNXDYMP6X9E0", "name": "Pedestrian"}}, {"total": 53, "artist": {"id": "def5742b-6707-4fbc-98ba-5bc0676ee65e", "uri": "spotify:artist:1anyVhU62p31KFi8MEzkbf", "name": "Chance The Rapper"}}, {"total": 50, "artist": {"id": "5f847390-8e83-4b74-b7f1-516df7799fd4", "uri": "spotify:artist:2YZyLoL8N0Wb9xBt1NhZWg", "name": "Kendrick Lamar"}}], "total_play_time": 2087374418};

        $httpBackend.whenGET(/.*player\/stats.*/).respond(200, stats);
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
                from: "2015-01-01",
                to: "2015-02-02"
            }
        };
        spyOn($location, "search").and.callThrough();

        StatsResource = $injector.get("StatsResource");
        spyOn(StatsResource, "get").and.callThrough();

        CHART_COLOURS = [];

        $controller("StatsCtrl", {
            $scope: $scope,
            $q: $q,
            $filter: $filter,
            $location: $location,
            CHART_COLOURS: CHART_COLOURS,
            StatsResource: StatsResource,
            stats: stats
        });
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it("should load views", function() {
        $location.path("/stats");
        $rootScope.$digest();
        $httpBackend.flush();
        expect($route.current.controller).toBe("StatsCtrl");
    });

    it("should attach data to $scope", function(){
        $httpBackend.flush();
        expect($scope.totalPlays).toEqual(stats.total_plays);
        expect($scope.totalPlayTime).toEqual(stats.total_play_time);
        expect($scope.topTracks).toEqual(stats.most_played_tracks);
        expect($scope.topArtists).toEqual(stats.most_played_artists);
        expect($scope.topGenres).toEqual(stats.most_played_genres);
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

    it("should update filter", function(){
        $httpBackend.flush();

        // filter as js dates
        $scope.filter = {
            from: new Date("2015-07-01"),
            to: new Date("2015-07-02")
        };
        $scope.updateFilter();
        expect($location.search).toHaveBeenCalledWith({
            from: "2015-07-01",
            to: "2015-07-02"
        });

        // filter as date strings
        $scope.filter = { from: "2015-07-01", to: "2015-07-02" };
        $scope.updateFilter();
        expect($location.search).toHaveBeenCalledWith({
            from: "2015-07-01",
            to: "2015-07-02"
        });
    });

    describe("init", function () {

        it("should default filter to last week", function(){
            var today = new Date("2015-07-01");
            jasmine.clock().mockDate(today);
            $scope.search = {};

            $scope.init();
            $httpBackend.flush();
            expect($scope.filter.from).toEqual(new Date("2015-06-17"));
            expect($scope.filter.to).toEqual(new Date("2015-06-24"));
        });

        it("should add active DJ data to dataset", function(){
            $httpBackend.flush();
            expect($scope.activeDj.labels).toEqual(["Ryan French","Florence Holmes","Edward Opare-Aryee","Radek Los","Fred Flade"]);
            expect($scope.activeDj.data).toEqual([ 2613, 1688, 1444, 681, 553 ]);
        });

        it("should add playTime data to dataset", function(){
            $httpBackend.flush();
            expect($scope.playTime.data).toEqual([ [ 11595, 11595, 11595, 11595 ], [ 6819, 6819, 6819, 6819 ], [ 6037, 6037, 6037, 6037 ], [ 2704, 2704, 2704, 2704 ], [ 2499, 2499, 2499, 2499 ] ]);
            expect($scope.playTime.labels).toEqual([ "27-03-2015", "28-04-2015", "30-05-2015", "01-01-2015" ]);
        });

        it("should load historic data based on start/end dates", function(){
            $httpBackend.flush();
            $scope.playTime.data = [];
            $scope.playTime.labels = [];
            $scope.loadHistoricData("2015-07-14","2015-07-21");
            $httpBackend.flush();
            expect($scope.playTime.data).toEqual([ [ 11595, 11595, 11595 ], [ 6819, 6819, 6819 ], [ 6037, 6037, 6037 ], [ 2704, 2704, 2704 ], [ 2499, 2499, 2499 ] ]);
            expect($scope.playTime.labels).toEqual([ "23-06-2015", "30-06-2015", "07-07-2015" ]);
        });

    });

});
