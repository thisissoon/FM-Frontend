"use strict";

describe("FM.player.TrackTimer", function() {

    var $scope, $interval, currentTime, mockTime, TrackTimer;

    beforeEach(function (){
        module("FM.player.TrackTimer");
    });

    beforeEach(inject(function ( $rootScope, $injector, $controller ) {
        $scope = $rootScope.$new();
        $interval = $injector.get("$interval");
        TrackTimer = $injector.get("TrackTimer");
        jasmine.clock().uninstall();
        jasmine.clock().install();

        spyOn($interval, "cancel");
    }));


    describe("timer", function(){

        beforeEach(function () {
            jasmine.clock().mockDate(new Date());
            TrackTimer.start(5000);
        });

        afterEach(function () {
            TrackTimer.pause();
        });

        it("should start timer and update elapsedTime", function(){
            jasmine.clock().tick(1000);
            $interval.flush(1000);

            expect(TrackTimer.timerInstance).toEqual(jasmine.any(Object));
            expect(TrackTimer.elapsedTime).toEqual(1000);
            expect(TrackTimer.percent).toEqual(20);
        });

        it("should pause and resume timer", function(){
            jasmine.clock().tick(2000);
            $interval.flush(2000);

            TrackTimer.pause();
            TrackTimer.start(5000);

            expect(TrackTimer.elapsedTime).toEqual(2000);
            expect(TrackTimer.percent).toEqual(40);

            jasmine.clock().tick(1000);
            $interval.flush(1000);

            expect(TrackTimer.elapsedTime).toEqual(3000);
            expect(TrackTimer.percent).toEqual(60);
        });

        it("should pause timer when duration is reached", function(){
            spyOn(TrackTimer, "pause");
            jasmine.clock().tick(5000);
            $interval.flush(5000);

            expect(TrackTimer.pause).toHaveBeenCalled();
        });

        it("should cancel $interval instance", function(){
            $interval.flush(1000);
            TrackTimer.pause();

            expect($interval.cancel).toHaveBeenCalledWith(TrackTimer.timerInstance);
        });

        it("should reset timer", function(){
            spyOn(TrackTimer, "pause");
            TrackTimer.reset();

            expect(TrackTimer.elapsedTime).toEqual(0);
            expect(TrackTimer.percent).toEqual(0);
            expect(TrackTimer.pause).toHaveBeenCalled();
        });

    });

    describe("timer started with elapsed time", function(){

        beforeEach(function () {
            jasmine.clock().mockDate(new Date());
            TrackTimer.start(5000, 1000);
        });

        afterEach(function () {
            TrackTimer.pause();
        });

        it("should offset elapsed time", function(){
            jasmine.clock().tick(1000);
            $interval.flush(1000);

            expect(TrackTimer.timerInstance).toEqual(jasmine.any(Object));
            expect(TrackTimer.elapsedTime).toEqual(2000);
            expect(TrackTimer.percent).toEqual(40);
        });

    });

});
