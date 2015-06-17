"use strict";

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe("FM", function() {

    var scrollTo = function scrollTo (y) {
        return "angular.element(document).find('ng-view')[0].scrollTop =" + y;
    };

    describe("history", function() {

        beforeEach(function(){
            browser.manage().deleteAllCookies();
            browser.get("http://127.0.0.1:8000/history");
            browser.waitForAngular();
            browser.driver.sleep(2000);
        });

        it("should render history partial when user navigates to /history", function() {
            expect(element.all(by.repeater("track in history")).count()).toEqual(20);
        });

        it("should load more pages on scroll to bottom of list", function() {

            // confirm initial state
            expect(element.all(by.repeater("track in history")).count()).toEqual(20);

            // 2nd page
            browser.executeScript(scrollTo(2000));
            browser.driver.sleep(2000);

            expect(element.all(by.repeater("track in history")).count()).toEqual(40);

            // 3rd page
            browser.executeScript(scrollTo(4000));
            browser.driver.sleep(2000);

            expect(element.all(by.repeater("track in history")).count()).toEqual(60);

            // 4th page
            browser.executeScript(scrollTo(6000));
            browser.driver.sleep(2000);

            expect(element.all(by.repeater("track in history")).count()).toEqual(80);

            // 5th page - shouldn't exist
            browser.executeScript(scrollTo(8000));
            browser.driver.sleep(2000);

            expect(element.all(by.repeater("track in history")).count()).toEqual(80);
        });

    });

});
