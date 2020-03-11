# findHouseByMap 地图找房
### 本项目仅供学习参考

# 完成进度
    * 缩放检索
    * 拖拽检索
    * 行政区域划分

# 项目图示
    ![Image text](https://github.com/Jefsky/findHouseByMap/blob/master/img/20200305145548.png)
    ![Image text](https://github.com/Jefsky/findHouseByMap/blob/master/img/20200305145548.png)
    ![Image text](https://github.com/Jefsky/findHouseByMap/blob/master/img/20200305145548.png)


# 百度地圖api
http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference_3_0.html#a0b0

# 房天下 
## PC 
https://dg.esf.fang.com/map/
https://www.fang.com/hezuo_file/house/hezuo2014/search.htm
https://static.soufunimg.com/map/ditu/js/map.js?v=2019122701
    alias: {
                jquery: 'jquery/jquery-1.11.1.min',
                BMapLib: 'bmap/BMapLib-min'
            },
百度地图


### 关键js 
https://static.soufunimg.com/map/ditu/js/??bmap/BMap.js?_2019122701,autodiv/autodiv.js?_2019122701,modules/esf/SFMap.js?_2019122701,modules/esf/dhjs.js?_2019122701,modules/esf/suggest.js?_2019122701
https://static.soufunimg.com/map/ditu/js/??modules/SFUtil.js?_2019122701,modules/esf/MapApi.js?_2019122701,lazyload/lazyload.js?_2019122701,scrollbar/scrollbar.js?_2019122701

### 接口
* 城市地区经纬
https://dg.esf.fang.com/map/?a=getDistArea&city=gz
* 城市地铁
https://dg.esf.fang.com/map/?a=getSubway&city=dg
* 城市地区楼盘套数接口
https://dg.esf.fang.com/map/?mapmode=y&district=&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=113.097682&y1=22.912863&x2=114.20152&y2=23.173058&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=12&a=ajaxSearch&city=dg&searchtype=city
* 地区楼盘套数接口
https://dg.esf.fang.com/map/?mapmode=y&district=800&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=113.515279&y1=22.97771&x2=113.791238&y2=23.042775&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=14&a=ajaxSearch&city=dg&searchtype=
* 地区楼盘接口
https://dg.esf.fang.com/map/?mapmode=y&district=100&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=17408&orderby=30&isyouhui=&x1=113.67489&y1=23.008064&x2=113.74388&y2=23.02433&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=16&a=ajaxSearch&city=dg&searchtype=loupan
https://dg.esf.fang.com/map/?mapmode=y&district=&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=113.584556&y1=23.049196&x2=113.722536&y2=23.083244&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=15&a=ajaxSearch&city=dg&searchtype=
* 拖拽
https://dg.esf.fang.com/map/?mapmode=y&district=&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=113.804792&y1=23.037902&x2=113.873782&y2=23.057623&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=16&a=ajaxSearch&city=dg&searchtype=other

* 接口样本
https://dg.esf.fang.com/map/?mapmode=y&district=800&keyword=&orderby=30&x1=113.515279&y1=22.97771&x2=113.791238&y2=23.042775&groupedmode=4&PageNo=1&zoom=14&a=ajaxSearch&city=dg&searchtype=

## 小程序 
腾讯地图

## APP 
百度地图

---

# 链家 
## PC 
https://dg.lianjia.com/ditu
    <script>
    ljConf = {
            city_id: '441900',
            city_abbr: 'dg',
            city_name: '东莞',
            channel: 'ditu',
            feroot: '//s1.ljcdn.com/feroot/',
            page: 'ditu_index',
            pageConfig: {"ajaxroot":"https:\/\/ajax.api.lianjia.com\/","imAppid":"LIANJIA_WEB_20160624","imAppkey":"6dfdcee27d78b1107fceeca55d80b7bd"}
        };
        </script>
    <script type="text/javascript" src="//api.map.baidu.com/api?v=2.0&ak=dASz7ubuSpHidP1oQWKuAK3q"></script>
https://www.idataapi.cn/product/detail/134
https://gitee.com/liu_peng_yu/Fast-LianJia-Crawler
百度地图

## 小程序 
百度地图

## APP 
百度地图

------

# Q房网 
## PC 
https://dongguan.qfang.com/map/sale
	<script src="/themes/default/scripts/frontend/map/MapAround.js?qv=1579095567676" type="text/javascript"></script>
    Qfang.MapAround={_getPointByAngle:function(a,g,c,f){var b=111700;var e=Math.cos(f*2*Math.PI/360)*c/(b*Math.cos(g*2*Math.PI/360))+a;var d=Math.sin(f*2*Math.PI/360)*c/b+g;return new BMap.Point(e,d);}...
百度地图

## 小程序 
腾讯地图

## APP 
百度地图

---

# 安居客 
## PC 
https://dg.anjuke.com/map/sale/?from=SearchBar
<div class="map-bmap-wrap">
<script type="text/javascript"  src="//api.map.baidu.com/api?v=2.0&ak=vf6eaN6mYdB3ScABsPWlkqmZ1NU9r3mg&s=1"></script>
<script type="text/javascript"  src="//api.map.baidu.com/library/DistanceTool/1.2/src/DistanceTool_min.js"></script>
百度地图

## 小程序 
腾讯地图

## APP 
高德地图

---

# 贝壳找房 
## PC 
https://dg.ke.com/ditu
<script>
    ljConf = {
        city_id: '441900',
        city_abbr: 'dg',
        city_name: '东莞',
        channel: 'ditu',
        page: 'ditu_index',
        pageConfig: {"ajaxroot":"\/\/ajax.api.ke.com\/","imAppid":"BEIKE_WEB_20170105","imAppkey":"2d7e19fe599aa5087b4d46948e552e89"},
        feroot: '//s1.ljcdn.com/pegasus/',
        domainConfig: {"webroot":"\/\/bj.ke.com\/","wwwroot":"\/\/www.ke.com\/","ajaxapiroot":"https:\/\/ajax.api.ke.com\/","apiroot":"\/\/ajax.ke.com\/","festaticroot":"\/\/cms.ke.com\/static\/","videoroot":"\/\/video.ljcdn.com\/","feroot":"\/\/s1.ljcdn.com\/pegasus\/","ferootnew":"\/\/s1.ljcdn.com\/pegasus\/","newsroot":"\/\/news.ke.com\/","userroot":"\/\/user.ke.com\/","fangroot":"\/\/bj.fang.ke.com\/","agentroot":"\/\/agent.lianjia.com\/","version":"2020021817381794f","pageconfig":{"ajaxroot":"\/\/ajax.api.ke.com\/","imAppid":"BEIKE_WEB_20170105","imAppkey":"2d7e19fe599aa5087b4d46948e552e89"},"imgroot":null,"behaviors":[]},
        ucid:'',
        hasDitie: '1'
    };
</script>



## 小程序 
腾讯地图

## APP 
百度地图

---

# 地图搜租房
https://house-map.cn/#/
