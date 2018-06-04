var fillZero = function(n) {
  var res = (n).toString().length === 1 ? ('0' + n) : n;
  return res;
};
var formatTime = function(t) {
  var d = new Date(t);
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var date = d.getDate();
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();
  var result = year + '-' + fillZero(month) + '-' + fillZero(date);
  return result;
};
var res = formatTime(new Date());
module.exports = res;