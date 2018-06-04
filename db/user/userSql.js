var userSql = {
  insert: 'insert into user(openID,userID,nickName,avatarUrl) values(?,?,?,?)',
  update: 'update user set nickName = ?,avatarUrl = ? where openID = ?',
  getUserByOpenID: 'select * from user where openID = ?'
};
module.exports = userSql;