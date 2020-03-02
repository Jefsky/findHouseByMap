/**
 * @file 基础工具类
 * @modyfied by 袁辉辉(yuanhuihui@fang.com)
 */
define('modules/SFUtil', ['jquery', 'rsa/RSA.min.js'], function(require) {
    'use strict';
    var $ = require('jquery');
    require('rsa/RSA.min.js');
    var vars = seajs.data.vars;
    var SFUtil = {
        searchType: false,
        // 设置 cookie name: cookie 名字;value: cookie值;root表示是否设置到根域名。
        setCookie: function(name, value, root) {
            var Days = 30,
                domain = '';
            var exp = new Date();
            if (root) {
                var hostArr = window.location.host.split('.');
                root = hostArr.length > 1 ? '.' + hostArr[hostArr.length - 2] + '.' + hostArr[hostArr.length - 1] : '.fang.com';
                domain = ';path=/;domain=' + root;
            }
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + domain;
        },

        // 读取 cookie name, cookie 名字
        getCookie: function(name) {
            var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
            if (arr = document.cookie.match(reg)) {
                return (arr[2]);
            } else {
                return null;
            }
        },
        // 删除cookies
        delCookie: function(name) {
            var that = this;
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = that.getCookie(name);
            if (cval != null) {
                document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
            }
        },
        /**
         * 判断容器是否包含该节点
         *
         * @param container 容器
         * @param node 节点
         * @returns {true:包含;false:不包含;}
         */
        containNode: function(container, node) {
            return node.closest(container).length > 0;
        },
        ajaxUrl: window.location.href,
        ajax: function(url, method, params, onComplete, onFailure) {
            var onCompleteProxy = function(xhr) {
                onComplete(xhr);
            };
            if (!params['a']) {
                var filename = url.split('/').pop();
                params['a'] = filename.split('.')[0];
            }
            var options = {
                url: this.ajaxUrl,
                type: method || 'get',
                dataType: params['dataType'] || 'json',
                data: params,
                success: onCompleteProxy,
                error: onFailure
            };
            if (params['a'] == 'ajaxSearch' && this.searchType == 'fromSearchBtn') {
                if (navigator.userAgent.indexOf('Firefox') <= 0) {
                    options['async'] = false;
                }
                this.searchType = false;
            }
            return jQuery.ajax(options);
        },
        getStrlen: function(str) {
            var len = str.length;
            var reLen = 0;
            for (var i = 0; i < len; i++) {
                if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
                    reLen += 3;
                } else {
                    reLen++;
                }
            }
            return reLen;
        },
        subStrcn: function(str, lencn) {
            var len = str.length;
            var reLen = 0;
            var ch = 0;
            for (var i = 0; i < len; i++) {
                if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
                    ch = 3;
                } else {
                    ch = 1;
                }
                reLen += ch;
                if (reLen > lencn) {
                    break;
                }
            }
            return str.substring(0, i);
        },

        // 获取登陆信息
        getLoginStatus: function() {
            var that = this,
                userInfo = vars.username;
            if (!that.loginBarNew) {
                that.loginBarNew = $('#loginBarNew');
            }
            var loginname = userInfo;
            var a1 = that.loginBarNew.find('a').eq(0),
                a2 = that.loginBarNew.find('a').eq(1),
                div2 = that.loginBarNew.children('div').get(2);
            if (!that.loginStatus) {
                that.loginStatus = {
                    href: a1.attr('href')
                };
            }
            if (loginname) {
                a1.attr({
                    target: '_blank'
                }).off('click').on('click', function() {
                    that.logout();
                    return false;
                }).text('\u9000\u51fa');
                a2.attr({
                    href: 'http://my.fang.com/?city=' + vars.city,
                    target: '_blank'
                }).off('click').text(loginname);
                div2.className = 's4';
                div2.onmousemove = function() {
                    this.className = 's4 on2014';
                };
                div2.onmouseout = function() {
                    this.className = 's4';
                };
                div2.getElementsByTagName('div')[0].style.cssText = 'text-overflow: ellipsis;white-space: nowrap;';
            } else {
                a1.attr({
                    href: that.loginStatus.href,
                    target: '_self'
                }).off('click').text('\u6ce8\u518c');
                a2.attr({
                    href: 'javascript:;',
                    target: '_blank'
                }).off('click').on('click', function() {
                    $('#loginbox,#layer').show();
                    return false;
                }).text('\u767b\u5f55');
                div2.className = 's4a';
                div2.onmousemove = function() {
                    this.className = 's4a on2014';
                };
                div2.onmouseout = function() {
                    this.className = 's4a';
                };
            }
        },
        login: function() {
            var that = this,
                username = '',
                password = '',
                userNameObj = $('#username'),
                passwordObj = $('#password'),
                loginTip = $('#login_tip');
            (0 != userNameObj.length) && (username = userNameObj.val());
            (0 != passwordObj.length) && (password = passwordObj.val());
            if ('' === username || '\u624b\u673a\u53f7\u002f\u90ae\u7bb1\u002f\u7528\u6237\u540d' === username) {
                loginTip.html('\u8d26\u53f7\u4e0d\u80fd\u4e3a\u7a7a');
                return;
            }
            if ('' === password || '\u8bf7\u8f93\u5165\u5bc6\u7801' === password) {
                loginTip.html('\u5bc6\u7801\u4e0d\u80fd\u4e3a\u7a7a');
                return;
            }
            // RSA非对称加密
            var key_to_encode = new RSAKeyPair('010001', '', '978C0A92D2173439707498F0944AA476B1B62595877DD6FA87F6E2AC6DCB3D0BF0B82857439C99B5091192BC134889DFF60C562EC54EFBA4FF2F9D55ADBCCEA4A2FBA80CB398ED501280A007C83AF30C3D1A142D6133C63012B90AB26AC60C898FB66EDC3192C3EC4FF66925A64003B72496099F4F09A9FB72A2CF9E4D770C41');
            var pwdnew = encryptedString(key_to_encode, password);
            var params = {
                Uid: username,
                Pwd: pwdnew,
                Service: 'map',
                token: that.getCookie('token'),
                rsa: 0
            };
            var method = 'get';
            var url = location.protocol + '//passport.fang.com/login.api';
            params.city = vars.city;
            var onComplete = function(result) {
                if ('Success' === result.Message) {
                    $('#loginbox').hide();
                    vars.username = result.UserName;
                    that.getLoginStatus();
                    passwordObj.val('');
                    loginTip.html('');
                    $('#layer').hide();
                } else {
                    loginTip.html(result.msg || '\u8d26\u53f7\u002f\u5bc6\u7801\u9519\u8bef');
                }
            };
            var onError = function() {
                loginTip.html('\u8d26\u53f7\u002f\u5bc6\u7801\u9519\u8bef');
            };
            $.ajax({
                type: method,
                url: url,
                dataType: 'jsonp',
                jsonp: 'callback',
                data: params,
                success: onComplete,
                error: onError
            });
        },
        logout: function() {
            var that = this,
                url = this.ajaxUrl;
            var params = {
                c: 'user',
                a: 'logout',
                city: vars.city
            };
            var method = 'get';
            var onComplete = function(data) {
                if (data) {
                    vars.username = '';
                    that.getLoginStatus();
                    // 退出登录重新更新cookie，据说只能使用一次
                    that.setCookie('token', data.data, 'root');
                    that.delCookie('sfut');
                } else {
                    alert('\u9000\u51fa\u5931\u8d25');
                }
            };
            var onError = function() {
                alert('\u9000\u51fa\u5931\u8d25');
            };
            that.ajax(url, method, params, onComplete, onError);
        }
    };
    // 种cookie，接口需要用
    SFUtil.setCookie('token', vars.loginCookie, 'root');
    return SFUtil;
});
define("modules/esf/MapApi", ["bmap/BMap", "bmap/MapWrapper"], function(L) {
    "use strict";

    function a() {
        for (var a = arguments, d = this, t = (S.citybs, 116.404), e = 39.915, i = "mapObj", n = 12, o = { minZoom: 10, maxZoom: 18, enableMapClick: !1 }, r = 0; r < a.length; r++) 0 === r ? i = a[0] : 1 === r ? e = a[1] : 2 === r ? t = a[2] : 3 === r ? n = a[3] : 4 === r && O.extend(o, a[4]);
        this.plyList = [], this.dragend = !0, this.isClick = 0, this.citycenter = new BMap.Point(t, e), this.zoomAdapt = 15, this.container = document.getElementById(i), this.ZindexsMin = -2e8, this.ZindexsMax = 2e9;
        var s = new BMap.Map(i, o);
        s.centerAndZoom(this.citycenter, n), s.enableScrollWheelZoom(), s.disableDoubleClickZoom(), s.disableInertialDragging(), o.NotAddNavCtrl ? s.addControl(new BMap.ScaleControl) : (s.addControl(new BMap.NavigationControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT })), s.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT }))), o.BindEvent && (s.addEventListener("dragstart", function() {
            var a = L("modules/esf/SFMap");
            d.dragend = !0, a.NotFirstDrag || (a.NotFirstDrag = !0, d.centerstart = d._map.pointToOverlayPixel(d.getCenter()), "station" !== a.searchType && (d.centerstartSta = d._map.pointToOverlayPixel(d.getCenter())))
        }), s.addEventListener("dragend", function() {
            try {
                var a = L("modules/esf/SFMap");
                if (!a.searchWhileMove || !d.dragend || "city" === a.searchType) return;
                var t = d._map.pointToOverlayPixel(d.getCenter()),
                    e = Math.abs(t.x - d.centerstart.x),
                    i = Math.abs(t.y - d.centerstart.y),
                    n = Math.sqrt(e * e + i * i * 1.75),
                    o = O(window).width(),
                    r = Math.abs(t.x - d.centerstartSta.x),
                    s = Math.abs(t.y - d.centerstartSta.y);
                Math.sqrt(r * r + s * s * 1.75);
                o < 5 * n && setTimeout(function() { d.dragend = !1, a.clearOtherOption("map", "zoom"), a.searchResult(null, "", !0) }, 200)
            } catch (a) {}
        }), s.addEventListener("zoomstart", function() { d.zoomStart = !0 }), s.addEventListener("zoomend", function() {
            var a = L("modules/esf/SFMap"),
                t = a.map._map.getZoom();
            t < 14 && "city" === a.searchType || (d.zoomStart && (a.clearOtherOption("map", !0), a.searchResult(null, t, "zoom")), d.zoomStart = !1)
        })), this._map = s, this._markerManager = new l(this._map), this.first = !0, this.ajaxFlag = !0
    }
    var S = seajs.data.vars,
        O = L("jquery"),
        r = new BMap.Point(S.cityx, S.cityy);

    function l(a) { this._markers = [], this._map = a }
    return a.prototype = {
        gethdBounds: function() {
            var a = this._map,
                t = a.getBounds(),
                e = t.getSouthWest(),
                i = t.getNorthEast(),
                n = a.pointToPixel(e),
                o = a.pixelToPoint(new BMap.Pixel(n.x, n.y)),
                r = a.pointToPixel(i),
                s = a.pixelToPoint(new BMap.Pixel(r.x, r.y));
            return { x1: o.lng, x2: s.lng, y1: o.lat, y2: s.lat }
        },
        subString: function(a, t) {
            var e = 0,
                i = "";
            if (!a) return "";
            for (var n = 0; n < a.length; n++)
                if (128 < a.charCodeAt(n) ? e += 3 : e++, i += a.charAt(n), t <= e) return i;
            return i
        },
        checkNum: function(a) { return a % 2 == 0 },
        drawMarkers: function(a, t, e, i, n, o, r, s) {
            var d, l = this,
                p = l._map,
                c = new BMap.Bounds;
            if (a) {
                var u, h = [],
                    m = L("modules/esf/SFMap"),
                    v = a.length;
                if (l.stationMarker = null, 0 < v) {
                    for (var f = 0; f < v; f++) {
                        var g = a[f];
                        if (parseInt(g.y) && parseInt(g.x) && (u = new BMap.Point(g.x, g.y), m.params.subwaystation && g.station && m.params.subwaystation !== g.id || h.push(u), u, c.extend(u), d = l.createMarker(g, s), l.addMarker(d, s), d)) {
                            var y = O(d._container),
                                _ = y.find("a[data-buildid=" + d.provalue.newcode + "]");
                            _ && "true" === _.attr("data-selected") && y.css("zIndex", l.ZindexsMax), O(y[0]).on("mouseenter", function() {
                                var a = O(this).find("a"),
                                    t = (a.data("zoneid"), a.data("comarea"));
                                t && (t.indexOf("&&") ? l.addPlyogin(t.split("&&")) : l.addPlyogin([t]))
                            }), O(y[0]).on("mouseleave", function() { l.clearBoundary() })
                        }
                    }
                    "city" === m.searchType ? l.viewAuto = !1 : l.viewAuto = !0, S.projcodes && O(".lpTip").each(function() {
                        var a = O(this),
                            t = a.find("a").attr("data-buildid");
                        if (t === S.projcodes) { var e = O("#mapCanvas a[data-buildid=" + t + "]"); return e.css({ backgroundColor: "#199752", borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingRight: "7px", borderRight: "1px solid #199752" }), e.find("div").css("borderTop", "6px solid #199752"), e.find("span").show(), a.parent().css("z-index", "200000038"), !1 }
                    }), m.params.subwaystation && !a[0].station ? l.subwayStatLPMarkers = h : m.params.subwaystation || (l.subwayStatLPMarkers = []), m.params.subwayline && m.busline.getBusList(m.subwaylinDisp), !m.isDrag && m.params.keyword && h.length ? p.setViewport(h) : m.isDrag
                }
                return 0
            }
        },
        stopPropagation: function(a) { window.event ? window.event.cancelBubble = !0 : a.stopPropagation() },
        stopDefault: function(a) { return a && a.preventDefault ? a.preventDefault() : window.event.returnValue = !1, !1 },
        pageHtml: function(a, t, e, i) { for (var n = t; n <= e; n++) a += i == n ? '<a class="current" name=' + n + ">" + n + "</a> " : '<a href="javascript:void(0)" name=' + n + ">" + n + "</a>"; return a },
        addMarker: function(a, t) {
            var e = this._map,
                i = this._markerManager;
            e.addOverlay(a), i._markers.push(a)
        },
        clearMarkers: function(a) { this._markerManager.clearMarkers(a) },
        clearOverlays: function() {},
        setCenter: function(a, t, e) {
            if (a && t) {
                var i = e || this._map.getZoom();
                this._map.centerAndZoom(new BMap.Point(t, a), i)
            }
        },
        getCenter: function() { return this._map.getCenter() },
        getZoom: function() { return this._map.getZoom() },
        panBy: function(a, t) { this._map.panBy(a, t) },
        panTo: function(a, t) { a && t && this._map.panTo(new BMap.Point(t, a)) },
        createMarker: function(l, p) {
            var a, c = this,
                u = L("modules/esf/SFMap"),
                t = u.searchType,
                e = u.subwaySearchType,
                i = new BMap.Point(l.x, l.y),
                n = "",
                o = c.getZoom();
            if (void 0 === l.station && "line" !== t && (!u.params.subwaystation || 15 < o && u.params.subwaystation)) {
                if (void 0 !== l.newcode || "s" === c.citySize) {
                    l.domain = l.domain ? l.domain : "javascript:void(0)", l.price_num = l.price_num ? l.price_num + "元/㎡" : "", l.price_unit = l.price_unit ? l.price_unit : "", l.title = l.title ? l.title : "", l.title = l.title || l.projname, l.id = l.id ? l.id : "-1", l.tao = l.tao && 0 <= l.tao ? " " + l.tao + "套   " : "", l.price_num || l.price_unit || l.tao || (l.price_num = l.title);
                    n = '<div class="lpTip clearfix l_5015" id="esf_E01_34">', n += '<a  style="display:inline-block;width:100px;text-align:center;"href="' + l.domain + '" data-buildid="' + l.newcode + '" data-bgColor="" data-bgTColor="" >' + (parseFloat(l.price_num, 10) ? l.price_num + l.price_unit : "") + l.tao, n += '<div ></div> <span class="dis">' + l.title + "</span></a></div>", a = new BMap.Size(-63, -33)
                } else if ("ecshop" === l.type) {
                    if ("4" === l.status || "5" === l.status) {
                        var r = "",
                            s = 'style="display:none"';
                        l.id === u.ecshopId ? (r = ' on" data-on ', s = "", u.ecshopId = "") : (r = '"', s = "none");
                        var d, h, m, v, f = "";
                        parseInt(l.housenum) && (f = "<u>" + l.housenum + "套在售房源</u>"), v = "4" === l.status ? (d = "mendian1", h = "房天下直营店", m = "l_5031", "md_type1") : (d = "mendian2", h = "房天下加盟店", m = "l_5088", "md_type2"), n = '<div class="lpTip2 ' + m + '" id="esf_E01_66" data-id="' + l.id + '"><a class="' + d + " md_dian " + r + 'href="#" ><b></b></a><div class="' + v + ' md_type">' + h + '<div class="jt_arr"></div></div>  <div class="mendian" style="display: ' + s + '">    <span class="shang">      <b>' + l.shopname + '</b>      <a id="esf_E01_65">去这里</a>    </span>    <p><u>电话 ' + l.hotline + "</u>" + f + '</p>    <div class="jiantou"></div>  </div></div>', n = O(n)[0], a = new BMap.Size(-104, -62)
                    }
                } else if ("city" === t || "dist" === t || "schoolcity" === t || "school" === t || e) {
                    var g, y = "",
                        _ = "";
                    if (g = l.projname || l.schoolname, l.schoolname && (_ = 'alt="' + l.schoolname + '" title="' + l.schoolname + '"'), 4 < g.length && (g = g.substr(0, 4)), u.params.schoolid || 15 < o && u.params.schoolDist) a = new BMap.Size(-60, -10), n = ' <div class="lpTip" id="' + l.schoolid + '" data-title="' + l.schoolname + '" ><a class="xuequ"' + _ + "><i></i><b>" + l.schoolname + "</b></a></div>";
                    else {
                        a = new BMap.Size(-42, -32), l.price = l.price || l.minprice, l.price && !isNaN(l.price) && 0 < parseFloat(l.price) && (y = (l.price / 1e4).toFixed(1) + "万元/㎡");
                        var b = l.tao + "套",
                            w = "";
                        "schoolcity" === t && (b = l.schoolStat + "所学校"), "school" === t && (w = 'data-schoolid="' + (l.schoolid || "") + '"', b = l.totalrelhousenum + "套");
                        var M = "esf_E01_32";
                        "dist" === u.searchType && (M = "esf_E01_33"), n = '<ul style="width:74px;height:74px;display:block;z-index:2147483647;position:absolute" id="' + M + '" class="lpNum"><li ><a data-comarea="' + (l.baidu_coord || "") + '" data-bgclass="" data-zoneid="' + (l.projname || l.schoolid) + '" ' + w + _ + ">" + g + "<br>" + y + "<br>" + b + "</a></li></ul>"
                    }
                }
            } else if (("railwayother" === t || "railway" === t) && l.station) {
                var x = [];
                if (u.params.subwayline || u.params.subwaystation) {
                    var k = "";
                    u.params.subwaystation === l.id && (k = ' class="on" data-ison="1"'), l.tao = l.tao ? l.tao + "套" : "", x.push('<ul id="esf_E01_35" class="lpLine">'), x.push("<li" + k + '><a data-id="' + l.id + '">' + l.title), x.push("<span> " + l.tao + "</span></a>"), x.push('<div class="dot"></div><div class="sanjiao"><em></em></div>'), x.push("</ul>"), n = x.join("")
                }
                a = new BMap.Size(-64, 0)
            }
            if (n) {
                var C = new BMapLib.RichMarker(n, i, { anchor: a });
                C.provalue = l;
                var T = O(C.getContent());
                if (void 0 !== l.newcode) C.addEventListener("click", function() {
                    u.hideTipsAndSuggest();
                    var a, t = [],
                        e = O.inArray(l.newcode, t);
                    if (a = O("a[data-buildid=" + l.newcode + "]"), -1 === e && (t.push(l.newcode), a.attr("data-bgcolor", "#ff8e86"), a.attr("data-bgtcolor", "6px solid #ff8e86"), a.attr("data-selected", !0)), a) {
                        var i = O("a[data-buildid] span:visible").parent(),
                            n = i.attr("data-bgcolor"),
                            o = i.attr("data-bgtcolor");
                        i.css("backgroundColor", n || "#f14646"), i.find("div").css("borderTop", o || "6px solid #f14646"), i.find("span").hide(), i.attr("data-selected", !1), a.find("div").css("borderTop", "6px solid #199752"), a.find("span").show(), a.css({ backgroundColor: "#199752", paddingRight: "7px", borderRight: "1px solid #199752" }), a.attr("data-selected", !0)
                    }
                    u.searchType = "fangyuan";
                    var r = l.tao.replace(/[^\d]*/g, "");
                    0 < r ? u.searchResult(null, 16, !1, null, null, { newCode: l.newcode, houseNum: r }) : window.open(l.houseurl)
                }), C.addEventListener("mouseover", function() {
                    if (!p || l.newcode !== p) {
                        var a = O(C._container),
                            t = a.find("a[data-buildid]").data("buildid"),
                            e = O("#mapCanvas a[data-buildid=" + t + "]");
                        if (e.css({ backgroundColor: "#199752", borderTopRightRadius: 0, borderBottomRightRadius: 0, paddingRight: "7px", borderRight: "1px solid #199752" }), e.find("div").css("borderTop", "6px solid #199752"), e.find("span").show(), (u.params.subwaystation || u.params.schoolid) && c.stationMarker) {
                            var i = new BMap.Point(c.stationMarker.getPosition().lng, c.stationMarker.getPosition().lat),
                                n = new BMap.Point(C.getPosition().lng, C.getPosition().lat),
                                o = new BMap.Polyline([i, n], { strokeColor: "#ff8000", strokeWeight: 3, strokeOpacity: .5 });
                            c.addOverlay(o), c.stationMarkerLine = o;
                            var r = a.find(".dis");
                            if (!r.attr("hasAdd")) {
                                var s = O(c.stationMarker.getContent()),
                                    d = c._map.getDistance(i, n);
                                r.attr("hasAdd", !0), r.text(r.text() + " 距" + (s.find("a").text().split(" ")[0] || s.attr("data-title")) + (d / 1e3).toFixed(1) + "公里")
                            }
                        }
                    }
                }), C.addEventListener("mouseout", function() {
                    if (!p || l.newcode !== p) {
                        var a = O(C._container).find("a[data-buildid]"),
                            t = a.data("buildid"),
                            e = (a.attr("data-bgcolor"), a.attr("data-bgtcolor")),
                            i = O("#mapCanvas a[data-buildid=" + t + "]");
                        "true" !== i.attr("data-selected") && (i.css({ backgroundColor: i.data("bgcolor") || "#f14646", borderTopRightRadius: "3px", borderBottomRightRadius: "3px", paddingRight: "14px", borderRight: "none" }), i.find("div").css("borderTop", e || "6px solid #f14646"), i.find("span").hide()), c.stationMarkerLine && c._map.removeOverlay(c.stationMarkerLine)
                    }
                });
                else if ("city" !== t && "dist" !== t && ("schoolcity" !== t && "school" !== t || u.params.schoolid) && !e || !T.find("a[data-zoneid]").length) void 0 !== l.housetype && "huxing" === l.housetype || void 0 !== l.schoolid && (u.params.schoolid && u.params.schoolid === T.attr("id") && (c.stationMarker = C), C.addEventListener("click", function() { u.gotoDistrict(null, null, l.x, l.y, l.schoolid) }));
                else {
                    var B = [];
                    C.addEventListener("click", function() { u.hideTipsAndSuggest(), c.clearBoundary(), -1 === O.inArray(l.projname, B) && (B.push(l.projname), O("a[data-buildid=" + l.projname + "]").attr("data-bgclass", "on")); var a = ""; "dist" === u.searchType && (a = l.disid), u.gotoDistrict(l.id, l.projname, l.x, l.y, l.schoolid, l.schoolname, a) }), C.addEventListener("mouseover", function() {
                        var a = O(C._container).find("a[data-zoneid]").data("zoneid");
                        O("#mapCanvas a[data-zoneid=" + a + "]").parent().attr("class", "")
                    });
                    c._map;
                    C.addEventListener("mouseout", function() {
                        var a = O(C._container).find("a[data-zoneid]"),
                            t = a.data("zoneid"),
                            e = a.data("bgclass");
                        O("#mapCanvas a[data-zoneid=" + t + "]").parent().attr("class", e || "")
                    })
                }
                if (void 0 !== l.station) u.params.subwaystation && u.params.subwaystation === T.find("a[data-id]").attr("data-id") && (c.stationMarker = C), C.addEventListener("click", function() {
                    u.hideTipsAndSuggest(), u.clearOtherOption("subway");
                    var a = T.find("li a");
                    if (!O(C._container).find(".lpLine .on[data-ison]").length) {
                        var t = a.text(),
                            e = a.attr("data-id"),
                            i = t.substr(0, t.indexOf(" "));
                        O("#subwayParamContent").text(i), u.subwaystationDisp = i, u.params.subwaystation = e, u.isClickStation = "16", u.searchResult(null, 16, !1, C.getPosition().lng, C.getPosition().lat)
                    }
                });
                else if ("ecshop" === l.type) {
                    var P = O(C.getContent());
                    C.addEventListener("mouseover", function() {
                        var a = O(C._container);
                        a.find("div.mendian").show(), a.find(".md_type").hide()
                    }), C.addEventListener("mouseout", function() {
                        var a = O(C._container);
                        a.find("a[data-on]").length || (a.find("div.mendian").hide(), a.find(".md_type").show())
                    });
                    var z = P.find("div.mendian");
                    z.length && z.on("click", function(a) {
                        if (console.log("我想去的地方,在空间里面已经无迹,只能溯着时间去找."), c.stopPropagation(a), "esf_E01_65" === a.target.id) window.open("//api.map.baidu.com/marker?location=" + l.y + "," + l.x + "&coord_type=bd09ll&src=fang&title=" + l.shopname + "&content=" + l.shopname + "&output=html");
                        else {
                            var t = "bj" === S.city ? "" : "." + S.city;
                            u.windowOpen(location.protocol + "//esf" + t + ".fang.com/mendian-" + l.id)
                        }
                    }), C.addEventListener("click", function() { u.hideTipsAndSuggest(), P.find("a.mendian").hasClass("on") || (u.ecshopId = P.attr("data-id") || "", u.params.ecshop = "ecshophouse", u.params.newCode = "", u.params.district = "", u.searchResult(null, 16, !1, C.getPosition().lng, C.getPosition().lat)) })
                }
                return c.setTop(C), C
            }
        },
        addPlyogin: function(a) {
            var t = this._map;
            this.clearBoundary();
            for (var e = a.length, i = 0; i < e; i++) {
                var n = new BMap.Polygon(a[i], { strokeWeight: 2, strokeColor: "#f00", fillColor: "#f33", fillOpacity: .1 });
                this.plyList.push(n), t.addOverlay(n)
            }
        },
        clearBoundary: function() {
            var a = this.plyList.length;
            if (a) {
                for (var t = 0; t < a; t++) this._map.removeOverlay(this.plyList[t]);
                this.plyList = []
            }
        },
        getDrivingLine: function(a, t, e, i, n) {
            var o = new BMap.Point(t, e),
                r = new BMap.Point(i, n);
            a.search(o, r)
        },
        setTop: function(e) {
            var i = this;
            e && e.addEventListener && (e.addEventListener("mouseover", function() { O(e._container).css("zIndex", i.ZindexsMax++) }), e.addEventListener("mouseout", function() {
                var a = O(e._container),
                    t = a.find("a[data-buildid=" + e.provalue.newcode + "]");
                t.length && "true" !== t.attr("data-selected") && a.css("zIndex", i.ZindexsMin--)
            }))
        },
        hideMarker: function(a) {
            var t = O("#" + ("tip" + a));
            0 < t.length && t.parent().hide()
        },
        hoverMarker: function(a, t, e) {
            if (void 0 !== a.provalue.newCode) {
                var i = O("#tip" + a.provalue.newCode);
                if (0 !== i.length)
                    if (t) {
                        if ("mapFinddingCanvasLabelStyle8" != i.attr("class")) {
                            i.attr("class", "lpxxx tf");
                            var n = O("#map_canvas").width(),
                                o = "alert_tc",
                                r = "4",
                                s = "",
                                d = this.pointToPixel(e),
                                l = d.x,
                                p = d.y;
                            s = l < 210 && p < 136 ? (o = "alert_tc alert_tc2", r = 2, "sanjiao2") : p < 136 ? (o = "alert_tc alert_tc3", r = 1, "sanjiao3") : n - l < 210 ? (o = "alert_tc alert_tc1", r = 3, "sanjiao1") : (o = "alert_tc", r = 4, "");
                            var c = S.imgUrl + "img/jt_" + r + ".png",
                                u = O("#tip_price_" + a.provalue.newCode),
                                h = O("#tip_sanjiao_" + a.provalue.newCode);
                            u.attr("class", o), h.attr("src", c), h.parent().attr("class", "sanjiao " + s), u.show()
                        }
                        i.parent().css("zIndex", 2)
                    } else if (this.isClick !== a.provalue.newCode && (void 0 !== a.provalue.zindex && i.parent().css("zIndex", a.provalue.zindex), "mapFinddingCanvasLabelStyle8" !== i.attr("class"))) { i.attr("class", "lpxx tf"), O("#tip_price_" + a.provalue.newCode).hide() }
            }
        },
        closeTip: function() {
            var a = L("modules/esf/SFMap"),
                t = O("#maptip"),
                e = this.isClick;
            this.isClick = 0, t.hide(), t.html(""), e && a.markerList[e] && a.markerList[e].onCloseTip()
        },
        panMap: function(a, t, e) {
            var i = this._map,
                n = i.getViewport(e),
                o = a.getCenter();
            n.zoom > this.zoomAdapt && (n.zoom = this.zoomAdapt), n.zoom < 10 && r ? i.centerAndZoom(r, 10) : i.centerAndZoom(o, n.zoom)
        },
        panMap1: function(a, t, e) {
            var i = this._map,
                n = i.getViewport(e),
                o = a.getCenter();
            n.zoom -= 1, n.zoom > this.zoomAdapt && (n.zoom = this.zoomAdapt), n.zoom < 10 ? i.centerAndZoom(o, 10) : i.centerAndZoom(o, n.zoom)
        },
        addKeyMarker: function(a) {
            var t = this._map;
            if (a.district && a.y && a.x) {
                var e = '<div class="mapFinddingCanvasLabelStyle11" id="divkeymarker"><table cellpadding=0 cellspacing=0 border=0><tr>';
                e += '<td class="s1" >&nbsp;</td><td class="s2" id="tip1010133427"><img src="' + imgPath + 'baidu_n/img/icon004.gif" alt="" />' + a.district + '</td><td class="s3">&nbsp;</td><td class="s4"></td></tr><tr><td colspan="3" class="s5"></td></tr></table></div>';
                var i = new BMapLib.RichMarker(e, new BMap.Point(a.x, a.y), { anchor: new BMap.Size(0, -40) });
                t.addOverlay(i), O("#divkeymarker").parent().css("zIndex", 0)
            }
        },
        pointToPixel: function(a) { return this._map.pointToPixel(a) },
        setZoom: function(a) {
            var t = parseInt(a);
            this._map.setZoom(t)
        },
        addOverlay: function(a) { this._map.addOverlay(a) },
        removeOverlay: function(a) { this._map.removeOverlay(a) },
        openDis: function() {
            var a = this;
            void 0 === a._disTool && (a._disTool = new BMapLib.DistanceTool(a._map), a._disTool.addEventListener("drawend", function() { a._disTool.close() })), a._disTool.open()
        },
        convertPoint: function(a) {
            var t = [];
            if (O.isArray(a) && 0 < a.length) {
                for (var e = 0; e < a.length; e++) {
                    var i = new BMap.Marker(new BMap.Point(a[e].x, a[e].y));
                    a[e].x = i.point.lng, a[e].y = i.point.lat, t.push(a[e])
                }
                this.drawMarkers(t)
            }
        },
        addEvent: function(a, t, e) { a.addEventListener ? a.addEventListener(t, e, !1) : a.attachEvent && (a["e" + t + e] = e, a.attachEvent("on" + t, function() { a["e" + t + e]() })) }
    }, l.prototype.addMarker = function(a) { this._markers.push(a), this._map.addOverlay(a) }, l.prototype.clearMarkers = function(a) {
        var t = this;
        for (var e in t._markers)
            if (t._markers.hasOwnProperty(e)) {
                var i = t._markers[e];
                if (!i) continue;
                if (a && i.provalue.station) continue;
                t._map.removeOverlay(i), delete t._markers[e]
            }
        var n = L("modules/esf/SFMap");
        if (!a && n.subwayMarkers)
            for (; 0 < n.subwayMarkers.length;) t._map.removeOverlay(n.subwayMarkers.shift())
    }, a
});
define("lazyload/lazyload", ["jquery"], function(e, t, o) {
    var l = e("jquery"),
        i = l(window),
        n = window.document;
    l.fn.lazyload = function(e) {
        var t, r = this,
            f = { threshold: 0, failure_limit: 0, event: "scroll", effect: "show", container: "#scrollbar1", data_attribute: "original", skip_invisible: !0, appear: null, load: null, placeholder: "//js.soufunimg.com/common_m/m_public/images/loadingpic.jpg" };

        function o() {
            var t = 0;
            r.each(function() {
                var e = l(this);
                if (!f.skip_invisible || e.is(":visible"))
                    if (l.abovethetop(this, f) || l.leftofbegin(this, f));
                    else if (l.belowthefold(this, f) || l.rightoffold(this, f)) { if (++t > f.failure_limit) return !1 } else e.trigger("appear"), t = 0
            })
        }
        return e && (void 0 !== e.failurelimit && (e.failure_limit = e.failurelimit, delete e.failurelimit), void 0 !== e.effectspeed && (e.effect_speed = e.effectspeed, delete e.effectspeed), l.extend(f, e)), t = void 0 === f.container || f.container === window ? i : l(f.container), 0 === f.event.indexOf("scroll") && t.bind(f.event, function() { return o() }), this.each(function() {
            var i = this,
                n = l(i);
            i.loaded = !1, void 0 !== n.attr("src") && !1 !== n.attr("src") || n.is("img") && n.attr("src", f.placeholder), n.one("appear", function() {
                if (!this.loaded) {
                    if (f.appear) {
                        var e = r.length;
                        f.appear.call(i, e, f)
                    }
                    l("<img />").bind("load", function() {
                        var e = n.attr("data-" + f.data_attribute);
                        n.hide(), n.is("img") ? n.attr("src", e) : n.css("background-image", "url('" + e + "')"), n[f.effect](f.effect_speed), i.loaded = !0;
                        var t = l.grep(r, function(e) { return !e.loaded });
                        if (r = l(t), f.load) {
                            var o = r.length;
                            f.load.call(i, o, f)
                        }
                    }).attr("src", n.attr("data-" + f.data_attribute))
                }
            }), 0 !== f.event.indexOf("scroll") && n.bind(f.event, function() { i.loaded || n.trigger("appear") })
        }), i.bind("resize", function() { o() }), /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) && i.bind("pageshow", function(e) { e.originalEvent && e.originalEvent.persisted && r.each(function() { l(this).trigger("appear") }) }), l(n).ready(function() { o() }), this
    }, l.belowthefold = function(e, t) { return (void 0 === t.container || t.container === window ? (window.innerHeight ? window.innerHeight : i.height()) + i.scrollTop() : l(t.container).offset().top + l(t.container).height()) <= l(e).offset().top - t.threshold }, l.rightoffold = function(e, t) { return (void 0 === t.container || t.container === window ? i.width() + i.scrollLeft() : l(t.container).offset().left + l(t.container).width()) <= l(e).offset().left - t.threshold }, l.abovethetop = function(e, t) { return (void 0 === t.container || t.container === window ? i.scrollTop() : l(t.container).offset().top) >= l(e).offset().top + t.threshold + l(e).height() }, l.leftofbegin = function(e, t) { return (void 0 === t.container || t.container === window ? i.scrollLeft() : l(t.container).offset().left) >= l(e).offset().left + t.threshold + l(e).width() }, l.inviewport = function(e, t) { return !(l.rightoffold(e, t) || l.leftofbegin(e, t) || l.belowthefold(e, t) || l.abovethetop(e, t)) }, l.extend(l.expr[":"], { "below-the-fold": function(e) { return l.belowthefold(e, { threshold: 0 }) }, "above-the-top": function(e) { return !l.belowthefold(e, { threshold: 0 }) }, "right-of-screen": function(e) { return l.rightoffold(e, { threshold: 0 }) }, "left-of-screen": function(e) { return !l.rightoffold(e, { threshold: 0 }) }, "in-viewport": function(e) { return l.inviewport(e, { threshold: 0 }) }, "above-the-fold": function(e) { return !l.belowthefold(e, { threshold: 0 }) }, "right-of-fold": function(e) { return l.rightoffold(e, { threshold: 0 }) }, "left-of-fold": function(e) { return !l.rightoffold(e, { threshold: 0 }) } }), o.exports = l
});
/* Copyright (c) 2009 Brandon Aaron (http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * Version: 3.0.2
 *
 * Requires: 1.2.2+
 */
(function(c) {
    var a = ["DOMMouseScroll", "mousewheel"];
    c.event.special.mousewheel = { setup: function() { if (this.addEventListener) { for (var d = a.length; d;) { this.addEventListener(a[--d], b, false) } } else { this.onmousewheel = b } }, teardown: function() { if (this.removeEventListener) { for (var d = a.length; d;) { this.removeEventListener(a[--d], b, false) } } else { this.onmousewheel = null } } };
    c.fn.extend({ mousewheel: function(d) { return d ? this.bind("mousewheel", d) : this.trigger("mousewheel") }, unmousewheel: function(d) { return this.unbind("mousewheel", d) } });

    function b(f) {
        var d = [].slice.call(arguments, 1),
            g = 0,
            e = true;
        f = c.event.fix(f || window.event);
        f.type = "mousewheel";
        if (f.originalEvent.wheelDelta) { g = f.originalEvent.wheelDelta / 120 }
        if (f.originalEvent.detail) { g = -f.originalEvent.detail / 3 }
        d.unshift(f, g);
        return c.event.dispatch.apply(this, d)
    }
})(jQuery);
/*
 * jQuery resize event - v1.1 - 3/14/2010
 * http://benalman.com/projects/jquery-resize-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($, h, c) {
    var a = $([]),
        e = $.resize = $.extend($.resize, {}),
        i, k = "setTimeout",
        j = "resize",
        d = j + "-special-event",
        b = "delay",
        f = "throttleWindow";
    e[b] = 250;
    e[f] = true;
    $.event.special[j] = {
        setup: function() {
            if (!e[f] && this[k]) { return false }
            var l = $(this);
            a = a.add(l);
            $.data(this, d, { w: l.width(), h: l.height() });
            if (a.length === 1) { g() }
        },
        teardown: function() {
            if (!e[f] && this[k]) { return false }
            var l = $(this);
            a = a.not(l);
            l.removeData(d);
            if (!a.length) { clearTimeout(i) }
        },
        add: function(l) {
            if (!e[f] && this[k]) { return false }
            var n;

            function m(s, o, p) {
                var q = $(this),
                    r = $.data(this, d);
                r.w = o !== c ? o : q.width();
                r.h = p !== c ? p : q.height();
                n.apply(this, arguments)
            }
            if ($.isFunction(l)) { n = l; return m } else {
                n = l.handler;
                l.handler = m
            }
        }
    };

    function g() {
        i = h[k](function() {
            a.each(function() {
                var n = $(this),
                    m = n.width(),
                    l = n.height(),
                    o = $.data(this, d);
                if (m !== o.w || l !== o.h) { n.trigger(j, [o.w = m, o.h = l]) }
            });
            g()
        }, e[b])
    }
})(jQuery, this);
(function(P) {
    $.fn.scrollbar = function(u) {
        var h = "scrollbar",
            T2 = 300,
            l = "auto",
            F2 = 7,
            H2 = false,
            A, x2 = true,
            K2 = false,
            R, W2 = true,
            b2 = false,
            q, y2 = true,
            i2 = false,
            T, O2 = true,
            v2 = false,
            j, N2 = true,
            g = 0.4,
            t2 = 10,
            Y = true,
            I = true,
            i = 10,
            c2 = "auto",
            j2 = "auto",
            o = 0,
            p2 = 5,
            R2 = true,
            g2 = "vertical",
            X2 = 13,
            C = "#111111",
            G2 = "#a1dc13",
            n2 = "#E6E6E6",
            r2 = "#CCCCCC",
            e2 = false,
            m2 = "middle",
            L2 = "middle",
            e = 20,
            X = 20;
        if (u.type != P) h = u.type;
        if (u.height != P) T2 = u.height;
        if (u.width != P) l = u.width;
        if (u.scrollerEase != P) F2 = u.scrollerEase;
        if (u.downBtn != P) {
            H2 = true;
            A = u.downBtn
        }
        if (u.upBtn != P) {
            K2 = true;
            R = u.upBtn
        }
        if (u.topBtn != P) {
            b2 = true;
            q = u.topBtn
        }
        if (u.rightBtn != P) {
            v2 = true;
            j = u.rightBtn
        }
        if (u.leftBtn != P) {
            i2 = true;
            T = u.leftBtn
        }
        if (u.dragVertical != P) Y = u.dragVertical;
        if (u.dragHorizontal != P) I = u.dragHorizontal;
        if (u.buttonsDisabledAlpha != P) g = u.buttonsDisabledAlpha;
        if (u.buttonsScrollSpeed != P) t2 = u.buttonsScrollSpeed;
        if (u.barWidth != P) i = u.barWidth;
        if (u.draggerVerticalSize != P) c2 = u.draggerVerticalSize;
        if (u.roundCorners != P) o = u.roundCorners;
        if (u.distanceFromBar != P) p2 = u.distanceFromBar;
        if (u.mouseWheel != P) R2 = u.mouseWheel;
        if (u.mouseWheelOrientation != P) g2 = u.mouseWheelOrientation;
        if (u.mouseWheelSpeed != P) X2 = u.mouseWheelSpeed;
        if (u.draggerColor != P) C = u.draggerColor;
        if (u.draggerOverColor != P) G2 = u.draggerOverColor;
        if (u.barColor != P) n2 = u.barColor;
        if (u.barOverColor != P) r2 = u.barOverColor;
        if (u.lockToPosition != P) e2 = u.lockToPosition;
        if (u.lockToAlignVertical != P) m2 = u.lockToAlignVertical;
        if (u.lockToAlignHorizontal != P) L2 = u.lockToAlignHorizontal;
        if (u.topAndBottomSpace != P) e = u.topAndBottomSpace;
        if (u.leftAndRightSpace != P) X = u.leftAndRightSpace;
        $(this).each(function() {
            var r = "grab",
                v = 'mousemove',
                m = "horizontal",
                G = "left",
                d = ".scrollbar_dragger.horizontal",
                E = "border-radius",
                J = "-khtml-border-radius",
                B = "-webkit-border-radius",
                w2 = "-moz-border-radius",
                U = "background-color",
                u2 = "top",
                M = "px",
                _2 = ".content1",
                p = "width",
                s = 'px',
                H = "height",
                n = T2,
                O = $(this);
            O.css(H, n + s);
            var Z = O.width() - 2,
                z = $(".scrollbar", O);
            z.css(p, Z);
            z.css(H, n);
            var N = $(_2, O),
                Z2 = 0,
                t = 0,
                M2 = 0,
                _ = 0,
                D = N.height(),
                F = N.width();
            if (l != "auto") {
                N.css(p, l + M);
                F = l
            }
            var u, o2, $2, V2 = false,
                S2 = false,
                h2 = false,
                Q2 = 30,
                U2 = function() {
                    var w = "opacity";
                    if (Y) {
                        if (D < n) {
                            y.css(w, 0);
                            V.css(w, 0)
                        } else {
                            if (c2 == "auto") f = n / (D / n);
                            else f = c2;
                            y.css(H, f + s);
                            y.css(w, 1);
                            V.css(w, 1)
                        }
                    }
                    if (I) {
                        if (F < Z) {
                            x.css(w, 0);
                            a.css(w, 0)
                        } else {
                            if (j2 == "auto") k = Z / (F / Z);
                            else k = j2;
                            x.css(p, k + s);
                            x.css(w, 1);
                            a.css(w, 1)
                        }
                    }
                };
            if (h == "scrollbar" && Y) {
                O.append('<div class="scrollbar_dragger vertical"><div class="back"></div><div class="dragger"></div></div>');
                z.css("margin-right", i + s);
                Z -= (i + p2);
                z.css(p, Z + M);
                if (!I) N.css(p, Z + M);
                $(".scrollbar_dragger.vertical", O).css(p, i + M);
                var f, z2 = n,
                    y = $(".scrollbar_dragger.vertical .dragger", O),
                    c = 0;
                y.css(u2, 0 + M);
                y.css(p, i + s);
                y.css(U, C);
                if (o > 0) {
                    y.css(w2, o + s);
                    y.css(B, o + s);
                    y.css(J, o + s);
                    y.css(E, o + s)
                }
                var V = $(".scrollbar_dragger.vertical .back");
                V.css(p, i + s);
                V.css(H, n + s);
                V.css(U, n2);
                if (o > 0) {
                    V.css(w2, o + s);
                    V.css(B, o + s);
                    V.css(J, o + s);
                    V.css(E, o + s)
                }
                if (!I) U2()
            }
            if (h == "scrollbar" && I) {
                z.css("margin-bottom", i + s);
                n -= (i + p2);
                if (Y) V.css(H, n + s);
                z.css(H, n + M);
                if (!Y) N.css(H, n + M);
                $(d, O).css(H, i + M);
                $(d, O).css(p, Z + i + p2 + M);
                $(d, O).css(u2, n + p2 + M);
                var P = Z,
                    k, x = $(".scrollbar_dragger.horizontal .dragger", O),
                    L = 0;
                x.css(H, i + s);
                x.css(p, Z + s);
                x.css(U, C);
                x.css(G, 0 + M);
                if (o > 0) {
                    x.css(w2, o + s);
                    x.css(B, o + s);
                    x.css(J, o + s);
                    x.css(E, o + s)
                }
                var a = $(".scrollbar_dragger.horizontal .back");
                a.css(H, i + s);
                a.css(p, Z + s);
                a.css(U, n2);
                if (o > 0) {
                    a.css(w2, o + s);
                    a.css(B, o + s);
                    a.css(J, o + s);
                    a.css(E, o + s)
                }
                U2()
            }
            $(_2, O).resize(function() {
                N = $(_2, O);
                D = N.height();
                F = N.width();
                if (l != "auto") {
                    N.css(p, l + M);
                    F = l
                }
                if (h == "scrollbar") U2()
            });
            var ba = function() {
                var w = 'disabled';
                if (b2) {
                    if (t >= 0 && y2) {
                        y2 = false;
                        q.fadeTo(300, g);
                        q.addClass(w)
                    } else if (t < 0 && !y2) {
                        y2 = true;
                        q.fadeTo(300, 1);
                        q.removeClass(w)
                    }
                }
                if (K2) {
                    if (t >= 0 && W2) {
                        W2 = false;
                        R.fadeTo(300, g);
                        R.addClass(w)
                    } else if (t < 0 && !W2) {
                        W2 = true;
                        R.fadeTo(300, 1);
                        R.removeClass(w)
                    }
                }
                if (H2) {
                    if (t <= (-(D - n)) && x2) {
                        x2 = false;
                        A.fadeTo(300, g);
                        A.addClass(w)
                    } else if (t > (-(D - n)) && !x2) {
                        x2 = true;
                        A.fadeTo(300, 1);
                        A.removeClass(w)
                    }
                }
                if (i2) {
                    if (_ >= 0 && O2) {
                        O2 = false;
                        T.fadeTo(300, g);
                        T.addClass(w)
                    } else if (_ < 0 && !O2) {
                        O2 = true;
                        T.fadeTo(300, 1);
                        T.removeClass(w)
                    }
                }
                if (v2) {
                    if (_ <= (-(F - Z)) && N2) {
                        N2 = false;
                        j.fadeTo(300, g);
                        j.addClass(w)
                    } else if (_ > (-(F - Z)) && !N2) {
                        N2 = true;
                        j.fadeTo(300, 1);
                        j.removeClass(w)
                    }
                }
                if (Y) {
                    var Q = Math.round(((t - Z2) / F2));
                    Z2 += Q;
                    N.css('top', Z2 + M);
                    /*����scroll�¼���ʹ������ִ��*/
                    O.trigger($.Event('scroll'));
                }
                if (I) {
                    var Q = Math.round(((_ - M2) / F2));
                    M2 += Q;
                    N.css('left', M2 + M);
                }
                u = setTimeout(ba, Q2)
            };
            u = setTimeout(ba, Q2);
            if (h == "scrollbar") {
                var bb = function(w) {
                        if (w == "vertical") {
                            if (c < 0) c = 0;
                            if (c > (z2 - f)) c = (z2 - f);
                            var Q = c / (z2 - f);
                            t = -(D - n) * Q;
                            y.css(u2, c + M)
                        } else if (w == m) {
                            if (L < 0) L = 0;
                            if (L > (P - k)) L = (P - k);
                            var Q = L / (P - k);
                            _ = -(F - Z) * Q;
                            x.css(G, L + M)
                        }
                    },
                    s2 = function(w) {
                        var Q;
                        var W = "vertical";
                        var S;
                        if (S2) {
                            Q = w.pageY;
                            S = Q - o2;
                            c = (positionIni + S)
                        } else {
                            Q = w.pageX;
                            W = m;
                            S = Q - o2;
                            L = (positionIni + S)
                        }
                        bb(W)
                    };
                if (Y) {
                    y.mouseover(function() {
                        y.css(U, G2)
                    });
                    y.mouseout(function() {
                        if (!S2) y.css(U, C)
                    });
                    V.mouseover(function() {
                        V.css(U, r2)
                    });
                    V.mouseout(function() {
                        V.css(U, n2)
                    });
                    y.mousedown(function(w) {
                        if (D > n) {
                            o2 = w.pageY;
                            positionIni = parseInt(y.css(u2), 10);
                            S2 = true;
                            $(document).bind(v, s2);
                            $(document).mouseup(function() {
                                $(document).unbind(v);
                                S2 = false;
                                y.css(U, C)
                            })
                        }
                        return false
                    });
                    V.click(function(w) {
                        var Q = V.offset();
                        c = w.pageY - Q.top;
                        bb("vertical");
                        return false
                    })
                }
                if (I) {
                    x.mouseover(function() {
                        x.css(U, G2)
                    });
                    x.mouseout(function() {
                        if (!V2) x.css(U, C)
                    });
                    a.mouseover(function() {
                        a.css(U, r2)
                    });
                    a.mouseout(function() {
                        a.css(U, n2)
                    });
                    x.mousedown(function(w) {
                        o2 = w.pageX;
                        positionIni = parseInt(x.css(G), 10);
                        h2 = true;
                        $(document).bind(v, s2);
                        $(document).mouseup(function() {
                            $(document).unbind(v);
                            h2 = false;
                            x.css(U, C)
                        });
                        return false
                    });
                    a.click(function(w) {
                        var Q = a.offset();
                        L = w.pageX - Q.left;
                        bb(m);
                        return false
                    })
                }
                if (R2) {
                    O.mousewheel(function(w, Q) {
                        if (g2 == "vertical") {
                            if (D > n) {
                                c -= Q * 13;
                                bb("vertical")
                            }
                        } else {
                            L -= Q * 13;
                            bb(m)
                        }
                        return false
                    })
                }
            }
            if (h == "mousePosition") {
                if (!Y) N.css(H, n + M);
                if (!I) N.css(p, Z + M);
                var bc = z.offset();
                z.mousemove(function(w) {
                    bc = z.offset();
                    if (D > n) {
                        if (Y) {
                            var Q = (D + e * 2) - n,
                                W = (w.pageY - bc.top) / n,
                                S = e - Q * W;
                            t = S
                        }
                        if (I) {
                            var Q = (F + X * 2) - Z,
                                W = (w.pageX - bc.left) / Z,
                                S = X - Q * W;
                            _ = S
                        }
                    }
                });
                if (e2) O.mouseout(function() {
                    if (Y) {
                        var w = (D + e * 2) - n;
                        if (m2 == "middle") t = e - w * 0.5;
                        else if (m2 == "bottom") t = e - w;
                        else t = 0
                    }
                    if (I) {
                        var w = (F + X * 2) - Z;
                        if (L2 == "middle") _ = X - w * 0.5;
                        else if (L2 == "right") _ = X - w;
                        else _ = 0
                    }
                })
            }
            if (/msie/.test(navigator.userAgent.toLowerCase())) {
                N.get(0).onselectstart = function() {
                    return false
                }
            } else {
                N.get(0).onmousedown = function(w) {
                    w.preventDefault()
                }
            }
            if (h == "dragAndDrop") {
                if (!Y) N.css(H, n + M);
                if (!I) N.css(p, Z + M);
                var bd = 0,
                    f2 = 0,
                    Y2 = 0,
                    I2 = 0,
                    E2, q2, A2, k2, s2 = function(w) {
                        if (Y) {
                            var Q = w.pageY;
                            var W = Q - A2;
                            t = (E2 + W);
                            Y2 = W - bd;
                            bd = W
                        }
                        if (I) {
                            var S = w.pageX;
                            var b = S - k2;
                            _ = (q2 + b);
                            I2 = b - f2;
                            f2 = b
                        }
                    };
                z.addClass(r);
                O.mousemove(function(w) {
                    w.preventDefault()
                });
                z.mousedown(function(S) {
                    var b = "grabbing";
                    z.removeClass(r);
                    z.addClass(b);
                    if (S.preventDefault) S.preventDefault();
                    else S.returnValue = false;
                    if (Y) {
                        A2 = S.pageY;
                        t = Z2;
                        E2 = t
                    }
                    if (I) {
                        k2 = S.pageX;
                        _ = M2;
                        q2 = _
                    }
                    V2 = true;
                    $(document).bind(v, s2);
                    $(document).mouseup(function(w) {
                        z.addClass(r);
                        z.removeClass(b);
                        $(document).unbind(v, s2);
                        V2 = false;
                        if (Y) {
                            var Q = D - n;
                            t += Y2 * 30;
                            if (t > 0) t = 0;
                            else if (t < -Q) t = -Q;
                            Y2 = 0
                        }
                        if (I) {
                            var W = F - Z;
                            _ += I2 * 30;
                            if (_ > 0) _ = 0;
                            else if (_ < -W) _ = -W;
                            I2 = 0
                        }
                        return false
                    });
                    return false
                })
            }
            if (b2) {
                q.click(function() {
                    t = 0;
                    return false
                })
            }
            if (H2) {
                var K;
                A.mousedown(function() {
                    var w = function() {
                        t -= t2;
                        if (t < (-(D - n))) t = (-(D - n))
                    };
                    K = setInterval(w, 30);
                    $(document).mouseup(function() {
                        clearInterval(K)
                    });
                    return false
                })
            }
            if (K2) {
                var K;
                R.mousedown(function() {
                    var w = function() {
                        t += t2;
                        if (t > 0) t = 0
                    };
                    K = setInterval(w, Q2);
                    $(document).mouseup(function() {
                        clearInterval(K)
                    });
                    return false
                })
            }
            if (i2) {
                var K;
                T.mousedown(function() {
                    var w = function() {
                        _ += t2;
                        if (_ > 0) _ = 0
                    };
                    K = setInterval(w, Q2);
                    $(document).mouseup(function() {
                        clearInterval(K)
                    });
                    return false
                })
            }
            if (v2) {
                var K;
                j.mousedown(function() {
                    var w = function() {
                        _ -= t2;
                        if (_ < (-(F - Z))) _ = (-(F - Z))
                    };
                    K = setInterval(w, Q2);
                    $(document).mouseup(function() {
                        clearInterval(K)
                    });
                    return false
                })
            }
        })
    }
}());