// 百度地图API功能  rUoqq66ovAVG4y9FN6WvaQxznUMz8tsN

var searchtype = ''; //检索类型
var map = new BMap.Map("allmap");
var point = new BMap.Point(113.910584, 23.070095); //地图中心
map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
map.addControl(new BMap.OverviewMapControl()); //添加缩略地图控件
map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
map.centerAndZoom(point, 12); //地图默认缩放级别
map.setMinZoom(12);
map.setMaxZoom(18);
var bounds = map.getBounds();
$.getJSON('https://dg.esf.fang.com/map/?mapmode=y&district=&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=' + bounds.Le + '&y1=' + bounds.Xd + '&x2=' + bounds.He + '&y2=' + bounds.Vd + '&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=12&a=ajaxSearch&city=dg&searchtype=' + searchtype, function(data) {
    drawCircle(data);
    console.log('town')
});


// 定义构造函数并继承Overlay
function CustomOverlay(center, name, text, comarea) {
    this._center = center;
    this._name = name;
    this._text = text;
    this._comarea = comarea;
}

// 继承API BMap.Overlay
CustomOverlay.prototype = new BMap.Overlay();

// 绘制覆盖物
CustomOverlay.prototype.draw = function() {
    // 根据地理坐标转换为像素坐标，并设置给容器
    var position = this._map.pointToOverlayPixel(this._center);
    this._div.style.left = position.x - 10 + 'px';
    this._div.style.top = position.y - 10 + 'px';
}

// 实现显示方法
CustomOverlay.prototype.show = function() {
    if (this._div) {
        this._div.style.display = '';
    }
}

// 实现隐藏方法
CustomOverlay.prototype.hide = function() {
    if (this._div) {
        this._div.style.display = 'none';
    }
}

// 画圆
function drawCircle(data) {
    // 初始化自定义覆盖物
    CustomOverlay.prototype.initialize = function(map) {
            // 保存map对象实例
            this._map = map;
            // 创建div元素，作为自定义覆盖物的容器
            var div = document.createElement("div");
            div.style.position = 'absolute';
            // 根据参数设置元素外观
            div.style.MozUserSelect = 'none';
            div.style.borderRadius = "100%";
            div.style.height = '74px';
            div.style.width = '74px';
            div.style.zIndex = '2147483647';
            div.style.cursor = 'pointer';

            var son = document.createElement("ul");
            $(son).addClass('lpNum');
            $(son).css({
                'width': '74px',
                'height': '74px',
                'display': 'block',
                'z-index': '2147483647',
                'position': 'absolute'
            });

            $(son).append('<li><a data-comarea="' + this._comarea + '">' + this._name + this._text + '</a></li>');

            var that = this;
            div.appendChild(son);
            $(div).mousemove(function() {
                $(this).css("z-index", "999999");
                getBoundary(that._comarea);
            });
            $(div).mouseout(function() {
                $(this).css("z-index", "999900");
            });

            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素
            return div;
        }
        // 创建Map实例
        // var pointArray = [];
    if (typeof(data.loupan.hit) == 'undefined') { return false };
    for (var i = 0; i < data.loupan.hit.length; i++) {
        var sub = data.loupan.hit[i];
        var longitude = sub['x'];
        var latitude = sub['y'];
        var name = sub['projname'];
        var text = '<br>' + sub['price'] + '元/㎡<br>' + sub['tao'] + '套';
        var comarea = sub['baidu_coord'];
        var point = new BMap.Point(longitude, latitude);
        var marker = new CustomOverlay(point, name, text, comarea);
        // pointArray.push(point);
        map.addOverlay(marker);
    }
    //让所有点在视野范围内
    // map.setViewport(pointArray);
}

//画矩形(样式未写好)
function drawRectangle(data) {
    // 初始化自定义覆盖物
    CustomOverlay.prototype.initialize = function(map) {
            // 保存map对象实例
            this._map = map;
            // 创建div元素，作为自定义覆盖物的容器
            var div = document.createElement("div");
            div.style.position = 'absolute';

            var son = document.createElement("div");
            $(son).addClass('lpTip');
            $(son).append('<a>' + this._text + '<div></div> <span class="dis" style="display: none;">' + this._name + '</span></a>');

            div.appendChild(son);
            $(div).mousemove(function() {
                $(this).css("z-index", "999999");
                $(this).find('.dis').css('display', 'block');
            });
            $(div).mouseout(function() {
                $(this).find('.dis').hide();
                $(this).css("z-index", "999900");
            });

            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素
            return div;
        }
        // 创建Map实例
        // var pointArray = [];
    if (typeof(data.loupan.hit) == 'undefined') { return false };
    for (var i = 0; i < data.loupan.hit.length; i++) {
        var sub = data.loupan.hit[i];
        var longitude = sub['x'];
        var latitude = sub['y'];
        var name = sub['projname'];
        var text = sub['price'] + '元/㎡' + sub['tao'] + '套';
        var point = new BMap.Point(longitude, latitude);
        var marker = new CustomOverlay(point, name, text);
        // pointArray.push(point);
        map.addOverlay(marker);
    }
    //让所有点在视野范围内
    // map.setViewport(pointArray);
}

//画行政区域
function getBoundary(data) {
    var boundaries = data.split(",");
    var count = boundaries.length; //行政区域的点有多少个
    if (count < 1) {
        return false;
    }
    var pointArray = [];
    for (var i = 0; i < count; i++) {
        var ply = new BMap.Polygon(boundaries[i], { strokeWeight: 2, strokeColor: "#f00", fillColor: "#f33", fillOpacity: .1 }); //建立多边形覆盖物
        map.addOverlay(ply); //添加覆盖物
        pointArray = pointArray.concat(ply.getPath());
    }
}


/**
 * 地图操作
 * 
 **/
//缩放操作
map.addEventListener("zoomend", function(evt) {
    var offsetPoint = new BMap.Pixel(evt.offsetX, evt.offsetY);   //记录鼠标当前点坐标
    var zoom = map.getZoom();
    var bounds = map.getBounds();
    console.log(zoom)
    switch (zoom) {
        case 10:
        case 11:
        case 12:
            map.clearOverlays();
            $.getJSON('https://dg.esf.fang.com/map/?mapmode=y&district=&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=' + bounds.Le + '&y1=' + bounds.Xd + '&x2=' + bounds.He + '&y2=' + bounds.Vd + '&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=' + zoom + '&a=ajaxSearch&city=dg&searchtype=' + searchtype, function(data) {
                drawCircle(data);
                console.log('town')
            });
            break;
        case 13:
        case 14:
        case 15:
            map.clearOverlays();
            $.getJSON('https://dg.esf.fang.com/map/?mapmode=y&district=&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=' + bounds.Le + '&y1=' + bounds.Xd + '&x2=' + bounds.He + '&y2=' + bounds.Vd + '&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=' + zoom + '&a=ajaxSearch&city=dg&searchtype=' + searchtype, function(data) {
                drawCircle(data);
                console.log('area')
            });
            break;
        case 16:
        case 17:
        case 18:
            map.clearOverlays();
            $.getJSON('https://dg.esf.fang.com/map/?mapmode=y&district=&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=' + bounds.Le + '&y1=' + bounds.Xd + '&x2=' + bounds.He + '&y2=' + bounds.Vd + '&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=' + zoom + '&a=ajaxSearch&city=dg&searchtype=' + searchtype, function(data) {
                drawRectangle(data);
                console.log('estate')
            });
            break;
    }
});




//拖拽操作
var geolocation = new BMap.Geolocation(); //返回用户当前的位置

geolocation.getCurrentPosition(function(r) {
    if (this.getStatus() === BMAP_STATUS_SUCCESS) { //调用成功
        map.panTo(r.point);
        // map.centerAndZoom(r.point, 15);
        var centerPixel = map.pointToOverlayPixel(map.getCenter());
        //通过设置地图的中心点，使定位点显示在手机上部分区域
        map.setCenter(map.overlayPixelToPoint({
            x: centerPixel.x,
            y: centerPixel.y
        }));
        map.addEventListener('dragend', function() {
            //获得移动之后地图中心点的像素位置
            var pixel = map.pointToOverlayPixel(map.getCenter());
            //获得定位图标所在位置在地图上的地理位置，
            //实际上定位图标的像素位置就在地图中心像素位置相应的偏移量处
            var Point = map.overlayPixelToPoint({
                x: pixel.x,
                y: pixel.y
            });
            console.info('当前位置', Point);
            var zoom = map.getZoom();
            var searchtype = ''
            switch (zoom) {
                case 10:
                case 11:
                case 12:
                    searchtype = 'city';
                    break;
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                    searchtype = 'loupan';
                    break;
            }
            var bounds = map.getBounds();
            console.log('可视区域', bounds);
            $.getJSON('https://dg.esf.fang.com/map/?mapmode=y&district=&subwayline=&subwaystation=&price=&room=&area=&towards=&floor=&hage=&equipment=&keyword=&comarea=&orderby=30&isyouhui=&x1=' + bounds.Le + '&y1=' + bounds.Xd + '&x2=' + bounds.He + '&y2=' + bounds.Vd + '&newCode=&houseNum=&schoolDist=&schoolid=&ecshop=&groupedmode=4&PageNo=1&zoom=' + zoom + '&a=ajaxSearch&city=dg&searchtype=' + searchtype, function(data) {
                switch (zoom) {
                    case 16:
                    case 17:
                    case 18:
                        console.log('drawRectangle')
                        map.clearOverlays();
                        drawRectangle(data);
                        break;
                    default:
                        map.clearOverlays();
                        drawCircle(data);
                }
            });
        });
    } else {
        alert('failed' + this.getStatus());
    }
});