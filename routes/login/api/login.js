var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var querystring = require('querystring')
var https = require('https')
var dbConfig = require('../../../db/DBConfig');
var userSql = require('../../../db/user/userSql');

var pool = mysql.createPool(dbConfig.mysql);

var responseJSON = require('../../../utils/responseJSON');

//获取openID的参数
var params = {
  appid: 'wx638146298c5759cd',
  secret: '1353f92ecb5b94db2ebbc7c397275558',
  grant_type: 'authorization_code'
};

//通过code返回sessionId
router.post('/', function(req, resPOST, next) {
  var content = Object.assign(params, req.body);
  var url = 'https://api.weixin.qq.com/sns/jscode2session?' + querystring.stringify(content);
  var req = https.get(url, function(resGET) {
    var result0 = '';
    resGET.on('data', function(chunk) {
      result0 += chunk;
    });
    resGET.on('end', function() {
      console.log('result0 = ', result0);

      if (result0 && JSON.parse(result0).errcode) {
        var error = {
          code: '-200',
          msg: '操作失败',
          data: result0
        };
        responseJSON(resPOST, error);
      } else {
        // 从连接池获取连接
        pool.getConnection(function(err, connection) {
          var openID = JSON.parse(result0).openid;
          console.log('openID = ', openID);

          connection.query(userSql.getUserByOpenID, [openID], function(err, result1) {

            console.log('result1 = ', result1, 'err= ', err);
            console.log('openID = ', openID);

            if (result1 && result1.length === 0) {
              console.log('openID = ', openID);
              connection.query(userSql.insert, [openID, null, '', ''], function(err, result2) {

                var response = {};
                console.log('result2 = ', result2, 'err = ', err);
                if (result2) {
                  response = {
                    code: 200,
                    msg: '成功添加新用户信息',
                    data: result0
                  };
                } else {
                  response = {
                    code: -200,
                    msg: '操作失败'
                  };
                }
                responseJSON(resPOST, response);
                connection.release();

              })

            } else {
              result1 = {
                code: '200',
                msg: '登陆成功'
              };
              responseJSON(resPOST, result1);
              connection.release();
            }
          })
        })
      }


    })
  });

  req.on('error', function(e) {
    console.log('problem with request:' + e.message)
  })

});

module.exports = router;
