const async = require('async');
const request = require('superagent');

var equipment = require('./equipment.json')
var mongoose = require('mongoose'); //引用mongoose模块
var db = mongoose.createConnection('127.0.0.1', 'test'); //创建一个数据库连接
// var db = mongoose.createConnection('nobey.cn', 'tjcu'); //创建一个数据库连接
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function() {
  //一次打开记录
  console.log('ok')
});

var roomdf = new mongoose.Schema({
  '楼': String,
  '宿舍号': String,
  '电费': String,
  '状态': String,
});
var roomdfModel = db.model('roomdf', roomdf);

var list = []

  Object.keys(equipment).map((name)=>{
    Object.keys(equipment[name]).map((room)=>{
      var l = []
      l.push(name)
      l.push(room)
      l.push(equipment[name][room].id)
      list.push(l)
    })
  })


  async.mapLimit(list, 300, function (a, callback) {
    var name = a[0], id = a[2], room = a[1]
    request
      .get('http://172.16.0.3/info/equipmentTree.action?roomId=' + id.toString())
      .end((err, res) => {
        callback(null)
        console.log(name+'-'+room+'-'+id)
        if(!typeof(obj)=="object" ){
          console.log(res)
          console.log('http返回出错')
          return
        }
        if(!res.hasOwnProperty('body')) {
          console.log('错误'+id)
          console.log(res)
          return
        }

      })

  }, function (err, result) {
    console.log('final:');
  });
