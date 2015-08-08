/**
 * Module for the controller definition of the application api.
 * The CaptchaController is handling /api/applications requests.
 * @module {application:controller~CapchaController} application:controller
 * @requires {@link ParamController}
 */
'use strict';

var _ = require('lodash');
var ccap = require('ccap');

var CaptchaController = {
  show: show
};
module.exports = CaptchaController;

function show(req, res) {
  var captcha = ccap({
    width: 256, //set width,default is 256
    height: 60, //set height,default is 60
    offset: 40, //set text spacing,default is 40
    quality: 100, //set pic quality,default is 50
    fontsize: 57, //set font size,default is 57
    generate: function () { //Custom the function to generate captcha text
      //generate captcha text here
      var text = '1245';
      return text; //return the captcha text
    }
  });
  res.send(captcha.get()[1]);
}