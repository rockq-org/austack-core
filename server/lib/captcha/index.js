'use strict';

var ccap = require('ccap');

var Captcha = {
  generate: generate,
  validate: validate
};
module.exports = Captcha;

function generate() {
  var captcha = ccap({
    width: 256, //set width,default is 256
    height: 60, //set height,default is 60
    offset: 40, //set text spacing,default is 40
    quality: 50, //set pic quality,default is 50
    fontsize: 57, //set font size,default is 57
    generate: function () { //Custom the function to generate captcha text
      //generate captcha text here
      var text = Math.floor(Math.random() * (9999 - 1000) + 1000);

      return text; //return the captcha text
    }
  });

  return captcha.get();
}

function validate(captcha) {

}