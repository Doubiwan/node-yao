var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../../../db/DBConfig');
var cardRecordSql = require('../../../db/cardRecord/cardRecordSql');

var pool = mysql.createPool(dbConfig.mysql);
var responseJSON = require('../../../utils/responseJSON');

// 返回用户信息
router.get('/', function(req, res, next) {
  console.log('req.query = ', req.query, 'req.params = ', req.params);
  var userID = req.query.userID;
  // 从连接池获取连接
  pool.getConnection(function(err, connection) {
    // 建立连接 根据userId查询用户表
    connection.query(cardRecordSql.getRecordByUserID, userID, function(err, result) {
      if (result) {
        var recordRes = { ZI_DONG_HUA: 0, SHU_MEI: 0, GUANG_YAN: 0 };
        result.forEach(function(item, index) {
          Object.keys(recordRes).find(function(key) {
            if (key === item.cardType) {
              recordRes[key]++;
            }
          })
        });

        //以Json形式，把操作结果返回给前台页面
        responseJSON(res, recordRes);

        // 释放链接
        connection.release();
      }
    });
  })
});

module.exports = router;