'use strict';

var assert = require('assert');
var should = require('should');
var testUtil = require('./utility');
var commonConfig = testUtil.commonConfig;
var fs = require('fs');
var webdriver = require('selenium-webdriver'),
    testing = require('selenium-webdriver/testing'),
    seleniumserver = require('./seleniumserver');


var Browser = {
  ANDROID: 'android',
  CHROME: 'chrome',
  IE: 'internet explorer',
  // Shorthand for IPAD && IPHONE when using the browsers predciate.
  IOS: 'iOS',
  IPAD: 'iPad',
  IPHONE: 'iPhone',
  FIREFOX: 'firefox',
  OPERA: 'opera',
  PHANTOMJS: 'phantomjs',
  SAFARI: 'safari',
  HTMLUNIT: 'htmlunit',
  
  // Browsers that should always be tested via the java Selenium server.
  REMOTE_CHROME: 'remote.chrome',
  REMOTE_PHANTOMJS: 'remote.phantomjs',
  REMOTE_HTMLUNIT: 'remote.htmlunit'
};


///**
// * Browsers with native support.
// * @type {!Array.<string>}
// */
//var NATIVE_BROWSERS = [
//  Browser.CHROME,
//  Browser.PHANTOMJS
//];


var browsersToTest = (function() {
//  var browsers = process.env.SELENIUM_BROWSER || Browser.REMOTE_HTMLUNIT+','+Browser.FIREFOX+','+Browser.SAFARI+','+Browser.OPERA+','+Browser.IE;
  var browsers = process.env.SELENIUM_BROWSER || Browser.REMOTE_HTMLUNIT;
  browsers = browsers.split(',');
  browsers.forEach(function(browser) {
    if (browser === Browser.IOS) {
      throw Error('Invalid browser name: ' + browser);
    }

    for (var name in Browser) {
      if (Browser.hasOwnProperty(name) && Browser[name] === browser) {
        return;
      }
    }

  throw Error('Unrecognized browser: ' + browser);
  });
  return browsers;
})();


/**
 * Creates a predicate function that ignores tests for specific browsers.
 * @param {string} currentBrowser The name of the current browser.
 * @param {!Array.<!Browser>} browsersToIgnore The browsers to ignore.
 * @return {function(): boolean} The predicate function.
 */
function browsers(currentBrowser, browsersToIgnore) {
  return function() {
    var checkIos =
        currentBrowser === Browser.IPAD || currentBrowser === Browser.IPHONE;
    return browsersToIgnore.indexOf(currentBrowser) != -1 ||
        (checkIos && browsersToIgnore.indexOf(Browser.IOS) != -1);
  };
}

//Get the correct URL for testing
var url =  (global.url === "" || global.url === undefined)? commonConfig.defaultURL : global.url;

/**
 * @param {string} browserName The name to use.
 * @param {remote.DriverService} server The server to use, if any.
 * @constructor
 */
function TestEnvironment(browserName, server) {
  var name = browserName;
  if (name.lastIndexOf('remote.', 0) == 0) {
    name = name.substring('remote.'.length);
  }
  
  var targeturl = url;
  this.__defineGetter__('targeturl', function() { return targeturl; });
  this.__defineSetter__('targeturl', function(value) { targeturl = value; });
  this.setTargetUrl =function(value){
	  targeturl = value;
  };

  var autoCreate = true;
  this.__defineGetter__(
      'autoCreateDriver', function() { return autoCreate; });
  this.__defineSetter__(
      'autoCreateDriver', function(auto) { autoCreate = auto; });

  this.__defineGetter__('browser', function() { return name; });

  var driver;
  this.__defineGetter__('driver', function() { return driver; });

  this.browsers = function(var_args) {
    var browsersToIgnore = Array.prototype.slice.apply(arguments, [0]);
    var remoteVariants = [];
    browsersToIgnore.forEach(function(browser) {
      if (browser.lastIndexOf('remote.', 0) === 0) {
        remoteVariants.push(browser.substring('remote.'.length));
      }
    });
    browsersToIgnore = browsersToIgnore.concat(remoteVariants);
    return browsers(browserName, browsersToIgnore);
  };
  
  
	//Get the config file for current test
  this.getConfigJSON = function(filename) {
		var file = testUtil.getTestConfig(filename);
		return  require(file);
  };
	

  this.builder = function() {
    assert.ok(!driver, 'Can only have one driver at a time');
    var builder = new webdriver.Builder();
    var realBuild = builder.build;

    builder.build = function() {
      builder.getCapabilities().
          set(webdriver.Capability.BROWSER_NAME, name);
      
      var serverAddr = process.env['SELENIUM_SERVER_ADDRESS'] ? process.env['SELENIUM_SERVER_ADDRESS'] : global.serverAddr;
      if (serverAddr === "" || serverAddr === undefined ||serverAddr ==''){
    	  builder.usingServer(server.address());
    	  
      }
      else{
//    	  console.log('To use server address: '+server);
    	  builder.usingServer(server);
      }

      return driver = realBuild.call(builder);
    };

    return builder;
  };

  this.createDriver = function() {
//	this.dispose();
    if (!driver) {
      driver = this.builder().build();
    }
    return driver;
  };

  this.refreshDriver = function() {
    if (driver) {
      driver.quit();
      driver = null;
    }
    this.createDriver();
  };

  this.dispose = function() {
    if (driver) {
      driver.quit();
      driver = null;
    }
  };

  this.waitForTitleToBe = function(expected) {
    driver.wait(function() {
      return driver.getTitle().then(function(title) {
        return title === expected;
      });
    }, 10000, 'Waiting for title to be ' + expected);
  };
  
  this.waitForTitleToContain = function(expected){
	  driver.wait(function() {
		  return driver.getTitle().then(function(title) {
			  return title.should.containEql(expected);
		  });
	  }, 10000, 'Waiting for title to contain ' + expected);
  };
}


var seleniumServer;
var inSuite = false;


/**
 * Expands a function to cover each of the target browsers.
 * @param {function(!TestEnvironment)} fn The top level suite
 *     function.
 * @param {{browsers: !Array.<string>}=} opt_options Suite specific options.
 */
function suite(fn, opt_options) {
  assert.ok(!inSuite, 'You may not nest suite calls');
  inSuite = true;

  var suiteOptions = opt_options || {};
  var browsers = suiteOptions.browsers;
  if (browsers) {
    // Filter out browser specific tests when that browser is not currently
    // selected for testing.
    browsers = browsers.filter(function(browser) {
      if (browsersToTest.indexOf(browser) != -1) {
        return true;
      }
      return browsersToTest.indexOf(
          browser.substring('remote.'.length)) != -1;
    });
  } else {
    browsers = browsersToTest;
  }

  try {

	  browsers.forEach(function(browser) {
    	
      testing.describe('[' + browser + ']', function() {
      
      var serverToUse = null;
      var env;
     
      var serverAddr = process.env['SELENIUM_SERVER_ADDRESS'] ? process.env['SELENIUM_SERVER_ADDRESS'] : global.serverAddr;
             
//    console.log('SELENIUM_SERVER_ADDRESS:'+ process.env.SELENIUM_SERVER_ADDRESS);
//    console.log("global.serverAddr:" +  global.serverAddr);
//    console.log("serverAddr before startserver:" + serverAddr);
      
      
      if (serverAddr === "" || serverAddr === undefined ||serverAddr =='') {
          serverToUse = seleniumServer;
          if (!serverToUse) {
            serverToUse = seleniumServer = new seleniumserver.Server();
          }
          testing.before(seleniumServer.start.bind(seleniumServer, 60 * 1000));
          env = new TestEnvironment(browser, serverToUse);
      }else{
    	  env = new TestEnvironment(browser, serverAddr);
      }
    
//     console.log("target url:" + url);
        env.setTargetUrl(url);

        testing.beforeEach(function() {
          if (env.autoCreateDriver) {
            env.createDriver();
          }
        });

        testing.after(function() {
          env.dispose();
        });

        fn(env);
      });
      
      return;
    });
  } finally {
    inSuite = false;
  }
}


// GLOBAL TEST SETUP

// Server is only started if required for a specific config.
testing.after(function() {
  if (seleniumServer) {
    seleniumServer.stop();
  }
});


// PUBLIC API


exports.suite = suite;
exports.after = testing.after;
exports.afterEach = testing.afterEach;
exports.before = testing.before;
exports.beforeEach = testing.beforeEach;
exports.it = testing.it;
exports.describe = testing.describe;
exports.ignore = testing.ignore;

exports.Browser = Browser;
exports.webdriver = webdriver;
exports.should = should;
