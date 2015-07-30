var Q = require('q');
var weimiCfg = require('../../config/').sms.weimi;
var SuperAgent = require('superagent');
var QueryString = require('querystring');
var _ = require('lodash');
var S = require('string');
var SmsRecordModel = require('./SmsRecord.model.js').model;

module.exports = {
  sendVerificationCode: sendVerificationCode,
  generateVerificationCode: generateVerificationCode
};

// 四位数字验证码
function generateVerificationCode() {
  return Math.floor(Math.random() * (9999 - 1000) + 1000);
}

/**
 * 【金矢科技】 %arg1% - 验证码：%arg2%。请在%arg3%分钟内用于登录验证。

%arg1% | 第一个 %P% : APP名字

%arg2% | 第二个 %P% : 验证码值

%arg3% | 第三个 %P% ：验证码有效分钟数
 * @param  {[type]} mobile     [description]
 * @param  {[type]} appName    [description]
 * @param  {[type]} verifyCode [description]
 * @param  {[type]} period     [description]
 * @return {[type]}            [description]
 */
function sendVerificationCode(sendData, logData) {
  var d = Q.defer();

  var mobile = sendData.mobile;
  var appName = sendData.appName;
  var verifyCode = sendData.verifyCode;
  var period = sendData.period;

  var postData = {
    cid: weimiCfg.cid,
    p1: appName,
    p2: verifyCode,
    p3: period,
    uid: weimiCfg.uid,
    pas: weimiCfg.pas,
    mob: mobile,
    // con: content, // '【微米】您的验证码是：610912，3分钟内有效。如非您本人操作，可忽略本消息。'
    type: 'json'
  };

  var content = QueryString.stringify(postData);

  /**
   * 短信下发接口二详情
   * http://www.weimi.cc/dev-sms.html
   * @param  {[type]} err  [description]
   * @param  {[type]} res) {                       if (err) {                d.reject(err);            } else {                console.log(res);                d.resolve();            }        } [description]
   * @return {[type]}      [description]
   */
  SuperAgent.post('http://api.weimi.cc/2/sms/send.html')
    .send(content)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Content-Length', content.length)
    .end(function (err, res) {
      var str = "【金矢科技】 {{appName}} - 验证码：{{verifyCode}}。请在{{period}}分钟内用于登录验证。"

      logData.content = S(str).template(sendData).s; // add content for logData
      if (err) {
        logData.status = 'failed'; // add failed status for logData
        d.reject();
      } else {
        logData.status = 'success'; // add success status for logData
        d.resolve();
      }

      SmsRecordModel.insertSmsRecord(logData);
    });

  return d.promise;
}

// text: '{"code":0,"msg":"短信接口调用成功，该短信有人工审核"}'
function sendSMSByContent(mobile, content) {
  var d = Q.defer();

  var postData = {
    // cid: weimiCfg.cid,
    // p1: verifyCode,
    uid: weimiCfg.uid,
    pas: weimiCfg.pas,
    mob: mobile,
    con: content, // '【微米】您的验证码是：610912，3分钟内有效。如非您本人操作，可忽略本消息。'
    type: 'json'
  };

  var content = QueryString.stringify(postData);

  /**
   * 短信下发接口二详情
   * http://www.weimi.cc/dev-sms.html
   * @param  {[type]} err  [description]
   * @param  {[type]} res) {                       if (err) {                d.reject(err);            } else {                console.log(res);                d.resolve();            }        } [description]
   * @return {[type]}      [description]
   */
  SuperAgent.post('http://api.weimi.cc/2/sms/send.html')
    .send(content)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Content-Length', content.length)
    .end(function (err, res) {
      var str = "【金矢科技】 {{appName}} - 验证码：{{verifyCode}}。请在{{period}}分钟内用于登录验证。"

      logData.content = S(str).template(sendData).s; // add content for logData
      if (err) {
        logData.status = 'failed'; // add failed status for logData
        d.reject();
      } else {
        logData.status = 'success'; // add success status for logData
        d.resolve();
      }

      SmsRecordModel.insertSmsRecord(logData);
    });

  return d.promise;
}

// var template = '【<%=APP_NAME %>】您的验证码是：<%= VERIFY_CODE %>，3分钟内有效。如非您本人操作，可忽略本消息。';
// var list = {
//   'APP_NAME': 'Austack',
//   'VERIFY_CODE': verifyCode
// };
// function replaceText(template, list) {
//   var compiled = _.template(template);
//   return compiled(list);
// }