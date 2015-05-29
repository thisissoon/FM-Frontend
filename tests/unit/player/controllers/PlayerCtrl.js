"use strict";

describe("FM.player.PlayerCtrl", function() {

    var $scope, PlayerService;

    beforeEach(function (){
        module("FM.player.PlayerCtrl");
    });

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();

        PlayerService = $injector.get("PlayerService");

        $controller("PlayerCtrl", {
            $scope: $scope,
            PlayerService: PlayerService
        });

    }));

    it("should have PlayerService in scope", function(){
        expect($scope.player).toEqual(PlayerService);
    });

});
