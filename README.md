# electric-charge
---
>天津商业大学 电费 查询 api

> 查询地址是 http://172.16.0.3/

---
## 抓取接口

* 获取楼列表和id `GET/POST`  http://172.16.0.3/info/findBuilding.action

* 获取楼的层数 `GET/POST`  http://172.16.0.3/info/findFloor.action?buildingId=`楼id`  

* 获取房间列表 `GET/POST`  http://172.16.0.3/info/findRoomByBuildingMsg.action?buildingId= `楼id` &buildingFloor= `楼层`

* 查询 电表编号 `GET` http://172.16.0.3/info/equipmentTree.action?roomId=`房间id`

* 查询电表电费 `POST`  http://172.16.0.3/info/findSurplusElectricByMeterSearchPower.action `x-www-from` 参赛 `equipmentInfoId`: `电表编号`

---

## 思路
---

先根据以上接口把所以宿舍和电表编号对应的关系的关系建立数据库

然后在  

* 增加转发查询电费接口  
* 定时批量查询
* 根据查询信息对电费波动进行分析
