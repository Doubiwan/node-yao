var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../../../db/DBConfig');
var userSql = require('.././../../db/user/userSql');
var userTimeSql = require('../../../db/userTime/userTimeSql');
var cardRecordSql = require('../../../db/cardRecord/cardRecordSql');

var formatTime = require('../../../utils/formatTime');
var responseJSON = require('../../../utils/responseJSON');
var pool = mysql.createPool(dbConfig.mysql);

// 返回抽奖结果
router.post('/', function(req, res, next) {
  var params = req.body;
  var shakeList = ['GUANG_GAO', 'ZI_DONG_HUA', 'SHU_MEI', 'GUANG_YAN'];

  // 更新抽卡记录表
  var randomResult = Math.random();
  console.log('randomResult = ', randomResult);
  var shakeResult = '';
  if (randomResult < 0.8 || randomResult === 0) {
    shakeResult = shakeList[0];
  } else if (randomResult < 0.9 && randomResult >= 0.8) {
    shakeResult = shakeList[1];
  } else if (randomResult < 0.95 && randomResult >= 0.9) {
    shakeResult = shakeList[2];
  } else if (randomResult <= 1 && randomResult >= 0.95) {
    shakeResult = shakeList[3];
  }


  //从连接池获取连接
  pool.getConnection(function(err, connection) {

    console.log('shakeResult = ', shakeResult);

    // 建立连接  根据userId更新用户次数表
    connection.query(userTimeSql.getInfoByDateTime, formatTime, function(err, result) {
      console.log('result = ', result, 'err = ', err);
      if (result && result.length === 0) {
        //更新抽卡记录表
        connection.query(cardRecordSql.insert, [formatTime, params.userID, shakeResult, null], function(err, result1) {
          console.log('result1 = ', result1, 'err = ', err);
          if (result1) {
            console.log('插入cardRecord成功', result1);
          }
        });

        //更新用户次数表
        connection.query(userTimeSql.insert, [null, params.userID, 9, 0, formatTime, shakeResult !== 'GUANG_GAO', null], function(err, result2) {
          console.log(err);
          if (result2) {
            result2 = {
              code: '200',
              msg: '添加记录成功',
              curDefaultNum: 9
            };
            responseJSON(res, result2);
            connection.release();
          }
        })
      } else if (result[0].defaultNum + result[0].addNum === 0) {
        var response = {
          code: '-200',
          msg: '您的剩余次数为0',
          curDefaultNum: 0
        };
        responseJSON(res, response);
        connection.release();
      } else {
        if (result[0].defaultNum === 1) {
          shakeResult = shakeResult === 'GUANG_GAO' ? shakeList[Math.floor(Math.random() * 2 + 1)] : shakeResult;
        }

        // 更新抽卡记录表
        connection.query(cardRecordSql.insert, [formatTime, params.userID, shakeResult, null], function(err, result3) {
          if (result3) {
            console.log('插入cardRecord成功', result3);
          }
        });

        var getFlag = result[0].getFlag || shakeResult !== 'GUANG_GAO';
        var curDefaultNum = result[0].defaultNum === 0 ? 0 : --result[0].defaultNum;
        // 更新用户次数表
        connection.query(userTimeSql.updateByIDDate, [curDefaultNum, getFlag, result[0].userID, formatTime], function(err, result4) {
          if (result4) {
            result4 = {
              code: '200',
              msg: 'ok',
              data: {
                cardType: shakeResult,
                curDefaultNum: curDefaultNum
              }
            };
            responseJSON(res, result4);
            connection.release();
          }
        })

      }

    })
  });

});

module.exports = router;