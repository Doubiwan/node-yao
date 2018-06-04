var responseJSON = function(res, ret) {
  if (typeof ret === 'undefined') {
    res.json({
      code: '-200',
      msg: '操作失败'
    });
  } else if (typeof ret === 'object') {
    res.send(ret);
  } else {
    res.json(JSON.parse(ret));
  }
};

module.exports = responseJSON;