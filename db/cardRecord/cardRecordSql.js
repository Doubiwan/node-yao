var cardRecordSql = {
  insert: 'INSERT INTO cardRecord(dateTime,userID,cardType,recordID) VALUES(?,?,?,?)',
  getRecordByUserID: 'SELECT * FROM cardRecord where userID = ?'
};
module.exports = cardRecordSql;