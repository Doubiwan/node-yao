var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../../../db/DBConfig');
var userSql = require('../../../db/user/userSql');

var pool = mysql.createPool(dbConfig.mysql);

var responseJSON = require('../../../utils/responseJSON');

//上传nickName和avatarUrl
router.post('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    var params = req.body;
    connection.query(userSql.getUserByOpenID, [params.openID], function(err, result) {
      if (result && result.length === 0) {
        result = {
          code: '-200',
          msg: 'openID不存在'
        };
        console.log('result = ', result);
        responseJSON(res, result);
        connection.release();
      } else {
        connection.query(userSql.update, [params.nickName, params.avatarUrl, params.openID], function(err, result2) {
          console.log('result2 = ', result2);
          if (result2) {
            result2 = {
              code: '200',
              msg: 'ok'
            }
          }
          responseJSON(res, result2);
          connection.release();
        })
      }
    })
  })

});

module.exports = router;