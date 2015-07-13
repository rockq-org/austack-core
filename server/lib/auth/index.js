/**
 * Module for registering authentication middleware.
 * Registers the local authentication provider by default.
 * @module {express.Router} auth
 * @requires {@link user:model}
 * @requires {@link auth:local}
 * @requires {@link auth:local:passport}
 */
'use strict';

var router = require('express').Router();
var config = require('../../config/');

// // export the configures express router
module.exports = router;

/**
 * The authentication model: User
 * @type {user:model~User}
 */
var User = require('../../api/user/user.model').model;
var Application = require('../../api/application/application.model').model;

// username, password in user
require('./local/passport').setup(User, config);
router.use('/local', require('./local/index'));

// clientId, clientSecret in application
// require('./application/passport').setup(Application, config);
// router.use('/application', require('./application/index'));
