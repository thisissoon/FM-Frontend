var pkg = require("../../package.json");

// A saucelabs reference configuration file.
exports.config = {

  // If sauceUser and sauceKey are specified, seleniumServerJar will be ignored.
  // The tests will be run remotely using SauceLabs.
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  // The timeout for each script run on the browser. This should be longer
  // than the maximum time your application needs to stabilize between tasks.
  allScriptsTimeout: 11000,

  // ----- What tests to run -----
  //
  // Spec patterns are relative to the location of this config.
  specs: [
    "specs/*.js",
  ],

  // Saucelabs capabilities reference
  // https://docs.saucelabs.com/reference/platforms-configurator/#/
  multiCapabilities: [{
    "browserName": "chrome",
    "build": process.env.CIRCLE_BUILD_NUM,
    "name": process.env.CIRCLE_PROJECT_REPONAME + " (Chrome) Build: " + process.env.CIRCLE_BUILD_NUM,
    "version": "43.0",
    "selenium-version": "2.46.0",
    "chromedriver-version": "2.14",
    "platform": "Windows 8.1",
    "screenResolution": "1280x1024"
  }, {
    "browserName": "firefox",
    "build": process.env.CIRCLE_BUILD_NUM,
    "name": process.env.CIRCLE_PROJECT_REPONAME + " (FF) Build: " + process.env.CIRCLE_BUILD_NUM,
    "version": "39.0",
    "selenium-version": "2.46.0",
    "platform": "Linux",
    "screenResolution": "1024x768"
  }, {
    "browserName": "safari",
    "build": process.env.CIRCLE_BUILD_NUM,
    "name": process.env.CIRCLE_PROJECT_REPONAME + " (Safari) Build: " + process.env.CIRCLE_BUILD_NUM,
    "version": "7.0",
    "selenium-version": "2.44.0",
    "platform": "OS X 10.9",
    "screenResolution": "1024x768"

  }, {
    "browserName": "internet explorer",
    "build": process.env.CIRCLE_BUILD_NUM,
    "name": process.env.CIRCLE_PROJECT_REPONAME + " (IE) Build: " + process.env.CIRCLE_BUILD_NUM,
    "version": "11.0",
    "selenium-version": "2.46.0",
    "platform": "Windows 8.1",
    "screenResolution": "1280x1024"
  }],

  // ----- More information for your tests ----
  //
  // A base URL for your application under test. Calls to protractor.get()
  // with relative paths will be prepended with this.
  baseUrl: "http://127.0.0.1:8000",

  // Selector for the element housing the angular app - this defaults to
  // body, but is necessary if ng-app is on a descendant of <body>
  rootElement: "html",

  // ----- The test framework -----
  //
  // Jasmine is fully supported as a test and assertion framework.
  // Mocha has limited beta support. You will need to include your own
  // assertion framework if working with mocha.
  framework: "jasmine",

  // ----- Options to be passed to minijasminenode -----
  //
  // See the full list at https://github.com/juliemr/minijasminenode
  jasmineNodeOpts: {
    // onComplete will be called just before the driver quits.
    onComplete: null,
    // If true, display spec names.
    isVerbose: true,
    // If true, print colors to the terminal.
    showColors: true,
    // If true, include stack traces in failures.
    includeStackTrace: true,
    // Default time to wait in ms before a test fails.
    defaultTimeoutInterval: 30000
  }

};
