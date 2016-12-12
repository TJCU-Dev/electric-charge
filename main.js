const request = require('superagent');
const fs = require('fs')


// 生成 Buildinglist.json 楼列表id
function Buildinglist_put() {
  var Buildinglist = {
    id: [],
    name: [],
    toname: {},
    toid: {}
  }
  request
    .get('http://172.16.0.3/info/findBuilding.action')
    .end((err, res) => {
      res.body.list.map((a) => {
          Buildinglist.id.push(a[0]);
          Buildinglist.name.push(a[1]);
          Buildinglist.toid[a[1]] = a[0]
          Buildinglist.toname[a[0]] = a[1]
        })
        // console.log(Buildinglist)
      fs.writeFileSync('./Buildinglist.json', JSON.stringify(Buildinglist), function(err) {
        if (err) throw err;
        console.log('has finished');
      });
    })
}
// Buildinglist_put()


// 生成 floorlist.json 楼层数对应关系
function buildingFloor() {
  const Buildinglist = require('./Buildinglist.json')
  const Buildingtoid = Buildinglist.toid

  var floorlist = {
    nameto: {},
    idto: {}
  }

  Buildinglist.name.map((name) => {
    var name = name,
      id = Buildingtoid[name];
    request
      .get('http://172.16.0.3/info/findFloor.action?buildingId=' + id)
      .end((err, res) => {
        floorlist.idto[res.body.buildingId] = res.body.buildingFloor
        floorlist.nameto[name] = res.body.buildingFloor
        fs.writeFileSync('./floorlist.json', JSON.stringify(floorlist), function(err) {
          if (err) throw err;
          console.log('has finished');
        });
      })
  })

}
// buildingFloor()

function roomlist() {
  const Buildinglist = require('./Buildinglist.json')
  const floorlist = require('./floorlist.json')
  var RoomList = {
    name: {},
    id: {}
  }

  Buildinglist.name.map((name) => {
    var name = name,
      id = Buildinglist.toid[name],
      maxfloor = floorlist.idto[id];
    for (var floor = 1; floor <= maxfloor; floor++) {
      request
        .get('http://172.16.0.3/info/findRoomByBuildingMsg.action?buildingId=' + id + '&buildingFloor=' + floor)
        .end((err, res) => {
          console.log(name + id + '--'+ floor+'楼')
          if(res.body.list == undefined) {
            console.log(res.body)
            return
          }
          res.body.list.map((a) => {
            if (RoomList.name[name] == undefined) RoomList.name[name] = {
              idto : {},
              nameto : {}
            }
            if (RoomList.id[id] == undefined) RoomList.id[id] = {
              idto : {},
              nameto : {}
            }
            RoomList.name[name].idto[a[0]] = a[1]
            RoomList.name[name].nameto[a[1]] = a[0]
            RoomList.id[id].idto[a[0]] = a[1]
            RoomList.id[id].nameto[a[1]] = a[0]

            fs.writeFileSync('./roomlist.json', JSON.stringify(RoomList), function(err) {
              if (err) throw err;
              console.log('has finished');
            });
          })
        })
    }
  })
}

roomlist()
