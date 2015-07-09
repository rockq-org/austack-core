var Q = require('q');
var weimiCfg = require('../../config/').weimi;
var SuperAgent = require('superagent');
var QueryString = require('querystring');
var _ = require('lodash');

module.exports = {
  sendSMSByCid: sendSMSByCid,
  sendSMSByContent: sendSMSByContent,
  replaceText: replaceText
};

function sendSMSByCid(mobile, verifyCode) {
  var d = Q.defer();

  var postData = {
    cid: weimiCfg.cid,
    p1: verifyCode,
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
      if (err) {
        d.reject(err);
      } else {
        d.resolve();
      }
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
      if (err) {
        d.reject(err);
      } else {
        d.resolve();
      }
    });

  return d.promise;
}

// var template = '【<%=APP_NAME %>】您的验证码是：<%= VERIFY_CODE %>，3分钟内有效。如非您本人操作，可忽略本消息。';
// var list = {
//   'APP_NAME': 'Austack',
//   'VERIFY_CODE': verifyCode
// };
function replaceText(template, list) {
  var compiled = _.template(template);
  return compiled(list);
}
