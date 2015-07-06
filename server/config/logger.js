'use strict';

// level = 'log', 'trace', 'debug', 'info', 'warn', 'error'
var level = process.env.LOG_LEVEL || "log";

GLOBAL.logger = require('tracer').console({
  level: level,
  format: "{{timestamp}} {{path}}:{{line}} \n <{{title}}> {{message}}"
});

// useage
// at any file or place
if (true) {
  logger.log('router');
  logger.trace('hello', 'world');
  logger.debug('hello %s', 'world', 123);
  logger.info('hello %s %d', 'world', 123, {
    foo: 'bar'
  });
  logger.warn('hello %s %d %j', 'world', 123, {
    foo: 'bar'
  });
  logger.error('hello %s %d %j', 'world', 123, {
    foo: 'bar'
  }, [1, 2, 3, 4], Object);
}
