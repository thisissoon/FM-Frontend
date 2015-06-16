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
        jasmine.clock().install();

        spyOn($interval, "cancel");
    }));


    describe("timer", function(){

        beforeEach(function () {
            jasmine.clock().mockDate(new Date());
            TrackTimer.start(5000);
        });

        afterEach(function () {
            TrackTimer.stop();
        });

        it("should start timer and update elapsedTime", function(){
            jasmine.clock().tick(1000);
            $interval.flush(1000);

            expect(TrackTimer.timerInstance).toEqual(jasmine.any(Object));
            expect(TrackTimer.elapsedTime).toEqual(1000);
            expect(TrackTimer.percent).toEqual(20);
        });

        it("should stop timer when duration is reached", function(){
            spyOn(TrackTimer, "stop");
            jasmine.clock().tick(5000);
            $interval.flush(5000);

            expect(TrackTimer.stop).toHaveBeenCalled();
        });

        it("should cancel timer", function(){
            $interval.flush(1000);
            TrackTimer.stop();

            expect($interval.cancel).toHaveBeenCalledWith(TrackTimer.timerInstance);
        });

        it("should reset timer", function(){
            TrackTimer.reset();
            expect(TrackTimer.elapsedTime).toEqual(0);
            expect(TrackTimer.percent).toEqual(0);
        });

        it("should restart timer if called twice", function(){
            // 1st timer
            spyOn(TrackTimer, "stop");
            spyOn(TrackTimer, "reset");
            jasmine.clock().tick(4000);
            $interval.flush(4000);
            expect(TrackTimer.elapsedTime).toEqual(4000);

            // start again
            TrackTimer.start(5000);

            // stop and reset timer
            expect(TrackTimer.stop).toHaveBeenCalled();
            expect(TrackTimer.reset).toHaveBeenCalled();

            // 2nd timer
            jasmine.clock().tick(1000);
            $interval.flush(1000);

            expect(TrackTimer.elapsedTime).toEqual(1000);
            expect(TrackTimer.percent).toEqual(20);
        });

    });

    describe("timer started with elapsed time", function(){

        beforeEach(function () {
            jasmine.clock().mockDate(new Date());
            TrackTimer.start(5000, 1000);
        });

        afterEach(function () {
            TrackTimer.stop();
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
