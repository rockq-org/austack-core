var Q = require('q');
var weimiCfg = require('../../config/').weimi;
var SuperAgent = require('superagent');
var QueryString = require('querystring');

module.exports = {
  sendVerifyCode: sendVerifyCode
};

function sendVerifyCode(mobile, verifyCode) {
  var d = Q.defer();

  var postData = {
    uid: weimiCfg.uid,
    pas: weimiCfg.pas,
    cid: weimiCfg.cid,
    p1: verifyCode,
    mob: mobile,
    // use cid instead.
    // con: '【微米】您的验证码是：610912，3分钟内有效。如非您本人操作，可忽略本消息。',
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
