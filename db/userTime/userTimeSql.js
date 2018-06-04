var userTimeSql = {
  insert: 'INSERT INTO userTime(timeID,userID,defaultNum,addNum,dateTime,getFlag) VALUES(?,?,?,?,?,?)',
  updateByIDDate: 'UPDATE userTime set defaultNum = ?,getFlag = ? where userID = ? AND dateTime = ?',
  getInfoByDateTime: 'SELECT * FROM userTime WHERE dateTime = ?'
};
module.exports = userTimeSql;