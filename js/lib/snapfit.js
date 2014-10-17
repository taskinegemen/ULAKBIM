/**
 * snapfit.js 1.5 (21-Jul-2011) (c) by Christian Effenberger
 * All Rights Reserved. Source: snapfit.netzgesta.de
 * Distributed under Netzgestade Software License Agreement.
 * This license permits free of charge use on non-commercial
 * and private web sites only under special conditions.
 * Read more at... http://www.netzgesta.de/cvi/LICENSE.html
 **/
var cvi_stactive, cvi_stpiece, snapfit = {
    version: 1.5,
    released: '2011-07-21 12:00:00',
    defaultSimple: false,
    defaultAreaborder: false,
    defaultSpace: 0,
    defaultAreaopacity: 0.33,
    defaultMixed: false,
    defaultAreaimage: false,
    defaultSnap: 8,
    defaultBorderopacity: 0.5,
    defaultFalsecolor: '#ff0000',
    defaultAreacolor: '#e0e0e0',
    defaultShadowopacity: 0.75,
    defaultMatchcolor: '#00d000',
    defaultBgrndcolor: '#000000',
    defaultBorderwide: 2,
    defaultLevel: 3,
    defaultTofront: false,
    defaultNokeys: false,
    defaultPolygon: false,
    defaultForcetouchui: false,
    defaultCallback: false,
    imageId:'',
    add: function (image, options) {
    	console.log(image.id);
    	this.imageId=image.id;
        if (image.tagName.toUpperCase() == "IMG" && image.width >= 128 && image.height >= 128) {
            function uniqueID() {
                var v = Date.parse(new Date()) + Math.floor(Math.random() * 100000000000);
                return v.toString(16)
            };

            function hex2rgb(val) {
                function h2d(v) {
                    return (Math.max(0, Math.min(parseInt(v, 16), 255)))
                }
                return h2d(val.substr(1, 2)) + ',' + h2d(val.substr(3, 2)) + ',' + h2d(val.substr(5, 2))
            };

            function dec2hex(v) {
                return '#' + v.toString(16) + v.toString(16) + v.toString(16)
            };
            var self, reso, imageWidth, imageHeight, isIE = 0,
                defopts = {
                    "polygon": snapfit.defaultPolygon,
                    "level": snapfit.defaultLevel,
                    "space": snapfit.defaultSpace,
                    "snap": snapfit.defaultSnap,
                    "mixed": snapfit.defaultMixed,
                    "simple": snapfit.defaultSimple,
                    "nokeys": snapfit.defaultNokeys,
                    "tofront": snapfit.defaultTofront,
                    "bcolor": snapfit.defaultBgrndcolor,
                    "fcolor": snapfit.defaultFalsecolor,
                    "mcolor": snapfit.defaultMatchcolor,
                    "acolor": snapfit.defaultAreacolor,
                    "aopacity": snapfit.defaultAreaopacity,
                    "aborder": snapfit.defaultAreaborder,
                    "aimage": snapfit.defaultAreaimage,
                    "bopacity": snapfit.defaultBorderopacity,
                    "bwide": snapfit.defaultBorderwide,
                    "sopacity": snapfit.defaultShadowopacity,
                    "forcetui": snapfit.defaultForcetouchui,
                    "callback": snapfit.defaultCallback
                };
            if (options) {
                for (var i in defopts) {
                    if (!options[i]) {
                        options[i] = defopts[i]
                    }
                }
            } else {
                options = defopts
            }
            imageWidth = ('iwidth' in options) ? parseInt(options.iwidth) : image.width;
            imageHeight = ('iheight' in options) ? parseInt(options.iheight) : image.height;
            if (document.all && document.namespaces && !window.opera && (!document.documentMode || document.documentMode < 9)) {
                if (document.namespaces['v'] == null) {
                    var e = ["shape", "shapetype", "group", "background", "path", "formulas", "handles", "fill", "stroke", "shadow", "textbox", "textpath", "imagedata", "line", "polyline", "curve", "roundrect", "oval", "rect", "arc", "image"],
                        s = document.createStyleSheet();
                    for (var i = 0; i < e.length; i++) {
                        s.addRule("v\\:" + e[i], "behavior: url(#default#VML);")
                    }
                    document.namespaces.add("v", "urn:schemas-microsoft-com:vml")
                }
                var dpl = (image.currentStyle.display.toLowerCase() == 'block') ? 'block' : 'inline-block';
                isIE = 1;
                self = document.createElement(['<var unselectable="on" style="zoom:1;display:' + dpl + ';overflow:hidden;width:' + imageWidth + 'px;height:' + imageHeight + 'px;padding:0px;">'].join(''));
                var flt = image.currentStyle.styleFloat.toLowerCase();
                self.dpl = (flt == 'left' || flt == 'right') ? 'inline' : dpl
            } else {
                self = document.createElement('canvas');
                reso = document.createElement('canvas')
            } if ((isIE && self) || (reso && self && reso.getContext("2d") && self.getContext("2d"))) {
                self.id = (image.id == 'undefined' || image.id == '' ? uniqueID() : image.id);
                self.vml = isIE;
                self.alt = image.alt;
                self.title = image.title;
                self.img = image.src;
                self.className = image.className;
                self.style.cssText = image.style.cssText;
                self.style.height = imageHeight + 'px';
                self.style.width = imageWidth + 'px';
                self.height = imageHeight;
                self.width = imageWidth;
                self.sf = Math.min(1 - Math.min((typeof options['space'] === 'number' ? options['space'] : snapfit.defaultSpace) * 0.01, 0.5), 1.0);
                self.iw = parseInt(self.width * self.sf);
                self.ih = parseInt(self.height * self.sf);
                self.xo = parseInt((self.width - self.iw) / 2);
                self.yo = parseInt((self.height - self.ih) / 2);
                self.wk4 = navigator.appVersion.indexOf('WebKit') != -1 && !document.defaultCharset ? 1 : 0;
                self.ge8 = navigator.userAgent.indexOf('Gecko') > -1 && window.updateCommands && !window.external ? 1 : 0;
                if (self.vml) {
                    image.parentNode.replaceChild(self, image)
                } else {
                    reso.height = self.ih;
                    reso.width = self.iw;
                    reso.style.height = reso.height + 'px';
                    reso.style.width = reso.width + 'px';
                    if (self.wk4) {
                        reso.id = self.id + '_buffer';
                        reso.style.position = 'fixed';
                        reso.style.left = '-99999px';
                        reso.style.top = '0px';
                        image.parentNode.appendChild(reso)
                    }
                    reso.ctx = reso.getContext("2d");
                    reso.ctx.drawImage(image, 0, 0, self.iw, self.ih);
                    image.parentNode.replaceChild(self, image);
                    self.reso = reso
                }
                self.pc = Math.min(Math.max((typeof options['level'] === 'number' ? options['level'] : snapfit.defaultLevel), 0), 6);
                self.sv = Math.min(Math.max((typeof options['snap'] === 'number' ? options['snap'] : snapfit.defaultSnap), 1), 24);
                self.tof = (typeof options['tofront'] === 'boolean' ? options['tofront'] : snapfit.defaultTofront);
                self.fui = (typeof options['forcetui'] === 'boolean' ? options['forcetui'] : snapfit.defaultForcetouchui);
                self.nak = (typeof options['nokeys'] === 'boolean' ? options['nokeys'] : snapfit.defaultNokeys);
                self.ply = (typeof options['polygon'] === 'boolean' ? options['polygon'] : snapfit.defaultPolygon);
                self.pos = (typeof options['simple'] === 'boolean' ? options['simple'] : snapfit.defaultSimple);
                self.mix = (typeof options['mixed'] === 'boolean' ? options['mixed'] : snapfit.defaultMixed);
                self.cb = (typeof options['callback'] === 'function' ? options['callback'] : snapfit.defaultCallback);
                self.bw = Math.min(Math.max((typeof options['bwide'] === 'number' ? options['bwide'] : snapfit.defaultBorderwide), 1.0), 6.0);
                self.bo = Math.min(Math.max((typeof options['bopacity'] === 'number' ? options['bopacity'] : snapfit.defaultBorderopacity), 0.0), 1.0);
                self.ao = Math.min(Math.max((typeof options['aopacity'] === 'number' ? options['aopacity'] : snapfit.defaultAreaopacity), 0.0), 1.0);
                self.so = Math.min(Math.max((typeof options['sopacity'] === 'number' ? options['sopacity'] : snapfit.defaultShadowopacity), 0.0), 1.0);
                self.hxs = dec2hex(parseInt((1 - self.so) * 255));
                self.lsd = 300;
                self.nhc = false;
                self.ab = (typeof options['aborder'] === 'boolean' ? options['aborder'] : snapfit.defaultAreaborder);
                self.ai = (typeof options['aimage'] === 'boolean' ? options['aimage'] : snapfit.defaultAreaimage);
                self.bcl = (typeof options['bcolor'] === 'string' ? options['bcolor'].match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i) ? options['bcolor'] : snapfit.defaultBgrndcolor : snapfit.defaultBgrndcolor);
                self.fcl = (typeof options['fcolor'] === 'string' ? options['fcolor'].match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i) ? options['fcolor'] : snapfit.defaultFalsecolor : snapfit.defaultFalsecolor);
                self.acl = (typeof options['acolor'] === 'string' ? options['acolor'].match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i) ? options['acolor'] : snapfit.defaultAreacolor : snapfit.defaultAreacolor);
                self.mcl = (typeof options['mcolor'] === 'string' ? options['mcolor'].match(/^#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]$/i) ? options['mcolor'] : snapfit.defaultMatchcolor : snapfit.defaultMatchcolor);
                self.aos = navigator.userAgent.match(/android/i);
                self.ios = navigator.platform.match(/iPad|iPhone|iPod/i);
                self.stg = typeof (document.ontouchstart) != "undefined" ? true : false;
                self.tod = self.stg && (self.ios || self.aos || self.fui) ? true : false;
                self.tmp = Math.min(self.iw, self.ih) / (self.ply ? 2 : 1);
                self.sz = [Math.min(self.tmp, 160), Math.min(self.tmp, 128), Math.min(self.tmp, 104), Math.min(self.tmp, 80), Math.min(self.tmp, 64), Math.min(self.tmp, 56), Math.min(self.tmp, 48)];
                self.dbc = hex2rgb(self.bcl);
                self.dfc = hex2rgb(self.fcl);
                self.dac = hex2rgb(self.acl);
                self.dmc = hex2rgb(self.mcl);
                self.currtap = 0;
                self.lasttap = 0;
                self.style.MozUserSelect = "none";
                self.style.KhtmlUserSelect = "none";
                self.style.WebkitUserSelect = "none";
                self.style.WebkitTouchCallout = "none";
                self.unselectable = "on";
                self.offsetX = snapfit._xoff(self);
                self.offsetY = snapfit._yoff(self);
                self.deltaX = 0;
                self.deltaY = 0;
                self.evtX = 0;
                self.evtY = 0;
                self.dragging = false;
                self.progress = false;
                self.solved = false;
                self.admixed = false;
                self.cur = -1;
                snapfit.reset(self, self.pc, true);
                if (self.mix) {
                    snapfit.admix(self, self.pos, true)
                }
                if (self.vml) {
                    self.oncontextmenu = function () {
                        return false
                    };
                    if (!self.nak) {
                        self.onmouseenter = this._catchEnter;
                        self.onmouseleave = this._catchLeave
                    }
                } else {
                    self.ctx = self.getContext("2d");
                    self.ctx.shadowOffsetX = 4;
                    self.ctx.shadowOffsetY = 4;
                    self.ctx.shadowBlur = 6;
                    self.ctx.shadowColor = "rgba(0,0,0,0)";
                    if (self.tod) {
                        self.ontouchstart = this._catchTouch
                    } else {
                        self.onmousedown = this._isPressed;
                        self.onmousemove = this._isDragged;
                        self.onmouseup = this._isReleased;
                        self.ondblclick = this._isDblclicked;
                        self.onmouseout = this._isReleased;
                        self.onclick = function () {
                            return false
                        };
                        self.oncontextmenu = function () {
                            return false
                        };
                        if (!self.nak) {
                            self.onmouseover = this._catchOver;
                            self.addEventListener('mouseout', this._catchOut, false)
                        }
                    }
                }
                snapfit._paint(self);
                return true
            }
            return false
        }
        return false
    },
    remove: function (self) {
        if (!self.progress && (self.getContext || self.tagName.toUpperCase() == "VAR")) {
            var obj = self.parentNode,
                img = document.createElement('img');
            if (self.wk4) {
                obj.removeChild(document.getElementById(self.id + '_buffer'))
            }
            img.id = self.id;
            img.alt = self.alt;
            img.title = self.title;
            img.src = self.img;
            img.className = self.className;
            img.style.cssText = self.style.cssText;
            img.style.height = self.height + 'px';
            img.style.width = self.width + 'px';
            obj.replaceChild(img, self)
        }
    },
    reset: function (self, pres, option) {
        if (!self.progress && (self.getContext || self.tagName.toUpperCase() == "VAR")) {
            self.progress = true;
            self.style.cursor = self.vml ? 'wait' : 'progress';
            self.pc = Math.min(Math.max((typeof pres === 'number' ? pres : self.pc), 0), 6);
            var i, j, a, t, m, xo, yo, wp, wf, hp, hf, tw, th, lt, lc, lb, ct, cc, cb, rt, rc, rb, z = 0,
                n = self.sz[self.pc],
                p = {};
            t = self.iw / n;
            wp = Math.round(t);
            tw = self.iw / wp;
            wf = tw / self.iw;
            xo = wf * .25;
            t = self.ih / n;
            hp = Math.round(t);
            th = self.ih / hp;
            hf = th / self.ih;
            yo = hf * .25;
            m = [
                [0, 0],
                [0, hf],
                [wf, hf],
                [wf, 0]
            ];
            self.obj = [];
            if (self.ply) {
                p.lt = [
                    [0, 0],
                    [0, hf],
                    [xo, hf],
                    [wf / 2, hf + yo],
                    [wf - xo, hf],
                    [wf, hf],
                    [wf, hf - yo],
                    [wf + xo, hf / 2],
                    [wf, yo],
                    [wf, 0]
                ];
                p.ltz = snapfit._shade(p.lt, self.lsd, self.nhc);
                p.ct = [
                    [0, 0],
                    [0, yo],
                    [xo, hf / 2],
                    [0, hf - yo],
                    [0, hf],
                    [xo, hf],
                    [wf / 2, hf + yo],
                    [wf - xo, hf],
                    [wf, hf],
                    [wf, hf - yo],
                    [wf + xo, hf / 2],
                    [wf, yo],
                    [wf, 0]
                ];
                p.ctz = snapfit._shade(p.ct, self.lsd, self.nhc);
                p.rt = [
                    [0, 0],
                    [0, yo],
                    [xo, hf / 2],
                    [0, hf - yo],
                    [0, hf],
                    [xo, hf],
                    [wf / 2, hf + yo],
                    [wf - xo, hf],
                    [wf, hf],
                    [wf, 0]
                ];
                p.rtz = snapfit._shade(p.rt, self.lsd, self.nhc);
                p.lc = [
                    [0, 0],
                    [0, hf],
                    [xo, hf],
                    [wf / 2, hf + yo],
                    [wf - xo, hf],
                    [wf, hf],
                    [wf, hf - yo],
                    [wf + xo, hf / 2],
                    [wf, yo],
                    [wf, 0],
                    [wf - xo, 0],
                    [wf / 2, yo],
                    [xo, 0]
                ];
                p.lcz = snapfit._shade(p.lc, self.lsd, self.nhc);
                p.cc = [
                    [0, 0],
                    [0, yo],
                    [xo, hf / 2],
                    [0, hf - yo],
                    [0, hf],
                    [xo, hf],
                    [wf / 2, hf + yo],
                    [wf - xo, hf],
                    [wf, hf],
                    [wf, hf - yo],
                    [wf + xo, hf / 2],
                    [wf, yo],
                    [wf, 0],
                    [wf - xo, 0],
                    [wf / 2, yo],
                    [xo, 0]
                ];
                p.ccz = snapfit._shade(p.cc, self.lsd, self.nhc);
                p.rc = [
                    [0, 0],
                    [0, yo],
                    [xo, hf / 2],
                    [0, hf - yo],
                    [0, hf],
                    [xo, hf],
                    [wf / 2, hf + yo],
                    [wf - xo, hf],
                    [wf, hf],
                    [wf, 0],
                    [wf - xo, 0],
                    [wf / 2, yo],
                    [xo, 0]
                ];
                p.rcz = snapfit._shade(p.rc, self.lsd, self.nhc);
                p.lb = [
                    [0, 0],
                    [0, hf],
                    [wf, hf],
                    [wf, hf - yo],
                    [wf + xo, hf / 2],
                    [wf, yo],
                    [wf, 0],
                    [wf - xo, 0],
                    [wf / 2, yo],
                    [xo, 0]
                ];
                p.lbz = snapfit._shade(p.lb, self.lsd, self.nhc);
                p.cb = [
                    [0, 0],
                    [0, yo],
                    [xo, hf / 2],
                    [0, hf - yo],
                    [0, hf],
                    [wf, hf],
                    [wf, hf - yo],
                    [wf + xo, hf / 2],
                    [wf, yo],
                    [wf, 0],
                    [wf - xo, 0],
                    [wf / 2, yo],
                    [xo, 0]
                ];
                p.cbz = snapfit._shade(p.cb, self.lsd, self.nhc);
                p.rb = [
                    [0, 0],
                    [0, yo],
                    [xo, hf / 2],
                    [0, hf - yo],
                    [0, hf],
                    [wf, hf],
                    [wf, 0],
                    [wf - xo, 0],
                    [wf / 2, yo],
                    [xo, 0]
                ];
                p.rbz = snapfit._shade(p.rb, self.lsd, self.nhc);
                for (i = 0; i < hp; i++) {
                    if (i == 0) {
                        for (j = 0; j < wp; j++) {
                            self.obj[z] = new Object();
                            self.obj[z].a = 0;
                            self.obj[z].f = 0;
                            self.obj[z].m = 0;
                            self.obj[z].x = (j * wf);
                            self.obj[z].y = (i * hf);
                            if (j == 0) {
                                self.obj[z].s = 0;
                                self.obj[z].w = wf + xo;
                                self.obj[z].h = hf + yo;
                                self.obj[z].t = p.lt;
                                self.obj[z].l = p.ltz
                            } else if (j == (wp - 1)) {
                                self.obj[z].s = 1;
                                self.obj[z].w = wf;
                                self.obj[z].h = hf + yo;
                                self.obj[z].t = p.rt;
                                self.obj[z].l = p.rtz
                            } else {
                                self.obj[z].s = 0;
                                self.obj[z].w = wf + xo;
                                self.obj[z].h = hf + yo;
                                self.obj[z].t = p.ct;
                                self.obj[z].l = p.ctz
                            }
                            z++
                        }
                    } else if (i == (hp - 1)) {
                        for (j = 0; j < wp; j++) {
                            self.obj[z] = new Object();
                            self.obj[z].a = 0;
                            self.obj[z].f = 0;
                            self.obj[z].m = 0;
                            self.obj[z].x = (j * wf);
                            self.obj[z].y = (i * hf);
                            if (j == 0) {
                                self.obj[z].s = 2;
                                self.obj[z].w = wf + xo;
                                self.obj[z].h = hf;
                                self.obj[z].t = p.lb;
                                self.obj[z].l = p.lbz
                            } else if (j == (wp - 1)) {
                                self.obj[z].s = 3;
                                self.obj[z].w = wf;
                                self.obj[z].h = hf;
                                self.obj[z].t = p.rb;
                                self.obj[z].l = p.rbz
                            } else {
                                self.obj[z].s = 2;
                                self.obj[z].w = wf + xo;
                                self.obj[z].h = hf;
                                self.obj[z].t = p.cb;
                                self.obj[z].l = p.cbz
                            }
                            z++
                        }
                    } else {
                        for (j = 0; j < wp; j++) {
                            self.obj[z] = new Object();
                            self.obj[z].a = 0;
                            self.obj[z].f = 0;
                            self.obj[z].m = 0;
                            self.obj[z].x = (j * wf);
                            self.obj[z].y = (i * hf);
                            if (j == 0) {
                                self.obj[z].s = 0;
                                self.obj[z].w = wf + xo;
                                self.obj[z].h = hf + yo;
                                self.obj[z].t = p.lc;
                                self.obj[z].l = p.lcz
                            } else if (j == (wp - 1)) {
                                self.obj[z].s = 1;
                                self.obj[z].w = wf;
                                self.obj[z].h = hf + yo;
                                self.obj[z].t = p.rc;
                                self.obj[z].l = p.rcz
                            } else {
                                self.obj[z].s = 0;
                                self.obj[z].w = wf + xo;
                                self.obj[z].h = hf + yo;
                                self.obj[z].t = p.cc;
                                self.obj[z].l = p.ccz
                            }
                            z++
                        }
                    }
                }
            } else {
                for (i = 0; i < hp; i++) {
                    for (j = 0; j < wp; j++) {
                        self.obj[z] = new Object();
                        self.obj[z].a = 0;
                        self.obj[z].f = 0;
                        self.obj[z].m = 0;
                        self.obj[z].x = (j * wf);
                        self.obj[z].y = (i * hf);
                        self.obj[z].w = wf;
                        self.obj[z].h = hf;
                        self.obj[z].t = m;
                        z++
                    }
                }
            }
            for (i = 0; i < self.obj.length; i++) {
                a = [];
                t = self.obj[i].t;
                for (j = 0; j < t.length; j++) {
                    a[j] = [t[j][0] * self.iw, t[j][1] * self.ih]
                }
                self.obj[i].q = true;
                self.obj[i].z = true;
                self.obj[i].t = a;
                self.obj[i].w = self.obj[i].w * self.iw;
                self.obj[i].h = self.obj[i].h * self.ih;
                self.obj[i].x = self.xo + (self.obj[i].x * self.iw);
                self.obj[i].y = self.yo + (self.obj[i].y * self.ih);
                self.obj[i].ox = self.obj[i].x - self.xo;
                self.obj[i].oy = self.obj[i].y - self.yo;
                self.obj[i].ow = self.obj[i].w;
                self.obj[i].oh = self.obj[i].h
            }
            if (self.vml) {
                var ele, head, foot, fill, back, parts = '';
                head = '<v:group oncontextmenu="return false" unselectable="on" style="zoom:1;display:' + self.dpl + ';margin:0px;padding:0px;position:relative;width:' + self.width + 'px;height:' + self.height + 'px;" coordsize="' + self.width + ',' + self.height + '"><v:rect oncontextmenu="return false" unselectable="on" strokeweight="0" filled="f" stroked="f" strokeweight="0" style="zoom:1;margin:0;padding:0;display:block;position:absolute;top:0px;left:0px;width:' + self.width + 'px;height:' + self.height + 'px;"></v:rect>';
                foot = '</v:group>';
                back = '<v:rect oncontextmenu="return false" unselectable="on" filled="t" stroked="' + (!self.ai && self.ab ? 't' : 'f') + '" strokeweight="' + (!self.ai && self.ab ? 1 : 0) + '" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:' + self.yo + 'px;left:' + self.xo + 'px;width:' + self.iw + 'px;height:' + self.ih + 'px; filter:Alpha(opacity=' + (self.ai ? 0 : self.ao * 100) + ')"><v:fill color="' + self.acl + '" /></v:rect>';
                fill = '<v:rect oncontextmenu="return false" unselectable="on" filled="t" stroked="' + (self.ai && self.ab ? 't' : 'f') + '" strokeweight="' + (self.ai && self.ab ? 1 : 0) + '" style="zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:' + self.yo + 'px;left:' + self.xo + 'px;width:' + self.iw + 'px;height:' + self.ih + 'px; filter:Alpha(opacity=' + (self.ai ? self.ao * 100 : 0) + ')"><v:fill src="' + self.img + '" type="frame" aspect="atleast" /></v:rect>';
                var p, l, wl, hl, k = 0,
                    x = .5,
                    y = .5,
                    w = parseFloat(1 / wp),
                    h = parseFloat(1 / hp);
                tw = wp;
                th = hp;
                if (self.ply) {
                    wl = (self.obj[self.obj.length - 1].w / self.obj[0].w);
                    hl = (self.obj[self.obj.length - 1].h / self.obj[0].h);
                    if (wp <= 2) {
                        xo = 0.5 - ((1 - wl) / 1.5)
                    } else {
                        xo = 0.5 - (0.5 * (1 - wl) / (wp * .5))
                    } if (hp <= 2) {
                        yo = 0.5 - ((1 - hl) / 1.5)
                    } else {
                        yo = 0.5 - (0.5 * (1 - hl) / (hp * .5))
                    }
                }
                for (i = 0; i < hp; i++) {
                    for (j = 0; j < wp; j++) {
                        t = self.obj[k].t;
                        if (self.ply) {
                            tw = parseFloat(self.iw / self.obj[k].w);
                            th = parseFloat(self.ih / self.obj[k].h);
                            if (self.obj[k].s == 3) {
                                x = .5;
                                y = .5
                            } else {
                                x = self.obj[k].s == 0 || self.obj[k].s == 2 ? xo : .5;
                                y = self.obj[k].s == 0 || self.obj[k].s == 1 ? yo : .5
                            }
                        }
                        p = "m " + parseInt(t[0][0] * 100) + "," + parseInt(t[0][1] * 100);
                        for (l = 1; l < t.length; l++) {
                            p += " l " + parseInt(t[l][0] * 100) + "," + parseInt(t[l][1] * 100)
                        }
                        p += " x e";
                        parts += '<v:shape id="' + self.id + '|obj_' + k + '" oncontextmenu="return false" unselectable="on" filled="t" stroked="t" strokeweight="1" strokecolor="' + self.bcl + '" coordorigin="0,0" coordsize="' + parseInt(self.obj[k].w * 100) + ',' + parseInt(self.obj[k].h * 100) + '" path="' + p + '" style="cursor:hand;zoom:1;margin:0px;padding:0px;display:block;position:absolute;top:' + self.obj[k].y + 'px;left:' + self.obj[k].x + 'px;width:' + self.obj[k].w + 'px;height:' + self.obj[k].h + 'px; filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=0);"><v:fill color="' + self.bcl + '" opacity="1" src="' + self.img + '" type="frame" aspect="atleast" size="' + tw + ',' + th + '" origin="' + ((j + x - (wp * x)) * w) + ',' + ((i + y - (hp * y)) * h) + '" position="0,0" /></v:shape>';
                        k++
                    }
                }
                self.innerHTML = head + back + fill + parts + foot;
                for (i = 0; i < self.obj.length; i++) {
                    ele = document.getElementById(self.id + '|obj_' + i);
                    ele.ondblclick = snapfit._ieDblclicked;
                    ele.onmousedown = snapfit._iePressed
                }
            }
            if (window.opera) {
                for (i = 0; i < self.obj.length; i++) {
                    self.obj[i].ow = self.obj[i].ow - 0.001;
                    self.obj[i].oh = self.obj[i].oh - 0.001
                }
            }
            if (!option) {
                snapfit._paint(self)
            }
            self.style.cursor = 'auto';
            self.progress = false;
            self.solved = true;
            return true
        } else {
            return false
        }
    },
    admix: function (self, simple, option) {
        simple = simple || false;
        if (!self.progress && (self.getContext || self.tagName.toUpperCase() == "VAR")) {
            function R(v) {
                return Math.floor(Math.random() * v)
            }
            var ele, i, j, l, r, a = 90;
            self.solved = false;
            self.admixed = false;
            self.progress = true;
            if (self.vml) {
                self.style.cursor = 'wait';
                for (i = 0; i < self.obj.length; i++) {
                    ele = document.getElementById(self.id + '|obj_' + i);
                    if (!simple) {
                        l = R(4);
                        self.obj[i].a = l * 90;
                        self.obj[i].f = R(2);
                        ele.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + parseInt(self.obj[i].a / 90) + ", mirror=" + self.obj[i].f + ")";
                        ele.firstChild.color = self.bcl;
                        ele.firstChild.opacity = self.obj[i].f ? self.bo : 1
                    }
                    self.obj[i].x = R(self.width - self.obj[i].w);
                    self.obj[i].y = R(self.height - self.obj[i].h);
                    ele.style.left = self.obj[i].x + 'px';
                    ele.style.top = self.obj[i].y + 'px'
                }
            } else {
                self.style.cursor = 'progress';
                for (i = 0; i < self.obj.length; i++) {
                    self.obj[i].x = R(self.width - self.obj[i].w);
                    self.obj[i].y = R(self.height - self.obj[i].h);
                    l = R(4);
                    if (!simple) {
                        for (j = 0; j < l; j++) {
                            r = self.obj[i].a;
                            self.obj[i] = snapfit._rotate(self.obj[i], self.width, self.height, a, self.ply, self.lsd, self.nhc);
                            self.obj[i].a = r < (360 - a) ? self.obj[i].a + a : 0
                        }
                        if (R(2)) {
                            self.obj[i].t = snapfit._flipY(self.obj[i].t, self.obj[i].x, self.obj[i].w);
                            if (self.ply) {
                                self.obj[i].l = snapfit._shade(self.obj[i].t, self.lsd, self.nhc)
                            }
                            if (self.obj[i].a == 90 || self.obj[i].a == 270) {
                                self.obj[i].m = self.obj[i].m ? 0 : 1
                            } else {
                                self.obj[i].f = self.obj[i].f ? 0 : 1
                            }
                        }
                        if (R(2)) {
                            self.obj[i].t = snapfit._flipX(self.obj[i].t, self.obj[i].y, self.obj[i].h);
                            if (self.ply) {
                                self.obj[i].l = snapfit._shade(self.obj[i].t, self.lsd, self.nhc)
                            }
                            if (self.obj[i].a == 90 || self.obj[i].a == 270) {
                                self.obj[i].f = self.obj[i].f ? 0 : 1
                            } else {
                                self.obj[i].m = self.obj[i].m ? 0 : 1
                            }
                        }
                    }
                }
                if (!option) {
                    snapfit._paint(self)
                }
            }
            for (i = 0; i < self.obj.length; i++) {
                p = self.obj[i];
                if ((p.f && p.m && p.a == 180) || (!p.f && !p.m && p.a == 0)) {
                    if (p.x != (p.ox + self.xo) || p.x != (p.ox + self.xo) || p.y != (p.oy + self.yo) || p.y != (p.oy + self.yo)) {
                        self.obj[i].z = true
                    } else {
                        self.obj[i].z = false
                    }
                } else {
                    self.obj[i].z = false
                }
            }
            for (i = 0; i < self.obj.length; i++) {
                self.obj[i].q = false
            }
            self.style.cursor = 'auto';
            self.progress = false;
            self.solved = false;
            self.admixed = true;
            return true
        } else {
            return false
        }
    },
    solve: function (self, option) {
        if (!self.progress && (self.getContext || self.tagName.toUpperCase() == "VAR")) {
            var i, j, l, p, r, odd = 0,
                m = 4,
                a = 90,
                n = snapfit._isSolved(self);
            if (!n) {
                if (self.vml) {
                    for (i = 0; i < self.obj.length; i++) {
                        odd = document.getElementById(self.id + '|obj_' + i);
                        self.obj[i].f = 0;
                        self.obj[i].a = 0;
                        self.obj[i].w = self.obj[i].ow;
                        self.obj[i].h = self.obj[i].oh;
                        odd.firstChild.opacity = 1;
                        odd.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=0)"
                    }
                    if (!option) {
                        if (self.timer) {
                            window.clearInterval(self.timer)
                        }
                        self.progress = true;
                        self.style.cursor = 'wait';
                        var q = 0,
                            c = 0,
                            t = 20,
                            k = 1 / t,
                            sx = [],
                            sy = [],
                            ex = [],
                            ey = [];
                        for (i = 0; i < self.obj.length; i++) {
                            sx[i] = self.obj[i].x;
                            sy[i] = self.obj[i].y;
                            ex[i] = self.obj[i].ox + self.xo;
                            ey[i] = self.obj[i].oy + self.yo
                        }
                        self.timer = window.setInterval(function () {
                            q = ((-Math.cos((k * c) * Math.PI) / 2) + 0.5) || 0;
                            for (i = 0; i < self.obj.length; i++) {
                                odd = document.getElementById(self.id + '|obj_' + i);
                                odd.style.left = Math.ceil(sx[i] + (q * (ex[i] - sx[i]))) + 'px';
                                odd.style.top = Math.ceil(sy[i] + (q * (ey[i] - sy[i]))) + 'px'
                            }
                            c++;
                            if (c > t) {
                                window.clearInterval(self.timer);
                                for (i = 0; i < self.obj.length; i++) {
                                    self.obj[i].x = self.obj[i].ox + self.xo;
                                    self.obj[i].y = self.obj[i].oy + self.yo;
                                    self.obj[i].z = true;
                                    odd = document.getElementById(self.id + '|obj_' + i);
                                    odd.style.left = self.obj[i].x + 'px';
                                    odd.style.top = self.obj[i].y + 'px'
                                }
                                self.style.cursor = 'auto';
                                self.progress = false
                            }
                        }, 30)
                    }
                } else {
                    for (i = 0; i < self.obj.length; i++) {
                        odd = self.obj[i].a == 90 || self.obj[i].a == 270 ? 1 : 0;
                        if ((self.obj[i].m && odd) || self.obj[i].f) {
                            self.obj[i].t = snapfit._flipY(self.obj[i].t, self.obj[i].x, self.obj[i].w);
                            if (self.ply) {
                                self.obj[i].l = snapfit._shade(self.obj[i].t, self.lsd, self.nhc)
                            }
                            if (odd) {
                                self.obj[i].m = self.obj[i].m ? 0 : 1
                            } else {
                                self.obj[i].f = self.obj[i].f ? 0 : 1
                            }
                        }
                        if ((self.obj[i].f && odd) || self.obj[i].m) {
                            self.obj[i].t = snapfit._flipX(self.obj[i].t, self.obj[i].y, self.obj[i].h);
                            if (self.ply) {
                                self.obj[i].l = snapfit._shade(self.obj[i].t, self.lsd, self.nhc)
                            }
                            if (odd) {
                                self.obj[i].f = self.obj[i].f ? 0 : 1
                            } else {
                                self.obj[i].m = self.obj[i].m ? 0 : 1
                            }
                        }
                        if ((self.obj[i].m && odd) || self.obj[i].f) {
                            self.obj[i].t = snapfit._flipY(self.obj[i].t, self.obj[i].x, self.obj[i].w);
                            if (self.ply) {
                                self.obj[i].l = snapfit._shade(self.obj[i].t, self.lsd, self.nhc)
                            }
                            if (odd) {
                                self.obj[i].m = self.obj[i].m ? 0 : 1
                            } else {
                                self.obj[i].f = self.obj[i].f ? 0 : 1
                            }
                        }
                        if ((self.obj[i].f && odd) || self.obj[i].m) {
                            self.obj[i].t = snapfit._flipX(self.obj[i].t, self.obj[i].y, self.obj[i].h);
                            if (self.ply) {
                                self.obj[i].l = snapfit._shade(self.obj[i].t, self.lsd, self.nhc)
                            }
                            if (odd) {
                                self.obj[i].f = self.obj[i].f ? 0 : 1
                            } else {
                                self.obj[i].m = self.obj[i].m ? 0 : 1
                            }
                        }
                        n = self.obj[i].a / 90;
                        l = n > 0 ? m - n : 0;
                        for (j = 0; j < l; j++) {
                            r = self.obj[i].a;
                            self.obj[i] = snapfit._rotate(self.obj[i], self.width, self.height, a, self.ply, self.lsd, self.nhc);
                            self.obj[i].a = r < (360 - a) ? self.obj[i].a + a : 0
                        }
                        if (option) {
                            self.obj[i].x = self.obj[i].ox + self.xo;
                            self.obj[i].y = self.obj[i].oy + self.yo;
                            self.obj[i].z = true
                        }
                    }
                    if (!option) {
                        if (self.timer) {
                            window.clearInterval(self.timer)
                        }
                        self.progress = true;
                        self.style.cursor = 'progress';
                        var q = 0,
                            c = 0,
                            t = 20,
                            k = 1 / t,
                            sx = [],
                            sy = [],
                            ex = [],
                            ey = [];
                        for (i = 0; i < self.obj.length; i++) {
                            sx[i] = self.obj[i].x;
                            sy[i] = self.obj[i].y;
                            ex[i] = self.obj[i].ox + self.xo;
                            ey[i] = self.obj[i].oy + self.yo
                        }
                        self.timer = window.setInterval(function () {
                            q = ((-Math.cos((k * c) * Math.PI) / 2) + 0.5) || 0;
                            for (i = 0; i < self.obj.length; i++) {
                                self.obj[i].x = Math.ceil(sx[i] + (q * (ex[i] - sx[i])));
                                self.obj[i].y = Math.ceil(sy[i] + (q * (ey[i] - sy[i])))
                            }
                            c++;
                            snapfit._paint(self);
                            if (c > t) {
                                window.clearInterval(self.timer);
                                for (i = 0; i < self.obj.length; i++) {
                                    self.obj[i].x = self.obj[i].ox + self.xo;
                                    self.obj[i].y = self.obj[i].oy + self.yo;
                                    self.obj[i].z = true
                                }
                                snapfit._paint(self);
                                self.style.cursor = 'auto';
                                self.progress = false
                            }
                        }, 30)
                    }
                }
                for (i = 0; i < self.obj.length; i++) {
                    self.obj[i].q = true
                }
                self.solved = true;
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    },
    _paint: function (self) {
        if (!self.vml && self.obj) {
            var p, c, k, i, j, xoff, yoff, angle, img = self.reso;
            self.ctx.clearRect(0, 0, self.width, self.height);
            self.ctx.fillStyle = "rgba(" + self.dac + "," + self.ao + ")";
            if (self.ab) {
                self.ctx.lineWidth = 1;
                self.ctx.strokeStyle = "rgba(0,0,0," + self.ao + ")";
                self.ctx.strokeRect(self.xo, self.yo, self.iw, self.ih)
            }
            if (self.ai) {
                self.ctx.globalAlpha = self.ao;
                self.ctx.drawImage(img, self.xo, self.yo, self.iw, self.ih);
                self.ctx.globalAlpha = 1.0
            } else {
                self.ctx.fillRect(self.xo, self.yo, self.iw, self.ih)
            }
            self.ctx.save();
            for (i = 0; i < self.obj.length; i++) {
                p = self.obj[i];
                self.ctx.save();
                if (i == self.cur) {
                    self.ctx.shadowColor = "rgba(0,0,0," + self.so + ")"
                }
                self.ctx.fillStyle = "rgba(" + self.dac + ",1)" || "rgba(255,255,255,1)";
                self.ctx.beginPath();
                self.ctx.moveTo(p.x + p.t[0][0], p.y + p.t[0][1]);
                for (j = 1; j < p.t.length; j++) {
                    self.ctx.lineTo(p.x + p.t[j][0], p.y + p.t[j][1])
                }
                self.ctx.closePath();
                self.ctx.fill();
                if (i == self.cur) {
                    self.ctx.shadowColor = "rgba(0,0,0,0)"
                }
                if (self.wk4) {
                    self.ctx.beginPath();
                    self.ctx.moveTo(p.x + p.t[0][0], p.y + p.t[0][1]);
                    for (j = 1; j < p.t.length; j++) {
                        self.ctx.lineTo(p.x + p.t[j][0], p.y + p.t[j][1])
                    }
                    self.ctx.closePath()
                }
                self.ctx.clip();
                if (self.ge8) {
                    self.ctx.fillStyle = "rgba(0,0,0,0)";
                    self.ctx.fillRect(p.x, p.y, p.w, p.h)
                }
                if (p.a != 0 || p.f || p.m) {
                    self.ctx.save();
                    xoff = p.x;
                    yoff = p.y;
                    angle = (p.a + (p.a >= 0 ? 0 : 360)) * Math.PI / 180;
                    self.ctx.translate(xoff, yoff);
                    self.ctx.rotate(angle);
                    self.ctx.scale((!p.f ? 1 : -1), (!p.m ? 1 : -1));
                    self.ctx.translate(-xoff, -yoff);
                    if (p.a == 90) {
                        self.ctx.drawImage(img, p.ox, p.oy, p.ow, p.oh, p.x - (p.f * p.ow), p.y - p.oh + (p.m * p.oh), p.ow, p.oh)
                    } else if (p.a == 180) {
                        self.ctx.drawImage(img, p.ox, p.oy, p.ow, p.oh, p.x - p.ow + (p.f * p.ow), p.y - p.oh + (p.m * p.oh), p.ow, p.oh)
                    } else if (p.a == 270) {
                        self.ctx.drawImage(img, p.ox, p.oy, p.ow, p.oh, p.x - p.ow + (p.f * p.ow), p.y - (p.m * p.oh), p.ow, p.oh)
                    } else {
                        self.ctx.drawImage(img, p.ox, p.oy, p.ow, p.oh, p.x - (p.f * p.ow), p.y - (p.m * p.oh), p.ow, p.oh)
                    }
                    self.ctx.restore()
                } else {
                    self.ctx.drawImage(img, p.ox, p.oy, p.ow, p.oh, p.x, p.y, p.w, p.h)
                }
                self.ctx.lineWidth = self.bw * 2;
                if (!self.progress && i == self.cur) {
                    if ((!p.f && p.m) || (p.f && !p.m)) {
                        self.ctx.fillStyle = "rgba(" + self.dbc + "," + self.bo + ")";
                        self.ctx.fillRect(p.x, p.y, p.w, p.h)
                    }
                    if ((p.f && p.m && p.a == 180) || (!p.f && !p.m && p.a == 0)) {
                        if (p.x <= (p.ox + self.xo + self.sv) && p.x >= (p.ox + self.xo - self.sv) && p.y <= (p.oy + self.yo + self.sv) && p.y >= (p.oy + self.yo - self.sv)) {
                            self.ctx.strokeStyle = "rgba(" + self.dmc + ",1)"
                        } else {
                            self.ctx.strokeStyle = "rgba(" + self.dfc + ",1)"
                        }
                    } else {
                        self.ctx.strokeStyle = "rgba(" + self.dfc + ",1)"
                    } if (self.ply) {
                        if (self.wk4 || self.ge8) {
                            self.ctx.beginPath();
                            self.ctx.moveTo(p.x + p.t[0][0], p.y + p.t[0][1]);
                            for (j = 1; j < p.t.length; j++) {
                                self.ctx.lineTo(p.x + p.t[j][0], p.y + p.t[j][1])
                            }
                            self.ctx.closePath()
                        }
                        self.ctx.stroke()
                    } else {
                        self.ctx.strokeRect(p.x, p.y, p.w, p.h)
                    }
                } else {
                    if (self.ply) {
                        if ((!p.f && p.m) || (p.f && !p.m)) {
                            self.ctx.fillStyle = "rgba(" + self.dbc + "," + self.bo + ")";
                            self.ctx.fillRect(p.x, p.y, p.w, p.h);
                            self.ctx.strokeStyle = "rgba(" + self.dbc + ",1)";
                            if (self.wk4 || self.ge8) {
                                self.ctx.beginPath();
                                self.ctx.moveTo(p.x + p.t[0][0], p.y + p.t[0][1]);
                                for (j = 1; j < p.t.length; j++) {
                                    self.ctx.lineTo(p.x + p.t[j][0], p.y + p.t[j][1])
                                }
                                self.ctx.closePath()
                            }
                            self.ctx.stroke()
                        } else {
                            for (j = 0; j < p.t.length; j++) {
                                c = p.l[j];
                                k = j < p.t.length - 1 ? j + 1 : 0;
                                self.ctx.strokeStyle = "rgba(" + c + "," + c + "," + c + "," + self.bo + ")";
                                self.ctx.beginPath();
                                self.ctx.moveTo(p.x + p.t[j][0], p.y + p.t[j][1]);
                                self.ctx.lineTo(p.x + p.t[k][0], p.y + p.t[k][1]);
                                self.ctx.stroke()
                            }
                        }
                    } else {
                        if ((!p.f && p.m) || (p.f && !p.m)) {
                            self.ctx.fillStyle = "rgba(" + self.dbc + "," + self.bo + ")";
                            self.ctx.fillRect(p.x, p.y, p.w, p.h);
                            self.ctx.strokeStyle = "rgba(" + self.dbc + ",1)";
                            self.ctx.strokeRect(p.x, p.y, p.w, p.h)
                        } else {
                            self.ctx.strokeStyle = "rgba(0,0,0," + self.bo + ")";
                            self.ctx.strokeRect(p.x - self.bw, p.y - self.bw, p.w + self.bw, p.h + self.bw);
                            self.ctx.strokeStyle = "rgba(255,255,255," + self.bo + ")";
                            self.ctx.strokeRect(p.x, p.y, p.w + self.bw, p.h + self.bw)
                        }
                    }
                }
                self.ctx.restore()
            }
            self.ctx.restore()
        }
        //document.getElementById(this.imageId).style.backgroundColor='red';
        //var that=this;
        //setTimeout(function(){document.getElementById(that.imageId).style.backgroundColor='red';},1000);
        //console.log('refreshing');
        return false
    },
    _catchTouch: function (e) {
        if (this.obj && e.touches.length == 1 && !this.progress) {
            e.preventDefault();
            this.cur = -1;

            function last(a, i) {
                var t = a[i];
                a.splice(i, 1);
                a.push(t);
                return a
            };
            this.dragging = false;
            this.currtap = new Date().getTime();
            this.evtX = e.touches[0].pageX - this.offsetX;
            this.evtY = e.touches[0].pageY - this.offsetY;
            var delay = (this.currtap - this.lasttap) || 0;
            if (delay < 400 && delay > 0) {
                this.lasttap = -1;
                this.cur = snapfit._isContained(this);
                if (this.cur > -1) {
                    var r = 90,
                        p = this.obj[this.cur];
                    if (p.f && !p.m) {
                        this.obj[this.cur].t = snapfit._flipY(p.t, p.x, p.w);
                        if (this.ply) {
                            this.obj[this.cur].l = snapfit._shade(this.obj[this.cur].t, this.lsd, this.nhc)
                        }
                        if (p.a == 90 || p.a == 270) {
                            this.obj[this.cur].m = p.m ? 0 : 1
                        } else {
                            this.obj[this.cur].f = p.f ? 0 : 1
                        }
                    } else if (!p.f && p.m) {
                        this.obj[this.cur].t = snapfit._flipX(p.t, p.y, p.h);
                        if (this.ply) {
                            this.obj[this.cur].l = snapfit._shade(this.obj[this.cur].t, this.lsd, this.nhc)
                        }
                        if (p.a == 90 || p.a == 270) {
                            this.obj[this.cur].f = p.f ? 0 : 1
                        } else {
                            this.obj[this.cur].m = p.m ? 0 : 1
                        }
                    } else {
                        this.obj[this.cur] = snapfit._rotate(p, this.width, this.height, r, this.ply, this.lsd, this.nhc);
                        this.obj[this.cur].a = p.a < (360 - r) ? p.a + r : 0
                    }
                    snapfit._isCatched(this, this.cur);
                    this.cur = -1;
                    snapfit._paint(this);
                    snapfit._ifSolved(this, this.cur)
                }
            } else {
                this.lasttap = this.currtap;
                this.cur = snapfit._isContained(this);
                if (this.cur > -1) {
                    if (this.cur != this.obj.length - 1) {
                        this.obj = last(this.obj, this.cur);
                        this.cur = this.obj.length - 1
                    }
                    this.deltaX = this.evtX - this.obj[this.cur].x;
                    this.deltaY = this.evtY - this.obj[this.cur].y;
                    this.ontouchmove = snapfit._touchMove;
                    this.ontouchend = snapfit._touchEnd;
                    this.dragging = true
                }
            }
        }
        return false
    },
    _touchMove: function (e) {

        if (e.touches.length == 1 && this.dragging && !this.progress) {
            this.evtX = e.touches[0].pageX - this.offsetX;
            this.evtY = e.touches[0].pageY - this.offsetY;
            this.obj[this.cur].x = Math.min(this.width - this.obj[this.cur].w, Math.max(0, this.evtX - this.deltaX));
            this.obj[this.cur].y = Math.min(this.height - this.obj[this.cur].h, Math.max(0, this.evtY - this.deltaY));
            snapfit._paint(this);
            document.getElementById(snapfit.imageId).style.backgroundColor='rgba(0, 0, 0, 0.01)';

        }
        return false
    },
    _touchEnd: function () {
        if (this.progress) {
            return false
        }
        if (this.dragging && !this.progress) {
            this.ontouchmove = null;
            this.ontouchend = null;
            this.dragging = false;
            snapfit._isCatched(this, this.cur);
            this.cur = -1;
            snapfit._paint(this);
            document.getElementById(snapfit.imageId).style.backgroundColor='rgba(0, 0, 0, 0)';
            snapfit._ifSolved(this, this.cur)
        }
        return false
    },
    _isPressed: function (e) {
        if (this.progress) {
            return false
        }

        function last(a, i) {
            var t = a[i];
            a.splice(i, 1);
            a.push(t);
            return a
        };
        if (this.obj) {
            this.evtX = e.pageX - this.offsetX;
            this.evtY = e.pageY - this.offsetY;
            this.cur = snapfit._isContained(this);
            if (this.cur > -1) {
                var p = this.obj[this.cur];
                if (this.cur != this.obj.length - 1) {
                    this.obj = last(this.obj, this.cur);
                    this.cur = this.obj.length - 1
                }
                if (e.which == 2) {
                    this.obj[this.cur].t = snapfit._flipY(p.t, p.x, p.w);
                    if (this.ply) {
                        this.obj[this.cur].l = snapfit._shade(this.obj[this.cur].t, this.lsd, this.nhc)
                    }
                    if (p.a == 90 || p.a == 270) {
                        this.obj[this.cur].m = p.m ? 0 : 1
                    } else {
                        this.obj[this.cur].f = p.f ? 0 : 1
                    }
                    snapfit._isCatched(this, this.cur);
                    this.cur = -1
                } else if (e.which == 3) {
                    this.obj[this.cur].t = snapfit._flipX(p.t, p.y, p.h);
                    if (this.ply) {
                        this.obj[this.cur].l = snapfit._shade(this.obj[this.cur].t, this.lsd, this.nhc)
                    }
                    if (p.a == 90 || p.a == 270) {
                        this.obj[this.cur].f = p.f ? 0 : 1
                    } else {
                        this.obj[this.cur].m = p.m ? 0 : 1
                    }
                    snapfit._isCatched(this, this.cur);
                    this.cur = -1
                } else {
                    this.dragging = true;
                    this.style.cursor = 'move';
                    this.deltaX = this.evtX - this.obj[this.cur].x;
                    this.deltaY = this.evtY - this.obj[this.cur].y
                }
                snapfit._paint(this)
            }
        }
        return false
    },
    _isDragged: function (e) {
        if (!this.dragging || this.progress) {
            return false
        }
        this.evtX = e.pageX - this.offsetX;
        this.evtY = e.pageY - this.offsetY;
        this.obj[this.cur].x = Math.min(this.width - this.obj[this.cur].w, Math.max(0, this.evtX - this.deltaX));
        this.obj[this.cur].y = Math.min(this.height - this.obj[this.cur].h, Math.max(0, this.evtY - this.deltaY));
        snapfit._paint(this);
        return false
    },
    _isReleased: function (e) {
        if (!this.dragging || this.progress) {
            return false
        }
        this.dragging = false;
        snapfit._isCatched(this, this.cur);
        this.style.cursor = 'auto';
        this.cur = -1;
        snapfit._paint(this);
        snapfit._ifSolved(this, this.cur);
        return false
    },
    _isDblclicked: function (e) {
        var shift = e.shiftKey,
            alt = e.altKey;
        this.dragging = false;
        this.style.cursor = 'auto';
        this.cur = -1;
        if (this.obj) {
            this.cur = snapfit._isContained(this);
            if (this.cur > -1) {
                var r = 90,
                    p = this.obj[this.cur];
                if (!shift && !alt) {
                    this.obj[this.cur] = snapfit._rotate(p, this.width, this.height, r, this.ply, this.lsd, this.nhc);
                    this.obj[this.cur].a = p.a < (360 - r) ? p.a + r : 0;
                    snapfit._isCatched(this, this.cur);
                    this.cur = -1
                } else if (shift && !alt) {
                    this.obj[this.cur].t = snapfit._flipY(p.t, p.x, p.w);
                    if (this.ply) {
                        this.obj[this.cur].l = snapfit._shade(this.obj[this.cur].t, this.lsd, this.nhc)
                    }
                    if (p.a == 90 || p.a == 270) {
                        this.obj[this.cur].m = p.m ? 0 : 1
                    } else {
                        this.obj[this.cur].f = p.f ? 0 : 1
                    }
                    snapfit._isCatched(this, this.cur);
                    this.cur = -1
                } else if (!shift && alt) {
                    this.obj[this.cur].t = snapfit._flipX(p.t, p.y, p.h);
                    if (this.ply) {
                        this.obj[this.cur].l = snapfit._shade(this.obj[this.cur].t, this.lsd, this.nhc)
                    }
                    if (p.a == 90 || p.a == 270) {
                        this.obj[this.cur].f = p.f ? 0 : 1
                    } else {
                        this.obj[this.cur].m = p.m ? 0 : 1
                    }
                    snapfit._isCatched(this, this.cur);
                    this.cur = -1
                }
                snapfit._paint(this);
                snapfit._ifSolved(this, this.cur)
            }
        }
        return false
    },
    _iePressed: function (e) {
        e = e ? e : window.event;
        var ele, fil, f, r, d, tmp = e.srcElement,
            c = tmp.id.split("_"),
            i = parseInt(c[c.length - 1]),
            obj = tmp.parentNode,
            par = tmp.parentNode.parentNode;
        if (!par.progress) {
            if (e.button == 2) {
                par.dragging = false;
                par.obj[i].f = par.obj[i].f ? 0 : 1;
                tmp.firstChild.color = par.bcl;
                tmp.firstChild.opacity = par.obj[i].f ? par.bo : 1;
                tmp.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + parseInt(par.obj[i].a / 90) + ", mirror=" + par.obj[i].f + ")";
                snapfit._isCatched(par, i);
                tmp.style.left = par.obj[i].x + 'px';
                tmp.style.top = par.obj[i].y + 'px'
            } else {
                r = parseInt(par.obj[i].a);
                if (r == 0 || r == 180) {
                    d = r + 135
                } else {
                    d = r - 45
                }
                d = par.obj[i].f ? d + 90 : d;
                tmp.style.filter = "progid:DXImageTransform.Microsoft.Shadow(Color=" + par.hxs + ", direction=" + d + "), progid:DXImageTransform.Microsoft.BasicImage(rotation=" + parseInt(par.obj[i].a / 90) + ", mirror=" + par.obj[i].f + ")";
                ele = document.createElement('v:shape');
                ele.id = tmp.id;
                ele.unselectable = "on";
                ele.oncontextmenu = function () {
                    return false
                };
                ele.filled = tmp.filled;
                ele.stroked = tmp.stroked;
                ele.strokeweight = tmp.strokeweight;
                ele.strokecolor = tmp.strokecolor;
                ele.coordorigin = tmp.coordorigin;
                ele.coordsize = tmp.coordsize;
                ele.path = tmp.path;
                ele.style.cssText = tmp.style.cssText;
                fil = document.createElement('v:fill');
                fil = tmp.firstChild;
                obj.removeChild(tmp);
                obj.appendChild(ele);
                ele.appendChild(fil);
                ele.style.cursor = "move";
                ele.firstChild.color = par.bcl;
                ele.mouseX = e.clientX;
                ele.mouseY = e.clientY;
                ele.ondblclick = snapfit._ieDblclicked;
                ele.onmousedown = snapfit._iePressed;
                ele.onmouseleave = snapfit._ieReleased;
                ele.strokecolor = snapfit._isCatched(par, i) ? par.mcl : par.fcl;
                document.attachEvent("onmousemove", snapfit._ieDragged);
                document.attachEvent("onmouseup", snapfit._ieReleased);
                cvi_stpiece = ele.id;
                par.dragging = true
            }
        }
        return false
    },
    _ieDragged: function (e) {
        e = e ? e : window.event;
        var l, t, ele = e.srcElement,
            c = ele.id.split("_"),
            i = parseInt(c[c.length - 1]),
            par = ele.parentNode.parentNode;
        if (!par.progress && par.dragging) {
            if (cvi_stpiece == ele.id) {
                l = Math.max(0, Math.min(par.width - parseInt(par.obj[i].w), parseInt(ele.style.left) + (e.clientX - ele.mouseX)));
                t = Math.max(0, Math.min(par.height - parseInt(par.obj[i].h), parseInt(ele.style.top) + (e.clientY - ele.mouseY)));
                par.obj[i].x = l;
                par.obj[i].y = t;
                ele.firstChild.color = par.bcl;
                ele.style.left = l + 'px';
                ele.style.top = t + 'px';
                ele.mouseX = e.clientX;
                ele.mouseY = e.clientY;
                ele.strokecolor = snapfit._isCatched(par, i) ? par.mcl : par.fcl
            } else {
                snapfit._ieReleased(e)
            }
        }
        return false
    },
    _ieReleased: function (e) {
        e = e ? e : window.event;
        var f, ele = document.getElementById(cvi_stpiece),
            c = ele.id.split("_"),
            i = parseInt(c[c.length - 1]),
            par = ele.parentNode.parentNode;
        if (ele && !par.progress && par.dragging) {
            cvi_stpiece = null;
            ele.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + parseInt(par.obj[i].a / 90) + ", mirror=" + par.obj[i].f + ")";
            snapfit._isCatched(par, i);
            ele.style.cursor = "hand";
            ele.onmouseleave = null;
            ele.strokecolor = par.bcl;
            ele.style.left = par.obj[i].x + 'px';
            ele.style.top = par.obj[i].y + 'px';
            document.detachEvent("onmousemove", snapfit._ieDragged);
                    console.log("dropped");
            document.detachEvent("onmouseup", snapfit._ieReleased);
            par.dragging = false;
            snapfit._ifSolved(par, par.cur)
        }
        return false
    },
    _ieDblclicked: function (e) {
        e = e ? e : window.event;
        var f, ele = e.srcElement,
            c = ele.id.split("_"),
            i = parseInt(c[c.length - 1]),
            par = ele.parentNode.parentNode,
            shift = e.shiftKey,
            alt = e.altKey,
            r = 90;
        if (!par.progress) {
            par.dragging = false;
            ele.style.cursor = 'auto';
            if (!shift && !alt) {
                par.obj[i].a = par.obj[i].a < (360 - r) ? par.obj[i].a + r : 0;
                c = par.obj[i].w;
                par.obj[i].w = par.obj[i].h;
                par.obj[i].h = c
            } else {
                par.obj[i].f = par.obj[i].f ? 0 : 1;
                ele.firstChild.color = par.bcl;
                ele.firstChild.opacity = par.obj[i].f ? par.bo : 1
            }
            ele.style.filter = "progid:DXImageTransform.Microsoft.BasicImage(rotation=" + parseInt(par.obj[i].a / 90) + ", mirror=" + par.obj[i].f + ")";
            snapfit._isCatched(par, i);
            ele.style.left = par.obj[i].x + 'px';
            ele.style.top = par.obj[i].y + 'px';
            snapfit._ifSolved(par, par.cur)
        }
        return false
    },
    _isKeydown: function (e) {
        if (cvi_stactive != null) {
            var k, del = 46,
                esc = 27,
                ent = 13,
                bsp = 8,
                self = document.getElementById(cvi_stactive);
            if (self.dragging || self.progress) {
                return false
            }
            k = (e.keyCode ? e.keyCode : e.which);
            switch (k) {
            case esc:
                snapfit.reset(self);
                break;
            case ent:
                snapfit.solve(self);
                break;
            case bsp:
                snapfit.admix(self, true);
                break;
            case del:
                snapfit.admix(self, false);
                break
            }
        }
        return false
    },
    _isKeypressed: function (e) {
        return false
    },
    _isKeyup: function (e) {
        return false
    },
    _catchOver: function (e) {
        cvi_stactive = this.id;
        this.focus();
        document.addEventListener('keyup', snapfit._isKeyup, false);
        document.addEventListener('keypress', snapfit._isKeypressed, false);
        document.addEventListener('keydown', snapfit._isKeydown, false);
        return false
    },
    _catchOut: function (e) {
        cvi_stactive = null;
        document.removeEventListener('keyup', snapfit._isKeyup, false);
        document.removeEventListener('keypress', snapfit._isKeypressed, false);
        document.removeEventListener('keydown', snapfit._isKeydown, false);
        return false
    },
    _catchEnter: function (e) {
        cvi_stactive = this.id;
        this.focus();
        document.attachEvent("onkeyup", snapfit._isKeyup);
        document.attachEvent("onkeypress", snapfit._isKeypressed);
        document.attachEvent("onkeydown", snapfit._isKeydown);
        return false
    },
    _catchLeave: function (e) {
        cvi_stactive = null;
        document.detachEvent("onkeyup", snapfit._isKeyup);
        document.detachEvent("onkeypress", snapfit._isKeypressed);
        document.detachEvent("onkeydown", snapfit._isKeydown);
        return false
    },
    _ifSolved: function (self) {
        if (!self.dragging || !self.progress) {
            if (!self.solved && self.admixed && snapfit._isSolved(self) && self.cb) {
                self.solved = true;
                self.admixed = false;
                self.cb()
            } else {
                self.solved = false
            }
        }
        return false
    },
    _isSolved: function (self) {
        if (self.admixed && !self.solved) {
            for (var i = 0; i < self.obj.length; i++) {
                if (!self.obj[i].q) {
                    return false
                }
            }
            return true
        } else {
            return false
        }
    },
    _setBehind: function (self, cur) {
        function setFirst(a, t) {
            var d = a[t];
            a.splice(t, 1);
            a.unshift(d);
            return a
        };
        self.obj = setFirst(self.obj, cur);
        self.obj.cur = 0;
        return false
    },
    _isBehind: function (self, cur) {
        function setLast(a, t) {
            var d = a[t];
            a.splice(t, 1);
            a.push(d);
            return a
        };

        function setFirst(a, t) {
            var d = a[t];
            a.splice(t, 1);
            a.unshift(d);
            return a
        };
        var w, h, c, p = self.obj[cur],
            mix = p.x,
            miy = p.y,
            max = p.x + p.w,
            may = p.y + p.h;
        for (i = self.obj.length - 1; i > -1; i--) {
            if (i != cur) {
                c = self.obj[i];
                w = c.x + c.w;
                h = c.y + c.h;
                if ((w >= mix && c.x <= max) && (h >= miy && c.y <= may)) {
                    if (i != self.obj.length - 1) {
                        self.obj = setLast(self.obj, i);
                        self.obj.cur = self.obj.length - 1
                    }
                }
            }
        }
        return false
    },
    _isContained: function (self) {
        var i, j, k, c, p, l, t, x = self.evtX,
            y = self.evtY;
        for (i = self.obj.length - 1; i > -1; i--) {
            j = 0;
            k = 0;
            c = 0;
            p = self.obj[i].t;
            l = self.obj[i].x;
            t = self.obj[i].y;
            for (k in p) {
                j++;
                if (j == p.length) {
                    j = 0
                }
                if ((((t + p[k][1]) < y) && ((t + p[j][1]) >= y)) || (((t + p[j][1]) < y) && ((t + p[k][1]) >= y))) {
                    if ((l + p[k][0]) + (y - (t + p[k][1])) / ((t + p[j][1]) - (t + p[k][1])) * ((l + p[j][0]) - (l + p[k][0])) < x) {
                        c = !c
                    }
                }
            }
            if (c) {
                return i
            }
        }
        return -1
    },
    _isCatched: function (self, cur) {
        var p = self.obj[cur];
        if ((p.f && p.m && p.a == 180) || (!p.f && !p.m && p.a == 0)) {
            if (p.x <= (p.ox + self.xo + self.sv) && p.x >= (p.ox + self.xo - self.sv) && p.y <= (p.oy + self.yo + self.sv) && p.y >= (p.oy + self.yo - self.sv)) {
                self.obj[cur].x = p.ox + self.xo;
                self.obj[cur].y = p.oy + self.yo;
                self.obj[cur].z = true;
                self.obj[cur].q = true;
                if (!self.vml) {
                    if (self.tof) {
                        snapfit._isBehind(self, cur)
                    } else {
                        snapfit._setBehind(self, cur)
                    }
                }
                return true
            }
        }
        self.obj[cur].z = false;
        self.obj[cur].q = false;
        return false
    },
    _rotate: function (p, w, h, r, z, d, k) {
        function sdx(v, z) {
            return v[0] - z[0]
        };

        function sdy(v, z) {
            return v[1] - z[1]
        };
        var j, x, y, px, py, mx = 0,
            my = 0,
            mw = 1,
            mh = 1,
            a = [],
            b = [],
            xo = p.x + (.5 * p.w),
            yo = p.y + (.5 * p.h),
            g = r * (Math.PI / 180),
            cs = Math.cos(g),
            sn = Math.sin(g);
        for (j = 0; j < p.t.length; j++) {
            px = p.x + p.t[j][0];
            py = p.y + p.t[j][1];
            x = (px - xo) * cs - (py - yo) * sn + xo;
            y = (py - yo) * cs + (px - xo) * sn + yo;
            a[j] = [x, y]
        }
        b = a.slice();
        b.sort(sdx);
        mx = b[0][0];
        mw = b[b.length - 1][0];
        b.sort(sdy);
        my = b[0][1];
        mh = b[b.length - 1][1];
        p.w = mw - mx;
        p.h = mh - my;
        p.x = mx;
        p.y = my;
        for (j = 0; j < a.length; j++) {
            a[j][0] = a[j][0] - p.x;
            a[j][1] = a[j][1] - p.y
        }
        p.x = Math.max(Math.min(w - p.w, p.x), 0);
        p.y = Math.max(Math.min(h - p.h, p.y), 0);
        p.t = a;
        if (z) {
            p.l = snapfit._shade(a, d, k)
        }
        return p
    },
    _flipY: function (t, tx, tw) {
        var j, x, px, xo = tx + (.5 * tw),
            a = [];
        for (j = 0; j < t.length; j++) {
            px = tx + t[j][0];
            if (px < xo) {
                x = xo + (xo - px);
                a[j] = [Math.max(x - tx, 0), t[j][1]]
            } else if (px > xo) {
                x = xo - (px - xo);
                a[j] = [Math.max(x - tx, 0), t[j][1]]
            } else {
                a[j] = [t[j][0], t[j][1]]
            }
        }
        return a
    },
    _flipX: function (t, ty, th) {
        var j, y, py, yo = ty + (.5 * th),
            a = [];
        for (j = 0; j < t.length; j++) {
            py = ty + t[j][1];
            if (py < yo) {
                y = yo + (yo - py);
                a[j] = [t[j][0], Math.max(y - ty, 0)]
            } else if (py > yo) {
                y = yo - (py - yo);
                a[j] = [t[j][0], Math.max(y - ty, 0)]
            } else {
                a[j] = [t[j][0], t[j][1]]
            }
        }
        return a
    },
    _shade: function (t, d, k) {
        k = k || 0;
        var i, ag, ad, at, av, dx, sx, ex, dy, sy, ey, ls = (d - 180) * (Math.PI / 180),
            z = [];

        function fabs(n) {
            if (n >= 0) {
                return n
            } else {
                return 0 - n
            }
        };

        function theta(x, y) {
            var a = Math.atan2(y, x);
            if (a < 0.0) {
                a = 2 * Math.PI + a
            }
            return a
        };
        for (i = 0; i < t.length; i++) {
            sx = t[i][0];
            sy = t[i][1];
            if (i < t.length - 1) {
                ex = t[i + 1][0];
                ey = t[i + 1][1]
            } else {
                ex = t[0][0];
                ey = t[0][1]
            }
            dy = (ey - sy);
            dx = (sx - ex);
            ag = 2 * Math.PI - theta(dx, dy);
            ad = fabs(ls - ag);
            at = 0.5 * (Math.cos(ad) + 1.0);
            av = parseInt(at * 0 + (1.0 - at) * 255);
            z[i] = !k ? av > 127 ? 255 : 0 : av
        }
        return z
    },
    _xoff: function (n) {
        var r = n.offsetLeft;
        for (var p = n; p = p.offsetParent; p != null) {
            r += p.offsetLeft
        }
        return r
    },
    _yoff: function (n) {
        var r = n.offsetTop;
        for (var p = n; p = p.offsetParent; p != null) {
            r += p.offsetTop
        }
        return r
    },
    _swap: function (a, i) {
        t = a[i];
        a[i] = a[a.length - 1];
        a[a.length - 1] = t;
        return a
    }
}