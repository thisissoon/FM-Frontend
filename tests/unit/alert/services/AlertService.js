"use strict";

describe("FM.alert", function() {
    var $rootScope, $scope, AlertService, mockAlert;

    beforeEach(function(){
        module("FM.alert.AlertService");
    });

    beforeEach(inject(function ($httpBackend) {
        $httpBackend.whenGET(/.*/).respond(200);
    }));

    beforeEach(inject(function ( $rootScope, $injector ) {
        $scope = $rootScope.$new();
        $rootScope = $rootScope;

        AlertService = $injector.get("AlertService");

        mockAlert = {
            message: "Woah there! You need to be logged in.",
            type: "warning"
        };
    }));

    it("should add alert", function() {
        AlertService.set(mockAlert.message, mockAlert.type);
        expect(AlertService.alerts).toEqual([mockAlert]);
    });

    it("should remove one alert", function() {
        AlertService.set(mockAlert.message, mockAlert.type);
        AlertService.set(mockAlert.message, mockAlert.type);

        AlertService.remove(0);
        expect(AlertService.alerts.length).toBe(1);
        AlertService.remove(0);
        expect(AlertService.alerts.length).toBe(0);
    });

});
