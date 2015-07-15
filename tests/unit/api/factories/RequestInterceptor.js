"use strict";

describe("FM.api.RequestInterceptor", function (){
    var interceptor, httpProvider, config, $window, $location, rootScope, spy, AlertService,
        fakeCallback, localStorageValue, FM_API_SERVER_ADDRESS, ERRORS;

    beforeEach(function (){
        module("FM.api.RequestInterceptor", function ($httpProvider){
            httpProvider = $httpProvider;
        });
    });

    beforeEach(inject(function ( $rootScope, $injector ){

        $rootScope.routeChanging = true;
        rootScope = $rootScope;

        config = $injector.get("satellizer.config");

        config.tokenPrefix = undefined;
        config.tokenName = "bar";
        config.authHeader = "Access-Token";

        localStorageValue = "mockAccessToken";
        fakeCallback = function(){ return localStorageValue };

        $window = $injector.get("$window");
        $window.localStorage = {
            getItem: function(){},
            setItem: function(){},
            clear: function(){}
        }
        spyOn($window.localStorage, "getItem").and.callFake(fakeCallback);
        spyOn($window.localStorage, "setItem").and.callFake(fakeCallback);
        spyOn($window.localStorage, "clear").and.callFake(function(){ localStorageValue = undefined });

        FM_API_SERVER_ADDRESS = $injector.get("env").FM_API_SERVER_ADDRESS;
        ERRORS = $injector.get("ERRORS");

        $location = $injector.get("$location");
        spy = spyOn($location, "path");

        AlertService = $injector.get("AlertService");
        spyOn(AlertService, "set");

        interceptor = $injector.get("RequestInterceptor");
        spyOn(interceptor, "request").and.callThrough();

    }));

    it("$http service should contain request interceptor", function(){
        expect(httpProvider.interceptors).toContain("RequestInterceptor");
    });

    describe("Redirect to error pages", function(){

        it("should redirect to 500 page on response error", function(){
            interceptor.responseError({ status: 500, config: { url: FM_API_SERVER_ADDRESS } })
            expect($location.path).toHaveBeenCalledWith("/500");
        });

        it("should NOT redirect to 500 page on response success", function(){
            interceptor.responseError({ status: 200, config: { url: FM_API_SERVER_ADDRESS } })
            expect($location.path).not.toHaveBeenCalled();
        });

        it("should redirect to 401 page on 401 response status", function(){
            interceptor.responseError({ status: 401, config: { url: FM_API_SERVER_ADDRESS } })
            expect($location.path).toHaveBeenCalledWith("/401");
        });

        it("should NOT redirect to error pages if route is not changing", function(){
            rootScope.routeChanging = false;
            interceptor.responseError({ status: 401, config: { url: FM_API_SERVER_ADDRESS } })
            expect($location.path).not.toHaveBeenCalled();
        });
    });

    describe("Trigger AlertService for in-view errors", function(){

        it("should call AlertService for 401 in view error", function(){
            rootScope.routeChanging = false;
            interceptor.responseError({ status: 401, config: { url: FM_API_SERVER_ADDRESS } })
            expect(AlertService.set).toHaveBeenCalledWith(ERRORS.STATUS_401_MESSAGE, "warning");
        });

        it("should call AlertService for 403 in view error", function(){
            rootScope.routeChanging = false;
            interceptor.responseError({ status: 403, config: { url: FM_API_SERVER_ADDRESS } })
            expect(AlertService.set).toHaveBeenCalledWith(ERRORS.STATUS_403_MESSAGE, "danger");
        });

        it("should call AlertService for 404 in view error", function(){
            rootScope.routeChanging = false;
            interceptor.responseError({ status: 404, config: { url: FM_API_SERVER_ADDRESS } })
            expect(AlertService.set).toHaveBeenCalledWith(ERRORS.STATUS_404_MESSAGE, "info");
        });

        it("should call AlertService for unknown in view error", function(){
            rootScope.routeChanging = false;
            interceptor.responseError({ status: 405, statusText: "unknown", data: { message: "some error" }, config: { url: FM_API_SERVER_ADDRESS } })
            expect(AlertService.set).toHaveBeenCalledWith("unknown: some error", "warning");
        });
    });

    it("should set Access-Token header from local storage", function(){
        var httpConfig = {
            url: FM_API_SERVER_ADDRESS,
            headers: {}
        };
        var request = interceptor.request(httpConfig);
        expect($window.localStorage.getItem).toHaveBeenCalled();
        expect(request.headers["Access-Token"]).toEqual("mockAccessToken");
    });

    it("should NOT set Access-Token header if no token saved", function(){
        $window.localStorage.clear();
        var httpConfig = {
            url: FM_API_SERVER_ADDRESS,
            headers: {}
        };
        var request = interceptor.request(httpConfig);
        expect(request.headers["Access-Token"]).toBe(undefined);
    });

    it("should NOT set Access-Token header if no token saved", function(){
        rootScope.$broadcast("$routeChangeStart");
        expect(rootScope.routeChanging).toBe(true);

        rootScope.$broadcast("$routeChangeSuccess");
        expect(rootScope.routeChanging).toBe(false);

        rootScope.$broadcast("$routeChangeStart");
        expect(rootScope.routeChanging).toBe(true);

        rootScope.$broadcast("$routeChangeError");
        expect(rootScope.routeChanging).toBe(false);
    });

});

