'use strict';

var router = require('express').Router();
var config = require('../../config/');
var CaptchaController = require('./captcha.controller');

module.exports = router;

router.get('/', CaptchaController.show);