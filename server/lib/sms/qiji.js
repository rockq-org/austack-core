/**
 * SMS Channel provided by Shen Zhen 7G Tong Xun
 */

var Q = require('q');
var cfg = require('../../config/').sms.qiji;
var crypto = require('crypto');
var shasum = crypto.createHash('sha1');
var SuperAgent = require('superagent');
var QueryString = require('querystring');
var nonceGen = require('nonce')();
var util = require('util');

module.exports = {
  sendVerificationCode: sendVerificationCode,
  generateVerificationCode: generateVerificationCode
};

// 四位数字验证码
function generateVerificationCode() {
  return Math.floor(Math.random() * (9999 - 1000) + 1000);
}

var sha1sum = function (input) {
  return shasum.update(input).digest('base64')
}

/**
 * Get password digest
 */
function getPasswordDigest() {
  var d = new Date();
  var result = {
    nonce: nonceGen(),
    created: util.format('%s-%s-%sT%s:%s:%sZ', d.format('yyyy'), d.format('mm'), d.format('dd'), d.format('HH'), d.format('MM'), d.format('ss'))
  };
  var digest = sha1sum(result.nonce + result.created + cfg.password);
  result.passwordDigest = digest;
  return result;
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
function sendVerificationCode(mobile, appName, verifyCode, period, logData) {
  mobile = String(mobile);
  appName = String(appName);
  verifyCode = String(verifyCode);
  period = String(period);

  logger.log(mobile, appName, verifyCode, period);
  var d = Q.defer();

  var pwdDigest = getPasswordDigest();

  var xwsse = util.format('UsernameToken Username="%s", PasswordDigest="%s", Nonce="%s", Created="%s"', cfg.username, pwdDigest.passwordDigest, pwdDigest.nonce, pwdDigest.created);
  logger.log('sendVerificationCode start');
  // API Docs
  // https://github.com/arrking/austack-docs/blob/master/SMS/%E6%A8%A1%E6%9D%BF%E7%9F%AD%E4%BF%A1%E5%8D%8F%E8%AE%AE.doc
  SuperAgent.post(cfg.api)
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .set('Authorization', 'WSSE realm="SDP", profile="UsernameToken", type="Username"')
    .set('X-WSSE', xwsse)
    .send({
      "srcId": cfg.srcId,
      "destId": mobile,
      "templateSmsId": cfg.templateSmsId,
      "argsNum": 3,
      "args": [appName, verifyCode, period]
    })
    .end(function (err, res) {
      if (err) {
        d.reject();
      } else {
        d.resolve();
      }
    });

  return d.promise;

  function insertSmsRecord (data) {
    // {
 //   content: String, // sms content
 //   type: String, // system(dave), app(linda)
 //   mobile: String,
 //   clientId: String,
 //   appUserId: String,
 //   ownerId: String,
 //   status: String // success, failed
 // };
  }
}

// logger.debug('send sms ..')
// sendVerificationCode('18959264502', 'troy', '2222', '3');