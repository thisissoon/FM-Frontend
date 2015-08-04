"use strict";

describe("FM.auth.GoogleAuthService", function() {

    var service, $httpBackend, $rootScope, $q, $auth, UsersResource,
        currentRequest, user;

    beforeEach(function (){
        module("FM.auth.GoogleAuthService");
    });

    beforeEach(inject(function (_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        user = { id: "foo" };

        currentRequest = $httpBackend.whenGET(/.*\/users\/authenticated/);

        currentRequest.respond(200, user);

    }));

    beforeEach(inject(function ( _$rootScope_, $injector ) {

        $rootScope = _$rootScope_;
        $q = $injector.get("$q");
        $auth = $injector.get("$auth");
        UsersResource = $injector.get("UsersResource");

        service = $injector.get("GoogleAuthService");

    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });


    it("should load user", function () {
        var data = null;
        service.loadUser().then(function (response){
            data = response;
        });
        $httpBackend.flush();
        $rootScope.$digest();

        expect(service.getUser().id).toEqual(user.id);
        expect(data.id).toEqual(user.id);
    });



});
