// 百度地图API功能  08HppseHkx93WlQMpEzWGRUgF971DaD9
// lng 经度  lat 纬度

// var wrapper = $(".wrapper"),
//     mapL = $(".mapL"),
//     map_h = $(window).innerHeight() - wrapper.offset().top,
//     header_h = 89;

// var l = map_h + "px";
// wrapper.height(l), mapL.css({ "max-height": wrapper.height() })


var searchtype = ''; //检索类型
var map = new BMap.Map("mapCanvas", {
    enableMapClick: false //取消默认窗口
});
var point = new BMap.Point(113.936456, 23.044025); //地图中心
map.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
map.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })); // 添加平移缩放控件
map.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })); // 添加比例尺控件
map.addControl(new BMap.OverviewMapControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })); //添加缩略地图控件
map.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP] })); //添加地图类型控件
map.centerAndZoom(point, 12); //地图默认缩放级别
map.setMinZoom(12);
map.setMaxZoom(18);
var search = {};
search['school'] = '', search['area'] = '', search['subway'] = '', search['price'] = '', search['huxing'] = '', search['acreage'] = '', search['housetag'] = '', search['towardsWrap'] = '', search['floorWrap'] = '', search['hageWrap'] = '', search['equipmentWrap'] = '', search['keyword'];
var pointArray = [];
var bounds = map.getBounds();
var city = 'dg',
    zoom = '12',
    district = '',
    start = 1,
    form;
initDraw();

// 地图初始化展现
function initDraw() {
    map.centerAndZoom(point, 12);
    draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 0, 0, 0, 0);
}


/**
 * draw绘制覆盖物
 * @param {地区id} district 
 * @param {bounds.Ne} Ne 
 * @param {bounds.Xd} Xd 
 * @param {bounds.Je} Je 
 * @param {bounds.Zd} Zd 
 * @param {缩放倍数} zoom 
 * @param {城市} city 
 * @param {搜索类型} searchtype 
 * @param {图形1,0} form 
 * @param {点击事件1,0} click
 * @param {中心点} center
 * @param {地图默认缩放级别1显示楼盘,0地区} centerAndZoom 
 * draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, form, click,centerAndZoom)
 * http://local.fzg360.com/index.php/house/ajax_map?district=&keyword=&x1=113.384537&y1=22.89176&x2=114.488375&y2=23.196116&start=1&zoom=15&city=dg
 */
function draw(district, Ne, Xd, Je, Zd, zoom, city, searchtype, form, click, center, centerAndZoom) {
    $.getJSON("http://local.fzg360.com/index.php/house/ajax_map", { district: district, keyword: search['keyword'], school: search['school'], area: search['area'], subway: search['subway'], price: search['price'], start: start, searchtype: searchtype, city: city, zoom: zoom, huxing: search['huxing'], acreage: search['acreage'], housetag: search['housetag'], towardsWrap: search['towardsWrap'], floorWrap: search['floorWrap'], hageWrap: search['hageWrap'], equipmentWrap: search['equipmentWrap'], x1: Ne, x2: Je, y1: Zd, y2: Xd },
        function(data) {
            if (form) {
                drawRectangle(data);
            } else {
                drawCircle(data);
            }
            if (click) {
                if (centerAndZoom) {
                    map.centerAndZoom(center, 18);
                } else {
                    map.centerAndZoom(center, zoom + 3);
                }
            }
        });
}

// 移动地图搜索
$('#esf_E01_41').click(function() {
    $(this).find('div').toggleClass("on");
})

// 关键字搜索
$('#esf_E01_06').click(function() {
    search['keyword'] = $('#esf_E01_46').val();
    addCondition('keyword', search['keyword'])
})

// 关键字搜索
$(document).keypress(function(e) {　　
    if (e.keyCode == 13) {　
        search['keyword'] = $('#esf_E01_46').val();
        addCondition('keyword', search['keyword'])　　　　　　
    }
})

// 条件搜索下拉出现
function showDropdownList(obj) {
    let id = $(obj).attr('id');
    $('#' + id + 'Content').removeClass('dis');
    $(obj).find('em').addClass('up');
}

// 条件搜索下拉隐藏
function hideDropdownList(obj) {
    let id = $(obj).attr('id');
    $('#' + id + 'Content').addClass('dis');
    $(obj).find('em').removeClass('up');
}

// 选择勾选(学校)
$('#schoolDistContent>ul>li').each(function() {
    $(this).click(function() {
        $(this).find('div').toggleClass('on');
        addCondition('school', $(this).text(), $(this).find('a').attr('data-id'));
    })
})

// 新增条件
function addCondition(name, value, id) {
    if (value == '') return false;
    searchtype = 'house';
    value = $.trim(value);
    if (name == 'keyword') {
        id = value;
        let html = '<a href="javascript:void(0)" data-id="' + id + '" data-value="' + value + '" data-name="' + name + '" onClick="removeCondition(this)">' + value + '</a>';
        $('#paramContent').html(html);
        draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 1, 0, 0, 0);
        map.centerAndZoom(point, 12);
        $('#paramContainer').show();
    } else {
        if ($('a[data-name="' + name + '"][data-value="' + value + '"]').length) {
            $('a[data-name="' + name + '"][data-value="' + value + '"]').remove();
            let arr = search[name].split(',');
            arr.forEach(function(val, index) {
                if (val == id) {
                    arr.splice(index, 1);
                }
            })
            let str = arr.join(',');
            search[name] = str;
            if (!$('#paramContent a').length) {
                $('#paramContainer').hide();
                searchtype = '';
                initDraw();
            }
            console.log('search', search);
            return false;
        }
        let html = '<a href="javascript:void(0)" data-id="' + id + '" data-value="' + value + '" data-name="' + name + '" onClick="removeCondition(this)">' + value + '</a>';
        $('#paramContent').append(html);
        search[name] = '';
        $('#paramContent a[data-name="' + name + '"]').each(function() {
            let id = $(this).attr('data-id');
            let name = $(this).attr('data-name');
            if (search[name].length) {
                search[name] += ',' + id;
            } else {
                search[name] = id;
            }
        })
        $('#paramContainer').show();
        draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 1, 0, 0, 0);
        map.centerAndZoom(point, 12);
    }
}

// 删除条件
function removeCondition(obj) {
    let name = $(obj).attr('data-name');
    let value = $.trim($(obj).attr('data-value'));
    switch (name) {
        case 'keyword':
            $('#esf_E01_46').val('');
            search['keyword'] = '';
            break;
        case 'school':
            let obj;
            obj = $('#schoolDistContent :contains(' + value + ')')[1];
            $(obj).find('div').removeClass('on');
            search['school'] = '';
            break;
    }
    if (!($('#paramContent a').length - 1)) {
        $('#paramContainer').hide();
        searchtype = '';
        initDraw();
    }
    $(obj).remove();
}

// 清空条件
$('#esf_E01_67').click(function() {
    $('#esf_E01_46').val('');
    searchtype = '';
    $.each(search, function(name, value) {
        search[name] = '';
    })
    $('#paramContainer').hide();
    $('#paramContent').html('');
    initDraw();
})

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
                var bounds = map.getBounds();
                map.clearOverlays();
                switch (zoom) {
                    case 15:
                        zoom = 17;
                        draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 0, 1, that._center, 1);
                        break;
                    default:
                        draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 0, 1, that._center, 0);
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
    map.clearOverlays();
    var pointArray = [];
    for (var i = 0; i < data.loupan.hit.length; i++) {
        var sub = data.loupan.hit[i];
        var longitude = sub['x'];
        var latitude = sub['y'];
        var name = sub['projname'];
        var text = '<br>' + sub['price'] + '万元/㎡<br>' + sub['tao'] + '个楼盘';
        var comarea = sub['baidu_coord'];
        var id = sub['newcode'];
        var point = new BMap.Point(longitude, latitude);
        var marker = new CustomOverlay(point, name, text, comarea, id);
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
            $(son).append('<a  href="http://'  +  city  +  '.fzg360.com/house/home/id/'  +  this._id  +  '.html" target="_blank">' + this._text + '<div></div> <span class="dis" style="display: none;">' + this._name + '</span></a>');

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
                var bounds = map.getBounds();
                if (zoom < 17) {
                    map.clearOverlays();
                    switch (zoom) {
                        case 15:
                        case 16:
                            zoom = 17;
                            draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 1, 1, that._center, 1);
                            break;
                        default:
                            draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 0, 1, that._center, 0);
                    }
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
    map.clearOverlays();
    for (var i = 0; i < data.loupan.hit.length; i++) {
        var sub = data.loupan.hit[i];
        var longitude = sub['x'];
        var latitude = sub['y'];
        var name = sub['projname'] + ' ' + sub['wylx_id'] + ' ' + sub['sale'];
        var text = sub['price'] ? sub['price'] + '元/㎡' : '待定'; //+ sub['tao'] + '套';
        var comarea = sub['baidu_coord'];
        var id = sub['newcode'];
        var point = new BMap.Point(longitude, latitude);
        var marker = new CustomOverlay(point, name, text, comarea, id);
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
            if (searchtype) {
                form = 1;
            } else {
                form = 0;
            }
            draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, form, 0, 0, 0);
            break;
        case 16:
        case 17:
        case 18:
            draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 1, 0, 0, 0);
            break;
    }
});

//拖拽操作
var geolocation = new BMap.Geolocation(); //返回用户当前的位置
geolocation.getCurrentPosition(function(r) {
    if (this.getStatus() === BMAP_STATUS_SUCCESS) { //调用成功
        map.addEventListener('dragend', function() {
            // 开关
            if ($('#esf_E01_41').find('div').attr('class') != 'on') {
                return false;
            }
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
                    if (searchtype) {
                        form = 1;
                    } else {
                        form = 0;
                    }
                    draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, form, 0, 0, 0);
                    break;
                case 16:
                case 17:
                case 18:
                    searchtype = 'loupan';
                    draw(district, bounds.Ne, bounds.Xd, bounds.Je, bounds.Zd, zoom, city, searchtype, 1, 0, 0, 0);
                    break;
            }
        });
    } else {
        alert('failed' + this.getStatus());
    }
});