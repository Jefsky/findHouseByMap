// 百度地图API功能  08HppseHkx93WlQMpEzWGRUgF971DaD9

var searchtype = ''; //检索类型
var map = new BMap.Map("allmap", {
    enableMapClick: false //取消默认窗口
});
var point = new BMap.Point(113.936456, 23.044025); //地图中心
map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
map.addControl(new BMap.OverviewMapControl()); //添加缩略地图控件
map.addControl(new BMap.MapTypeControl()); //添加地图类型控件
map.centerAndZoom(point, 12); //地图默认缩放级别
map.setMinZoom(12);
map.setMaxZoom(18);
var pointArray = [];
var bounds = map.getBounds();
var city = 'dg',
    zoom = '12',
    district = '';
draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, 0, 0, 0, 0);

/**
 * draw绘制覆盖物
 * @param {地区id} district 
 * @param {bounds.Le} Le 
 * @param {bounds.Xd} Xd 
 * @param {bounds.He} He 
 * @param {bounds.Vd} Vd 
 * @param {缩放倍数} zoom 
 * @param {城市} city 
 * @param {搜索类型} searchtype 
 * @param {图形1,0} form 
 * @param {点击事件1,0} click
 * @param {中心点} center
 * @param {地图默认缩放级别1显示楼盘,0地区} centerAndZoom 
 * draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, form, click,centerAndZoom)
 */
function draw(district, Le, Xd, He, Vd, zoom, city, searchtype, form, click, center, centerAndZoom) {
    $.getJSON('https://dg.esf.fang.com/map/?mapmode=y&district=' + district + '&keyword=&orderby=30&x1=' + Le + '&y1=' + Xd + '&x2=' + He + '&y2=' + Vd + '&groupedmode=4&PageNo=1&zoom=' + zoom + '&a=ajaxSearch&city=' + city + '&searchtype=' + searchtype, function(data) {
        if (form) {
            drawRectangle(data);
        } else {
            drawCircle(data);
        }
        if (click) {
            if (centerAndZoom) {
                map.centerAndZoom(center, 17);
            } else {
                map.centerAndZoom(center, zoom + 3);
            }
        }
    });
}

// 定义构造函数并继承Overlay
function CustomOverlay(center, name, text, comarea, id) {
    this._center = center;
    this._name = name;
    this._text = text;
    this._comarea = comarea;
    this._id = id;
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

// 绘制圆形覆盖物
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

            $(son).append('<li><a data-zoneid="' + this._name + '" data-comarea="' + this._comarea + '">' + this._name + this._text + '</a></li>');

            var that = this;
            var plylist = [];
            div.appendChild(son);
            $(div).mouseover(function() {
                $(this).css("z-index", "999999");
                if (this._comarea !== ' ') {
                    plylist = addBoundary(that._comarea);
                }
            });
            $(div).mouseout(function() {
                $(this).css("z-index", "999900");
                if (this._comarea != ' ') {
                    removeBoundary(plylist);
                }
            });
            div.addEventListener("click", function(e) {
                var zoom = map.getZoom();
                map.clearOverlays();
                switch (zoom) {
                    case 15:
                        zoom = 16, searchtype = 'loupan';
                        draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, 0, 1, that._center, 1);
                        break;
                    default:
                        draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, 0, 1, that._center, 0);
                }

            })

            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素
            return div;
        }
        // 创建Map实例
    if (typeof(data.loupan.hit) == 'undefined') { return false };
    var pointArray = [];
    for (var i = 0; i < data.loupan.hit.length; i++) {
        var sub = data.loupan.hit[i];
        var longitude = sub['x'];
        var latitude = sub['y'];
        var name = sub['projname'];
        var text = '<br>' + sub['price'] + '元/㎡<br>' + sub['tao'] + '套';
        var comarea = sub['baidu_coord'];
        var point = new BMap.Point(longitude, latitude);
        var marker = new CustomOverlay(point, name, text, comarea, sub['id']);
        pointArray.push(point);
        map.addOverlay(marker);
    }
    // map.setViewport(pointArray);
}

//绘制矩形覆盖物
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
            $(div).mouseover(function() {
                $(this).css("z-index", "999999");
                $(this).find('.dis').css('display', 'block');
            });
            $(div).mouseout(function() {
                $(this).find('.dis').hide();
                $(this).css("z-index", "999900");
            });
            var that = this;
            div.addEventListener("click", function(e) {
                var zoom = map.getZoom();
                map.clearOverlays();
                switch (zoom) {
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                        zoom = 17, searchtype = 'loupan';
                        draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, 1, 1, that._center, 1);
                        break;
                }

            })

            // 将div添加到覆盖物容器中
            map.getPanes().markerPane.appendChild(div);
            // 保存div实例
            this._div = div;
            // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
            // hide方法，或者对覆盖物进行移除时，API都将操作此元素
            return div;
        }
        // 创建Map实例
    if (typeof(data.loupan.hit) == 'undefined') { return false };
    // var pointArray = [];
    for (var i = 0; i < data.loupan.hit.length; i++) {
        var sub = data.loupan.hit[i];
        var longitude = sub['x'];
        var latitude = sub['y'];
        var name = sub['projname'];
        var text = sub['price'] + '元/㎡' + sub['tao'] + '套';
        var point = new BMap.Point(longitude, latitude);
        var marker = new CustomOverlay(point, name, text, sub['id']);
        // pointArray.push(point);
        map.addOverlay(marker);
    }
    // map.setViewport(pointArray);


}

//绘制区划
function addBoundary(data) {
    var ply = new BMap.Polygon(data, { strokeWeight: 2, strokeColor: "#f00", fillColor: "#f33", fillOpacity: .1 });
    map.addOverlay(ply);
    return ply;
}

//移除区划
function removeBoundary(data) {
    map.removeOverlay(data);
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
    map.clearOverlays();
    switch (zoom) {
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
            draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, 0, 0, 0, 0);
            break;
        case 16:
        case 17:
        case 18:
            draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, 1, 0, 0, 0);
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
            var zoom = map.getZoom();
            var bounds = map.getBounds();
            map.clearOverlays();
            switch (zoom) {
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                    draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, 0, 0, 0, 0);
                    break;
                case 16:
                case 17:
                case 18:
                    searchtype = 'loupan';
                    draw(district, bounds.Le, bounds.Xd, bounds.He, bounds.Vd, zoom, city, searchtype, 1, 0, 0, 0);
                    break;
            }
        });
    } else {
        alert('failed' + this.getStatus());
    }
});