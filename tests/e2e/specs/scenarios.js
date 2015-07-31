"use strict";

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

var login = function login (){
    browser.executeScript("localStorage.setItem('sn_fm_access_token', 'Ijc4NWJjMDY0LTBlMDgtNGVhMy05OGQ1LTQ0NmU0OTdiZDIxMyI.CJeLpg.oPLDqjS2W-iaAKnfJ8DBwAvLx-s');");
    browser.driver.sleep(2000);
};

describe("FM", function() {

    var scrollTo = function scrollTo (y) {
        return "document.getElementsByClassName('infinite-scroll')[0].scrollTop =" + y;
    };

    describe("playlist", function() {
        beforeEach(function(){
            browser.get("http://127.0.0.1:8000/");
            browser.waitForAngular();
            browser.driver.sleep(2000);
        });

        it("should render playlist partial when user navigates to /", function() {
            expect(element.all(by.repeater("track in playlist")).count()).toEqual(4);
        });
    });

    describe("history", function() {

        it("should render history partial when user navigates to /history", function() {
            browser.manage().deleteAllCookies();
            browser.get("http://127.0.0.1:8000/history");
            browser.waitForAngular();
            browser.driver.sleep(2000);

            expect(element.all(by.repeater("track in history")).count()).toEqual(20);
        });

        it("should load more pages on scroll to bottom of list (40 items total)", function() {

            // confirm initial state
            expect(element.all(by.repeater("track in history")).count()).toEqual(20);

            // 2nd page
            browser.executeScript(scrollTo(2000));
            browser.driver.sleep(2000);

            expect(element.all(by.repeater("track in history")).count()).toEqual(40);
        });

        it("should load more pages on scroll to bottom of list (60 items total)", function() {

            // 3rd page
            browser.executeScript(scrollTo(4000));
            browser.driver.sleep(2000);

            expect(element.all(by.repeater("track in history")).count()).toEqual(60);

        });

        it("should NOT load more pages on scroll to bottom of list", function() {

            // 4th page - shouldn't exist
            browser.executeScript(scrollTo(6000));
            browser.driver.sleep(2000);

            expect(element.all(by.repeater("track in history")).count()).toEqual(60);
        });

    });

    describe("track timer", function() {

        var elapsedTime = 0;

        beforeEach(function(){
            browser.driver.manage().window().setSize(1630, 800);
            browser.get("http://127.0.0.1:8000/");
            browser.waitForAngular();
            browser.driver.sleep(2000);
        });

        it("should start track timer with current elapsed time", function() {
            element(by.css("footer fm-track .progress-bar")).getAttribute("aria-valuenow").then(function(value){
                expect(value > 5000).toBeTruthy();
            });
        });

        it("should increment elapsed time", function() {
            var startProgressWidth = 0;
            var startTime = 0;
            element(by.css("footer fm-track .progress-bar")).getCssValue("width").then(function(width){
                startProgressWidth = parseInt(width);
            });
            element(by.css("footer fm-track .progress-bar")).getAttribute("aria-valuenow").then(function(value){
                startTime = parseInt(value);
            });
            browser.driver.sleep(5000);

            // check elapsed time value in progress bar
            element(by.css("footer fm-track .progress-bar")).getAttribute("aria-valuenow").then(function(value){
                expect(parseInt(value) > startTime).toBeTruthy();
            });
            // check width of progress bar has increased
            element(by.css("footer fm-track .progress-bar")).getCssValue("width").then(function(width){
                expect(parseInt(width) > startProgressWidth).toBeTruthy();
            });

        });

        it("should pause and resume", function() {

            // login
            login();

            // pause
            element(by.css(".controls button:nth-child(2)")).click();

            var startTime = 0;
            element(by.css("footer fm-track .progress-bar")).getAttribute("aria-valuenow").then(function(value){
                startTime = parseInt(value);
            });

            browser.driver.sleep(2000);

            element(by.css("footer fm-track .progress-bar")).getAttribute("aria-valuenow").then(function(value){
                value = parseInt(value);
                expect(value).toEqual(startTime);
            });

            // resume
            element(by.css(".controls button:nth-child(1)")).click();
            browser.driver.sleep(2000);

            element(by.css("footer fm-track .progress-bar")).getAttribute("aria-valuenow").then(function(value){
                value = parseInt(value);
                expect(value > startTime).toBeTruthy();
            });
        });

    });

});
