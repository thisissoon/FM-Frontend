"use strict";

describe("FM.alert", function() {
    var $rootScope, $scope, AlertService;

    beforeEach(function(){
        module("FM.alert");
    });

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200);
    }));

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $rootScope = $rootScope;

        AlertService = $injector.get("AlertService");

        $controller("AlertCtrl", {
            $scope: $scope,
            AlertService: AlertService
        });
    }));

    it("should attach alerts to scope", function() {
        expect($scope.alerts).toEqual(AlertService.alerts);
        expect($scope.closeAlert).toEqual(AlertService.remove);
    });

});
