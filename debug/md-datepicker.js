var cssua = function(e, t, n) {
    "use strict";
    var r = " ua-";
    var i = /\s*([\-\w ]+)[\s\/\:]([\d_]+\b(?:[\-\._\/]\w+)*)/;
    var s = /([\w\-\.]+[\s\/][v]?[\d_]+\b(?:[\-\._\/]\w+)*)/g;
    var a = /\b(?:(blackberry\w*|bb10)|(rim tablet os))(?:\/(\d+\.\d+(?:\.\w+)*))?/;
    var o = /\bsilk-accelerated=true\b/;
    var u = /\bfluidapp\b/;
    var l = /(\bwindows\b|\bmacintosh\b|\blinux\b|\bunix\b)/;
    var d = /(\bandroid\b|\bipad\b|\bipod\b|\bwindows phone\b|\bwpdesktop\b|\bxblwp7\b|\bzunewp7\b|\bwindows ce\b|\bblackberry\w*|\bbb10\b|\brim tablet os\b|\bmeego|\bwebos\b|\bpalm|\bsymbian|\bj2me\b|\bdocomo\b|\bpda\b|\bchtml\b|\bmidp\b|\bcldc\b|\w*?mobile\w*?|\w*?phone\w*?)/;
    var f = /(\bxbox\b|\bplaystation\b|\bnintendo\s+\w+)/;
    var h = {
        parse: function(e, t) {
            var n = {};
            t && (n.standalone = t);
            e = ("" + e).toLowerCase();
            if (!e) return n;
            var r, h, c = e.split(/[()]/);
            for (var m = 0, _ = c.length; m < _; m++) if (m % 2) {
                var v = c[m].split(";");
                for (r = 0, h = v.length; r < h; r++) if (i.exec(v[r])) {
                    var p = RegExp.$1.split(" ").join("_"), g = RegExp.$2;
                    (!n[p] || parseFloat(n[p]) < parseFloat(g)) && (n[p] = g);
                }
            } else {
                var y = c[m].match(s);
                if (y) for (r = 0, h = y.length; r < h; r++) {
                    var w = y[r].split(/[\/\s]+/);
                    w.length && "mozilla" !== w[0] && (n[w[0].split(" ").join("_")] = w.slice(1).join("-"));
                }
            }
            if (d.exec(e)) {
                n.mobile = RegExp.$1;
                if (a.exec(e)) {
                    delete n[n.mobile];
                    n.blackberry = n.version || RegExp.$3 || RegExp.$2 || RegExp.$1;
                    RegExp.$1 ? n.mobile = "blackberry" : "0.0.1" === n.version && (n.blackberry = "7.1.0.0");
                }
            } else if (f.exec(e)) {
                n.game = RegExp.$1;
                var M = n.game.split(" ").join("_");
                n.version && !n[M] && (n[M] = n.version);
            } else l.exec(e) && (n.desktop = RegExp.$1);
            if (n.intel_mac_os_x) {
                n.mac_os_x = n.intel_mac_os_x.split("_").join(".");
                delete n.intel_mac_os_x;
            } else if (n.cpu_iphone_os) {
                n.ios = n.cpu_iphone_os.split("_").join(".");
                delete n.cpu_iphone_os;
            } else if (n.cpu_os) {
                n.ios = n.cpu_os.split("_").join(".");
                delete n.cpu_os;
            } else "iphone" !== n.mobile || n.ios || (n.ios = "1");
            if (n.opera && n.version) {
                n.opera = n.version;
                delete n.blackberry;
            } else o.exec(e) ? n.silk_accelerated = true : u.exec(e) && (n.fluidapp = n.version);
            if (n.edge) {
                delete n.applewebkit;
                delete n.safari;
                delete n.chrome;
                delete n.android;
            }
            if (n.applewebkit) {
                n.webkit = n.applewebkit;
                delete n.applewebkit;
                if (n.opr) {
                    n.opera = n.opr;
                    delete n.opr;
                    delete n.chrome;
                }
                if (n.safari) if (n.chrome || n.crios || n.fxios || n.opera || n.silk || n.fluidapp || n.phantomjs || n.mobile && !n.ios) {
                    delete n.safari;
                    n.vivaldi && delete n.chrome;
                } else n.version && !n.rim_tablet_os ? n.safari = n.version : n.safari = {
                    "419": "2.0.4",
                    "417": "2.0.3",
                    "416": "2.0.2",
                    "412": "2.0",
                    "312": "1.3",
                    "125": "1.2",
                    "85": "1.0"
                }[parseInt(n.safari, 10)] || n.safari;
            } else if (n.msie || n.trident) {
                n.opera || (n.ie = n.msie || n.rv);
                delete n.msie;
                delete n.android;
                if (n.windows_phone_os) {
                    n.windows_phone = n.windows_phone_os;
                    delete n.windows_phone_os;
                } else if ("wpdesktop" === n.mobile || "xblwp7" === n.mobile || "zunewp7" === n.mobile) {
                    n.mobile = "windows desktop";
                    n.windows_phone = +n.ie < 9 ? "7.0" : +n.ie < 10 ? "7.5" : "8.0";
                    delete n.windows_nt;
                }
            } else (n.gecko || n.firefox) && (n.gecko = n.rv);
            n.rv && delete n.rv;
            n.version && delete n.version;
            return n;
        },
        format: function(e) {
            function t(e, t) {
                e = e.split(".").join("-");
                var n = r + e;
                if ("string" === typeof t) {
                    t = t.split(" ").join("_").split(".").join("-");
                    var i = t.indexOf("-");
                    for (;i > 0; ) {
                        n += r + e + "-" + t.substring(0, i);
                        i = t.indexOf("-", i + 1);
                    }
                    n += r + e + "-" + t;
                }
                return n;
            }
            var n = "";
            for (var i in e) i && e.hasOwnProperty(i) && (n += t(i, e[i]));
            return n;
        },
        encode: function(e) {
            var t = "";
            for (var n in e) if (n && e.hasOwnProperty(n)) {
                t && (t += "&");
                t += encodeURIComponent(n) + "=" + encodeURIComponent(e[n]);
            }
            return t;
        }
    };
    h.userAgent = h.ua = h.parse(t, n);
    var c = h.format(h.ua) + " js";
    e.className ? e.className = e.className.replace(/\bno-js\b/g, "") + c : e.className = c.substr(1);
    return h;
}(document.documentElement, navigator.userAgent, navigator.standalone);

!function(e) {
    e.easing["jswing"] = e.easing["swing"];
    e.extend(e.easing, {
        def: "easeOutQuad",
        swing: function(t, n, r, i, s) {
            return e.easing[e.easing.def](t, n, r, i, s);
        },
        easeInQuad: function(e, t, n, r, i) {
            return r * (t /= i) * t + n;
        },
        easeOutQuad: function(e, t, n, r, i) {
            return -r * (t /= i) * (t - 2) + n;
        },
        easeInOutQuad: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1) return r / 2 * t * t + n;
            return -r / 2 * (--t * (t - 2) - 1) + n;
        },
        easeInCubic: function(e, t, n, r, i) {
            return r * (t /= i) * t * t + n;
        },
        easeOutCubic: function(e, t, n, r, i) {
            return r * ((t = t / i - 1) * t * t + 1) + n;
        },
        easeInOutCubic: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1) return r / 2 * t * t * t + n;
            return r / 2 * ((t -= 2) * t * t + 2) + n;
        },
        easeInQuart: function(e, t, n, r, i) {
            return r * (t /= i) * t * t * t + n;
        },
        easeOutQuart: function(e, t, n, r, i) {
            return -r * ((t = t / i - 1) * t * t * t - 1) + n;
        },
        easeInOutQuart: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1) return r / 2 * t * t * t * t + n;
            return -r / 2 * ((t -= 2) * t * t * t - 2) + n;
        },
        easeInQuint: function(e, t, n, r, i) {
            return r * (t /= i) * t * t * t * t + n;
        },
        easeOutQuint: function(e, t, n, r, i) {
            return r * ((t = t / i - 1) * t * t * t * t + 1) + n;
        },
        easeInOutQuint: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1) return r / 2 * t * t * t * t * t + n;
            return r / 2 * ((t -= 2) * t * t * t * t + 2) + n;
        },
        easeInSine: function(e, t, n, r, i) {
            return -r * Math.cos(t / i * (Math.PI / 2)) + r + n;
        },
        easeOutSine: function(e, t, n, r, i) {
            return r * Math.sin(t / i * (Math.PI / 2)) + n;
        },
        easeInOutSine: function(e, t, n, r, i) {
            return -r / 2 * (Math.cos(Math.PI * t / i) - 1) + n;
        },
        easeInExpo: function(e, t, n, r, i) {
            return 0 == t ? n : r * Math.pow(2, 10 * (t / i - 1)) + n;
        },
        easeOutExpo: function(e, t, n, r, i) {
            return t == i ? n + r : r * (-Math.pow(2, -10 * t / i) + 1) + n;
        },
        easeInOutExpo: function(e, t, n, r, i) {
            if (0 == t) return n;
            if (t == i) return n + r;
            if ((t /= i / 2) < 1) return r / 2 * Math.pow(2, 10 * (t - 1)) + n;
            return r / 2 * (-Math.pow(2, -10 * --t) + 2) + n;
        },
        easeInCirc: function(e, t, n, r, i) {
            return -r * (Math.sqrt(1 - (t /= i) * t) - 1) + n;
        },
        easeOutCirc: function(e, t, n, r, i) {
            return r * Math.sqrt(1 - (t = t / i - 1) * t) + n;
        },
        easeInOutCirc: function(e, t, n, r, i) {
            if ((t /= i / 2) < 1) return -r / 2 * (Math.sqrt(1 - t * t) - 1) + n;
            return r / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + n;
        },
        easeInElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var a = 0;
            var o = r;
            if (0 == t) return n;
            if (1 == (t /= i)) return n + r;
            a || (a = .3 * i);
            if (o < Math.abs(r)) {
                o = r;
                var s = a / 4;
            } else var s = a / (2 * Math.PI) * Math.asin(r / o);
            return -(o * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * i - s) * (2 * Math.PI) / a)) + n;
        },
        easeOutElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var a = 0;
            var o = r;
            if (0 == t) return n;
            if (1 == (t /= i)) return n + r;
            a || (a = .3 * i);
            if (o < Math.abs(r)) {
                o = r;
                var s = a / 4;
            } else var s = a / (2 * Math.PI) * Math.asin(r / o);
            return o * Math.pow(2, -10 * t) * Math.sin((t * i - s) * (2 * Math.PI) / a) + r + n;
        },
        easeInOutElastic: function(e, t, n, r, i) {
            var s = 1.70158;
            var a = 0;
            var o = r;
            if (0 == t) return n;
            if (2 == (t /= i / 2)) return n + r;
            a || (a = i * (.3 * 1.5));
            if (o < Math.abs(r)) {
                o = r;
                var s = a / 4;
            } else var s = a / (2 * Math.PI) * Math.asin(r / o);
            if (t < 1) return -.5 * (o * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * i - s) * (2 * Math.PI) / a)) + n;
            return o * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * i - s) * (2 * Math.PI) / a) * .5 + r + n;
        },
        easeInBack: function(e, t, n, r, i, s) {
            void 0 == s && (s = 1.70158);
            return r * (t /= i) * t * ((s + 1) * t - s) + n;
        },
        easeOutBack: function(e, t, n, r, i, s) {
            void 0 == s && (s = 1.70158);
            return r * ((t = t / i - 1) * t * ((s + 1) * t + s) + 1) + n;
        },
        easeInOutBack: function(e, t, n, r, i, s) {
            void 0 == s && (s = 1.70158);
            if ((t /= i / 2) < 1) return r / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + n;
            return r / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + n;
        },
        easeInBounce: function(t, n, r, i, s) {
            return i - e.easing.easeOutBounce(t, s - n, 0, i, s) + r;
        },
        easeOutBounce: function(e, t, n, r, i) {
            return (t /= i) < 1 / 2.75 ? r * (7.5625 * t * t) + n : t < 2 / 2.75 ? r * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + n : t < 2.5 / 2.75 ? r * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + n : r * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + n;
        },
        easeInOutBounce: function(t, n, r, i, s) {
            if (n < s / 2) return .5 * e.easing.easeInBounce(t, 2 * n, 0, i, s) + r;
            return .5 * e.easing.easeOutBounce(t, 2 * n - s, 0, i, s) + .5 * i + r;
        }
    });
}(jQuery);

!function(e, t) {
    "object" === typeof exports && "undefined" !== typeof module ? module.exports = t() : "function" === typeof define && define.amd ? define(t) : e.moment = t();
}(this, function() {
    "use strict";
    function e() {
        return $n.apply(null, arguments);
    }
    function t(e) {
        $n = e;
    }
    function n(e) {
        return "[object Array]" === Object.prototype.toString.call(e);
    }
    function r(e) {
        return e instanceof Date || "[object Date]" === Object.prototype.toString.call(e);
    }
    function i(e, t) {
        var n, r = [];
        for (n = 0; n < e.length; ++n) r.push(t(e[n], n));
        return r;
    }
    function s(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }
    function a(e, t) {
        for (var n in t) s(t, n) && (e[n] = t[n]);
        s(t, "toString") && (e.toString = t.toString);
        s(t, "valueOf") && (e.valueOf = t.valueOf);
        return e;
    }
    function o(e, t, n, r) {
        return xe(e, t, n, r, true).utc();
    }
    function u() {
        return {
            empty: false,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: false,
            invalidMonth: null,
            invalidFormat: false,
            userInvalidated: false,
            iso: false
        };
    }
    function l(e) {
        null == e._pf && (e._pf = u());
        return e._pf;
    }
    function d(e) {
        if (null == e._isValid) {
            var t = l(e);
            e._isValid = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidMonth && !t.invalidWeekday && !t.nullInput && !t.invalidFormat && !t.userInvalidated;
            e._strict && (e._isValid = e._isValid && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour);
        }
        return e._isValid;
    }
    function f(e) {
        var t = o(NaN);
        null != e ? a(l(t), e) : l(t).userInvalidated = true;
        return t;
    }
    function h(e) {
        return void 0 === e;
    }
    function c(e, t) {
        var n, r, i;
        h(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject);
        h(t._i) || (e._i = t._i);
        h(t._f) || (e._f = t._f);
        h(t._l) || (e._l = t._l);
        h(t._strict) || (e._strict = t._strict);
        h(t._tzm) || (e._tzm = t._tzm);
        h(t._isUTC) || (e._isUTC = t._isUTC);
        h(t._offset) || (e._offset = t._offset);
        h(t._pf) || (e._pf = l(t));
        h(t._locale) || (e._locale = t._locale);
        if (Qn.length > 0) for (n in Qn) {
            r = Qn[n];
            i = t[r];
            h(i) || (e[r] = i);
        }
        return e;
    }
    function m(t) {
        c(this, t);
        this._d = new Date(null != t._d ? t._d.getTime() : NaN);
        if (false === Bn) {
            Bn = true;
            e.updateOffset(this);
            Bn = false;
        }
    }
    function _(e) {
        return e instanceof m || null != e && null != e._isAMomentObject;
    }
    function v(e) {
        return e < 0 ? Math.ceil(e) : Math.floor(e);
    }
    function p(e) {
        var t = +e, n = 0;
        0 !== t && isFinite(t) && (n = v(t));
        return n;
    }
    function g(e, t, n) {
        var r, i = Math.min(e.length, t.length), s = Math.abs(e.length - t.length), a = 0;
        for (r = 0; r < i; r++) (n && e[r] !== t[r] || !n && p(e[r]) !== p(t[r])) && a++;
        return a + s;
    }
    function y() {}
    function w(e) {
        return e ? e.toLowerCase().replace("_", "-") : e;
    }
    function M(e) {
        var t, n, r, i, s = 0;
        for (;s < e.length; ) {
            i = w(e[s]).split("-");
            t = i.length;
            n = w(e[s + 1]);
            n = n ? n.split("-") : null;
            for (;t > 0; ) {
                r = b(i.slice(0, t).join("-"));
                if (r) return r;
                if (n && n.length >= t && g(i, n, true) >= t - 1) break;
                t--;
            }
            s++;
        }
        return null;
    }
    function b(e) {
        var t = null;
        if (!qn[e] && "undefined" !== typeof module && module && module.exports) try {
            t = Jn._abbr;
            require("./locale/" + e);
            D(t);
        } catch (e) {}
        return qn[e];
    }
    function D(e, t) {
        var n;
        if (e) {
            n = h(t) ? Y(e) : S(e, t);
            n && (Jn = n);
        }
        return Jn._abbr;
    }
    function S(e, t) {
        if (null !== t) {
            t.abbr = e;
            qn[e] = qn[e] || new y();
            qn[e].set(t);
            D(e);
            return qn[e];
        }
        delete qn[e];
        return null;
    }
    function Y(e) {
        var t;
        e && e._locale && e._locale._abbr && (e = e._locale._abbr);
        if (!e) return Jn;
        if (!n(e)) {
            t = b(e);
            if (t) return t;
            e = [ e ];
        }
        return M(e);
    }
    function k(e, t) {
        var n = e.toLowerCase();
        Xn[n] = Xn[n + "s"] = Xn[t] = e;
    }
    function O(e) {
        return "string" === typeof e ? Xn[e] || Xn[e.toLowerCase()] : void 0;
    }
    function T(e) {
        var t, n, r = {};
        for (n in e) if (s(e, n)) {
            t = O(n);
            t && (r[t] = e[n]);
        }
        return r;
    }
    function x(e) {
        return e instanceof Function || "[object Function]" === Object.prototype.toString.call(e);
    }
    function W(t, n) {
        return function(r) {
            if (null != r) {
                I(this, t, r);
                e.updateOffset(this, n);
                return this;
            }
            return P(this, t);
        };
    }
    function P(e, t) {
        return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN;
    }
    function I(e, t, n) {
        e.isValid() && e._d["set" + (e._isUTC ? "UTC" : "") + t](n);
    }
    function C(e, t) {
        var n;
        if ("object" === typeof e) for (n in e) this.set(n, e[n]); else {
            e = O(e);
            if (x(this[e])) return this[e](t);
        }
        return this;
    }
    function U(e, t, n) {
        var r = "" + Math.abs(e), i = t - r.length, s = e >= 0;
        return (s ? n ? "+" : "" : "-") + Math.pow(10, Math.max(0, i)).toString().substr(1) + r;
    }
    function G(e, t, n, r) {
        var i = r;
        "string" === typeof r && (i = function() {
            return this[r]();
        });
        e && (nr[e] = i);
        t && (nr[t[0]] = function() {
            return U(i.apply(this, arguments), t[1], t[2]);
        });
        n && (nr[n] = function() {
            return this.localeData().ordinal(i.apply(this, arguments), e);
        });
    }
    function F(e) {
        if (e.match(/\[[\s\S]/)) return e.replace(/^\[|\]$/g, "");
        return e.replace(/\\/g, "");
    }
    function H(e) {
        var t, n, r = e.match(Kn);
        for (t = 0, n = r.length; t < n; t++) nr[r[t]] ? r[t] = nr[r[t]] : r[t] = F(r[t]);
        return function(i) {
            var s = "";
            for (t = 0; t < n; t++) s += r[t] instanceof Function ? r[t].call(i, e) : r[t];
            return s;
        };
    }
    function V(e, t) {
        if (!e.isValid()) return e.localeData().invalidDate();
        t = R(t, e.localeData());
        tr[t] = tr[t] || H(t);
        return tr[t](e);
    }
    function R(e, t) {
        function n(e) {
            return t.longDateFormat(e) || e;
        }
        var r = 5;
        er.lastIndex = 0;
        for (;r >= 0 && er.test(e); ) {
            e = e.replace(er, n);
            er.lastIndex = 0;
            r -= 1;
        }
        return e;
    }
    function E(e, t, n) {
        wr[e] = x(t) ? t : function(e, r) {
            return e && n ? n : t;
        };
    }
    function j(e, t) {
        if (!s(wr, e)) return new RegExp(N(e));
        return wr[e](t._strict, t._locale);
    }
    function N(e) {
        return L(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, n, r, i) {
            return t || n || r || i;
        }));
    }
    function L(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    }
    function A(e, t) {
        var n, r = t;
        "string" === typeof e && (e = [ e ]);
        "number" === typeof t && (r = function(e, n) {
            n[t] = p(e);
        });
        for (n = 0; n < e.length; n++) Mr[e[n]] = r;
    }
    function z(e, t) {
        A(e, function(e, n, r, i) {
            r._w = r._w || {};
            t(e, r._w, r, i);
        });
    }
    function Z(e, t, n) {
        null != t && s(Mr, e) && Mr[e](t, n._a, n, e);
    }
    function $(e, t) {
        return new Date(Date.UTC(e, t + 1, 0)).getUTCDate();
    }
    function Q(e, t) {
        return n(this._months) ? this._months[e.month()] : this._months[Pr.test(t) ? "format" : "standalone"][e.month()];
    }
    function B(e, t) {
        return n(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[Pr.test(t) ? "format" : "standalone"][e.month()];
    }
    function q(e, t, n) {
        var r, i, s;
        if (!this._monthsParse) {
            this._monthsParse = [];
            this._longMonthsParse = [];
            this._shortMonthsParse = [];
        }
        for (r = 0; r < 12; r++) {
            i = o([ 2e3, r ]);
            if (n && !this._longMonthsParse[r]) {
                this._longMonthsParse[r] = new RegExp("^" + this.months(i, "").replace(".", "") + "$", "i");
                this._shortMonthsParse[r] = new RegExp("^" + this.monthsShort(i, "").replace(".", "") + "$", "i");
            }
            if (!n && !this._monthsParse[r]) {
                s = "^" + this.months(i, "") + "|^" + this.monthsShort(i, "");
                this._monthsParse[r] = new RegExp(s.replace(".", ""), "i");
            }
            if (n && "MMMM" === t && this._longMonthsParse[r].test(e)) return r;
            if (n && "MMM" === t && this._shortMonthsParse[r].test(e)) return r;
            if (!n && this._monthsParse[r].test(e)) return r;
        }
    }
    function J(e, t) {
        var n;
        if (!e.isValid()) return e;
        if ("string" === typeof t) {
            t = e.localeData().monthsParse(t);
            if ("number" !== typeof t) return e;
        }
        n = Math.min(e.date(), $(e.year(), t));
        e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n);
        return e;
    }
    function X(t) {
        if (null != t) {
            J(this, t);
            e.updateOffset(this, true);
            return this;
        }
        return P(this, "Month");
    }
    function K() {
        return $(this.year(), this.month());
    }
    function ee(e) {
        if (this._monthsParseExact) {
            s(this, "_monthsRegex") || ne.call(this);
            return e ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
        return this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex;
    }
    function te(e) {
        if (this._monthsParseExact) {
            s(this, "_monthsRegex") || ne.call(this);
            return e ? this._monthsStrictRegex : this._monthsRegex;
        }
        return this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex;
    }
    function ne() {
        function e(e, t) {
            return t.length - e.length;
        }
        var t, n, r = [], i = [], s = [];
        for (t = 0; t < 12; t++) {
            n = o([ 2e3, t ]);
            r.push(this.monthsShort(n, ""));
            i.push(this.months(n, ""));
            s.push(this.months(n, ""));
            s.push(this.monthsShort(n, ""));
        }
        r.sort(e);
        i.sort(e);
        s.sort(e);
        for (t = 0; t < 12; t++) {
            r[t] = L(r[t]);
            i[t] = L(i[t]);
            s[t] = L(s[t]);
        }
        this._monthsRegex = new RegExp("^(" + s.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + i.join("|") + ")$", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + r.join("|") + ")$", "i");
    }
    function re(e) {
        var t;
        var n = e._a;
        if (n && -2 === l(e).overflow) {
            t = n[Dr] < 0 || n[Dr] > 11 ? Dr : n[Sr] < 1 || n[Sr] > $(n[br], n[Dr]) ? Sr : n[Yr] < 0 || n[Yr] > 24 || 24 === n[Yr] && (0 !== n[kr] || 0 !== n[Or] || 0 !== n[Tr]) ? Yr : n[kr] < 0 || n[kr] > 59 ? kr : n[Or] < 0 || n[Or] > 59 ? Or : n[Tr] < 0 || n[Tr] > 999 ? Tr : -1;
            l(e)._overflowDayOfYear && (t < br || t > Sr) && (t = Sr);
            l(e)._overflowWeeks && -1 === t && (t = xr);
            l(e)._overflowWeekday && -1 === t && (t = Wr);
            l(e).overflow = t;
        }
        return e;
    }
    function ie(t) {
        false === e.suppressDeprecationWarnings && "undefined" !== typeof console && console.warn && console.warn("Deprecation warning: " + t);
    }
    function se(e, t) {
        var n = true;
        return a(function() {
            if (n) {
                ie(e + "\nArguments: " + Array.prototype.slice.call(arguments).join(", ") + "\n" + new Error().stack);
                n = false;
            }
            return t.apply(this, arguments);
        }, t);
    }
    function ae(e, t) {
        if (!Fr[e]) {
            ie(t);
            Fr[e] = true;
        }
    }
    function oe(e) {
        var t, n, r, i, s, a, o = e._i, u = Hr.exec(o) || Vr.exec(o);
        if (u) {
            l(e).iso = true;
            for (t = 0, n = Er.length; t < n; t++) if (Er[t][1].exec(u[1])) {
                i = Er[t][0];
                r = false !== Er[t][2];
                break;
            }
            if (null == i) {
                e._isValid = false;
                return;
            }
            if (u[3]) {
                for (t = 0, n = jr.length; t < n; t++) if (jr[t][1].exec(u[3])) {
                    s = (u[2] || " ") + jr[t][0];
                    break;
                }
                if (null == s) {
                    e._isValid = false;
                    return;
                }
            }
            if (!r && null != s) {
                e._isValid = false;
                return;
            }
            if (u[4]) {
                if (!Rr.exec(u[4])) {
                    e._isValid = false;
                    return;
                }
                a = "Z";
            }
            e._f = i + (s || "") + (a || "");
            be(e);
        } else e._isValid = false;
    }
    function ue(t) {
        var n = Nr.exec(t._i);
        if (null !== n) {
            t._d = new Date(+n[1]);
            return;
        }
        oe(t);
        if (false === t._isValid) {
            delete t._isValid;
            e.createFromInputFallback(t);
        }
    }
    function le(e, t, n, r, i, s, a) {
        var o = new Date(e, t, n, r, i, s, a);
        e < 100 && e >= 0 && isFinite(o.getFullYear()) && o.setFullYear(e);
        return o;
    }
    function de(e) {
        var t = new Date(Date.UTC.apply(null, arguments));
        e < 100 && e >= 0 && isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e);
        return t;
    }
    function fe(e) {
        return he(e) ? 366 : 365;
    }
    function he(e) {
        return e % 4 === 0 && e % 100 !== 0 || e % 400 === 0;
    }
    function ce() {
        return he(this.year());
    }
    function me(e, t, n) {
        var r = 7 + t - n, i = (7 + de(e, 0, r).getUTCDay() - t) % 7;
        return -i + r - 1;
    }
    function _e(e, t, n, r, i) {
        var s, a, o = (7 + n - r) % 7, u = me(e, r, i), l = 1 + 7 * (t - 1) + o + u;
        if (l <= 0) {
            s = e - 1;
            a = fe(s) + l;
        } else if (l > fe(e)) {
            s = e + 1;
            a = l - fe(e);
        } else {
            s = e;
            a = l;
        }
        return {
            year: s,
            dayOfYear: a
        };
    }
    function ve(e, t, n) {
        var r, i, s = me(e.year(), t, n), a = Math.floor((e.dayOfYear() - s - 1) / 7) + 1;
        if (a < 1) {
            i = e.year() - 1;
            r = a + pe(i, t, n);
        } else if (a > pe(e.year(), t, n)) {
            r = a - pe(e.year(), t, n);
            i = e.year() + 1;
        } else {
            i = e.year();
            r = a;
        }
        return {
            week: r,
            year: i
        };
    }
    function pe(e, t, n) {
        var r = me(e, t, n), i = me(e + 1, t, n);
        return (fe(e) - r + i) / 7;
    }
    function ge(e, t, n) {
        if (null != e) return e;
        if (null != t) return t;
        return n;
    }
    function ye(t) {
        var n = new Date(e.now());
        if (t._useUTC) return [ n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() ];
        return [ n.getFullYear(), n.getMonth(), n.getDate() ];
    }
    function we(e) {
        var t, n, r, i, s = [];
        if (e._d) return;
        r = ye(e);
        e._w && null == e._a[Sr] && null == e._a[Dr] && Me(e);
        if (e._dayOfYear) {
            i = ge(e._a[br], r[br]);
            e._dayOfYear > fe(i) && (l(e)._overflowDayOfYear = true);
            n = de(i, 0, e._dayOfYear);
            e._a[Dr] = n.getUTCMonth();
            e._a[Sr] = n.getUTCDate();
        }
        for (t = 0; t < 3 && null == e._a[t]; ++t) e._a[t] = s[t] = r[t];
        for (;t < 7; t++) e._a[t] = s[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];
        if (24 === e._a[Yr] && 0 === e._a[kr] && 0 === e._a[Or] && 0 === e._a[Tr]) {
            e._nextDay = true;
            e._a[Yr] = 0;
        }
        e._d = (e._useUTC ? de : le).apply(null, s);
        null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm);
        e._nextDay && (e._a[Yr] = 24);
    }
    function Me(e) {
        var t, n, r, i, s, a, o, u;
        t = e._w;
        if (null != t.GG || null != t.W || null != t.E) {
            s = 1;
            a = 4;
            n = ge(t.GG, e._a[br], ve(We(), 1, 4).year);
            r = ge(t.W, 1);
            i = ge(t.E, 1);
            (i < 1 || i > 7) && (u = true);
        } else {
            s = e._locale._week.dow;
            a = e._locale._week.doy;
            n = ge(t.gg, e._a[br], ve(We(), s, a).year);
            r = ge(t.w, 1);
            if (null != t.d) {
                i = t.d;
                (i < 0 || i > 6) && (u = true);
            } else if (null != t.e) {
                i = t.e + s;
                (t.e < 0 || t.e > 6) && (u = true);
            } else i = s;
        }
        if (r < 1 || r > pe(n, s, a)) l(e)._overflowWeeks = true; else if (null != u) l(e)._overflowWeekday = true; else {
            o = _e(n, r, i, s, a);
            e._a[br] = o.year;
            e._dayOfYear = o.dayOfYear;
        }
    }
    function be(t) {
        if (t._f === e.ISO_8601) {
            oe(t);
            return;
        }
        t._a = [];
        l(t).empty = true;
        var n, r, i, s, a, o = "" + t._i, u = o.length, d = 0;
        i = R(t._f, t._locale).match(Kn) || [];
        for (n = 0; n < i.length; n++) {
            s = i[n];
            r = (o.match(j(s, t)) || [])[0];
            if (r) {
                a = o.substr(0, o.indexOf(r));
                a.length > 0 && l(t).unusedInput.push(a);
                o = o.slice(o.indexOf(r) + r.length);
                d += r.length;
            }
            if (nr[s]) {
                r ? l(t).empty = false : l(t).unusedTokens.push(s);
                Z(s, r, t);
            } else t._strict && !r && l(t).unusedTokens.push(s);
        }
        l(t).charsLeftOver = u - d;
        o.length > 0 && l(t).unusedInput.push(o);
        true === l(t).bigHour && t._a[Yr] <= 12 && t._a[Yr] > 0 && (l(t).bigHour = void 0);
        t._a[Yr] = De(t._locale, t._a[Yr], t._meridiem);
        we(t);
        re(t);
    }
    function De(e, t, n) {
        var r;
        if (null == n) return t;
        if (null != e.meridiemHour) return e.meridiemHour(t, n);
        if (null != e.isPM) {
            r = e.isPM(n);
            r && t < 12 && (t += 12);
            r || 12 !== t || (t = 0);
            return t;
        }
        return t;
    }
    function Se(e) {
        var t, n, r, i, s;
        if (0 === e._f.length) {
            l(e).invalidFormat = true;
            e._d = new Date(NaN);
            return;
        }
        for (i = 0; i < e._f.length; i++) {
            s = 0;
            t = c({}, e);
            null != e._useUTC && (t._useUTC = e._useUTC);
            t._f = e._f[i];
            be(t);
            if (!d(t)) continue;
            s += l(t).charsLeftOver;
            s += 10 * l(t).unusedTokens.length;
            l(t).score = s;
            if (null == r || s < r) {
                r = s;
                n = t;
            }
        }
        a(e, n || t);
    }
    function Ye(e) {
        if (e._d) return;
        var t = T(e._i);
        e._a = i([ t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond ], function(e) {
            return e && parseInt(e, 10);
        });
        we(e);
    }
    function ke(e) {
        var t = new m(re(Oe(e)));
        if (t._nextDay) {
            t.add(1, "d");
            t._nextDay = void 0;
        }
        return t;
    }
    function Oe(e) {
        var t = e._i, i = e._f;
        e._locale = e._locale || Y(e._l);
        if (null === t || void 0 === i && "" === t) return f({
            nullInput: true
        });
        "string" === typeof t && (e._i = t = e._locale.preparse(t));
        if (_(t)) return new m(re(t));
        n(i) ? Se(e) : i ? be(e) : r(t) ? e._d = t : Te(e);
        d(e) || (e._d = null);
        return e;
    }
    function Te(t) {
        var s = t._i;
        if (void 0 === s) t._d = new Date(e.now()); else if (r(s)) t._d = new Date(+s); else if ("string" === typeof s) ue(t); else if (n(s)) {
            t._a = i(s.slice(0), function(e) {
                return parseInt(e, 10);
            });
            we(t);
        } else "object" === typeof s ? Ye(t) : "number" === typeof s ? t._d = new Date(s) : e.createFromInputFallback(t);
    }
    function xe(e, t, n, r, i) {
        var s = {};
        if ("boolean" === typeof n) {
            r = n;
            n = void 0;
        }
        s._isAMomentObject = true;
        s._useUTC = s._isUTC = i;
        s._l = n;
        s._i = e;
        s._f = t;
        s._strict = r;
        return ke(s);
    }
    function We(e, t, n, r) {
        return xe(e, t, n, r, false);
    }
    function Pe(e, t) {
        var r, i;
        1 === t.length && n(t[0]) && (t = t[0]);
        if (!t.length) return We();
        r = t[0];
        for (i = 1; i < t.length; ++i) (!t[i].isValid() || t[i][e](r)) && (r = t[i]);
        return r;
    }
    function Ie() {
        var e = [].slice.call(arguments, 0);
        return Pe("isBefore", e);
    }
    function Ce() {
        var e = [].slice.call(arguments, 0);
        return Pe("isAfter", e);
    }
    function Ue(e) {
        var t = T(e), n = t.year || 0, r = t.quarter || 0, i = t.month || 0, s = t.week || 0, a = t.day || 0, o = t.hour || 0, u = t.minute || 0, l = t.second || 0, d = t.millisecond || 0;
        this._milliseconds = +d + 1e3 * l + 6e4 * u + 36e5 * o;
        this._days = +a + 7 * s;
        this._months = +i + 3 * r + 12 * n;
        this._data = {};
        this._locale = Y();
        this._bubble();
    }
    function Ge(e) {
        return e instanceof Ue;
    }
    function Fe(e, t) {
        G(e, 0, 0, function() {
            var e = this.utcOffset();
            var n = "+";
            if (e < 0) {
                e = -e;
                n = "-";
            }
            return n + U(~~(e / 60), 2) + t + U(~~e % 60, 2);
        });
    }
    function He(e, t) {
        var n = (t || "").match(e) || [];
        var r = n[n.length - 1] || [];
        var i = (r + "").match($r) || [ "-", 0, 0 ];
        var s = +(60 * i[1]) + p(i[2]);
        return "+" === i[0] ? s : -s;
    }
    function Ve(t, n) {
        var i, s;
        if (n._isUTC) {
            i = n.clone();
            s = (_(t) || r(t) ? +t : +We(t)) - +i;
            i._d.setTime(+i._d + s);
            e.updateOffset(i, false);
            return i;
        }
        return We(t).local();
    }
    function Re(e) {
        return 15 * -Math.round(e._d.getTimezoneOffset() / 15);
    }
    function Ee(t, n) {
        var r, i = this._offset || 0;
        if (!this.isValid()) return null != t ? this : NaN;
        if (null != t) {
            "string" === typeof t ? t = He(pr, t) : Math.abs(t) < 16 && (t = 60 * t);
            !this._isUTC && n && (r = Re(this));
            this._offset = t;
            this._isUTC = true;
            null != r && this.add(r, "m");
            if (i !== t) if (!n || this._changeInProgress) nt(this, Je(t - i, "m"), 1, false); else if (!this._changeInProgress) {
                this._changeInProgress = true;
                e.updateOffset(this, true);
                this._changeInProgress = null;
            }
            return this;
        }
        return this._isUTC ? i : Re(this);
    }
    function je(e, t) {
        if (null != e) {
            "string" !== typeof e && (e = -e);
            this.utcOffset(e, t);
            return this;
        }
        return -this.utcOffset();
    }
    function Ne(e) {
        return this.utcOffset(0, e);
    }
    function Le(e) {
        if (this._isUTC) {
            this.utcOffset(0, e);
            this._isUTC = false;
            e && this.subtract(Re(this), "m");
        }
        return this;
    }
    function Ae() {
        this._tzm ? this.utcOffset(this._tzm) : "string" === typeof this._i && this.utcOffset(He(vr, this._i));
        return this;
    }
    function ze(e) {
        if (!this.isValid()) return false;
        e = e ? We(e).utcOffset() : 0;
        return (this.utcOffset() - e) % 60 === 0;
    }
    function Ze() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
    }
    function $e() {
        if (!h(this._isDSTShifted)) return this._isDSTShifted;
        var e = {};
        c(e, this);
        e = Oe(e);
        if (e._a) {
            var t = e._isUTC ? o(e._a) : We(e._a);
            this._isDSTShifted = this.isValid() && g(e._a, t.toArray()) > 0;
        } else this._isDSTShifted = false;
        return this._isDSTShifted;
    }
    function Qe() {
        return this.isValid() ? !this._isUTC : false;
    }
    function Be() {
        return this.isValid() ? this._isUTC : false;
    }
    function qe() {
        return this.isValid() ? this._isUTC && 0 === this._offset : false;
    }
    function Je(e, t) {
        var n, r, i, a = e, o = null;
        if (Ge(e)) a = {
            ms: e._milliseconds,
            d: e._days,
            M: e._months
        }; else if ("number" === typeof e) {
            a = {};
            t ? a[t] = e : a.milliseconds = e;
        } else if (!(o = Qr.exec(e))) if (!(o = Br.exec(e))) {
            if (null == a) a = {}; else if ("object" === typeof a && ("from" in a || "to" in a)) {
                i = et(We(a.from), We(a.to));
                a = {};
                a.ms = i.milliseconds;
                a.M = i.months;
            }
        } else {
            n = "-" === o[1] ? -1 : 1;
            a = {
                y: Xe(o[2], n),
                M: Xe(o[3], n),
                d: Xe(o[4], n),
                h: Xe(o[5], n),
                m: Xe(o[6], n),
                s: Xe(o[7], n),
                w: Xe(o[8], n)
            };
        } else {
            n = "-" === o[1] ? -1 : 1;
            a = {
                y: 0,
                d: p(o[Sr]) * n,
                h: p(o[Yr]) * n,
                m: p(o[kr]) * n,
                s: p(o[Or]) * n,
                ms: p(o[Tr]) * n
            };
        }
        r = new Ue(a);
        Ge(e) && s(e, "_locale") && (r._locale = e._locale);
        return r;
    }
    function Xe(e, t) {
        var n = e && parseFloat(e.replace(",", "."));
        return (isNaN(n) ? 0 : n) * t;
    }
    function Ke(e, t) {
        var n = {
            milliseconds: 0,
            months: 0
        };
        n.months = t.month() - e.month() + 12 * (t.year() - e.year());
        e.clone().add(n.months, "M").isAfter(t) && --n.months;
        n.milliseconds = +t - +e.clone().add(n.months, "M");
        return n;
    }
    function et(e, t) {
        var n;
        if (!(e.isValid() && t.isValid())) return {
            milliseconds: 0,
            months: 0
        };
        t = Ve(t, e);
        if (e.isBefore(t)) n = Ke(e, t); else {
            n = Ke(t, e);
            n.milliseconds = -n.milliseconds;
            n.months = -n.months;
        }
        return n;
    }
    function tt(e, t) {
        return function(n, r) {
            var i, s;
            if (null !== r && !isNaN(+r)) {
                ae(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period).");
                s = n;
                n = r;
                r = s;
            }
            n = "string" === typeof n ? +n : n;
            i = Je(n, r);
            nt(this, i, e);
            return this;
        };
    }
    function nt(t, n, r, i) {
        var s = n._milliseconds, a = n._days, o = n._months;
        if (!t.isValid()) return;
        i = null == i ? true : i;
        s && t._d.setTime(+t._d + s * r);
        a && I(t, "Date", P(t, "Date") + a * r);
        o && J(t, P(t, "Month") + o * r);
        i && e.updateOffset(t, a || o);
    }
    function rt(e, t) {
        var n = e || We(), r = Ve(n, this).startOf("day"), i = this.diff(r, "days", true), s = i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse";
        var a = t && (x(t[s]) ? t[s]() : t[s]);
        return this.format(a || this.localeData().calendar(s, this, We(n)));
    }
    function it() {
        return new m(this);
    }
    function st(e, t) {
        var n = _(e) ? e : We(e);
        if (!(this.isValid() && n.isValid())) return false;
        t = O(h(t) ? "millisecond" : t);
        return "millisecond" === t ? +this > +n : +n < +this.clone().startOf(t);
    }
    function at(e, t) {
        var n = _(e) ? e : We(e);
        if (!(this.isValid() && n.isValid())) return false;
        t = O(h(t) ? "millisecond" : t);
        return "millisecond" === t ? +this < +n : +this.clone().endOf(t) < +n;
    }
    function ot(e, t, n) {
        return this.isAfter(e, n) && this.isBefore(t, n);
    }
    function ut(e, t) {
        var n, r = _(e) ? e : We(e);
        if (!(this.isValid() && r.isValid())) return false;
        t = O(t || "millisecond");
        if ("millisecond" === t) return +this === +r;
        n = +r;
        return +this.clone().startOf(t) <= n && n <= +this.clone().endOf(t);
    }
    function lt(e, t) {
        return this.isSame(e, t) || this.isAfter(e, t);
    }
    function dt(e, t) {
        return this.isSame(e, t) || this.isBefore(e, t);
    }
    function ft(e, t, n) {
        var r, i, s, a;
        if (!this.isValid()) return NaN;
        r = Ve(e, this);
        if (!r.isValid()) return NaN;
        i = 6e4 * (r.utcOffset() - this.utcOffset());
        t = O(t);
        if ("year" === t || "month" === t || "quarter" === t) {
            a = ht(this, r);
            "quarter" === t ? a /= 3 : "year" === t && (a /= 12);
        } else {
            s = this - r;
            a = "second" === t ? s / 1e3 : "minute" === t ? s / 6e4 : "hour" === t ? s / 36e5 : "day" === t ? (s - i) / 864e5 : "week" === t ? (s - i) / 6048e5 : s;
        }
        return n ? a : v(a);
    }
    function ht(e, t) {
        var n, r, i = 12 * (t.year() - e.year()) + (t.month() - e.month()), s = e.clone().add(i, "months");
        if (t - s < 0) {
            n = e.clone().add(i - 1, "months");
            r = (t - s) / (s - n);
        } else {
            n = e.clone().add(i + 1, "months");
            r = (t - s) / (n - s);
        }
        return -(i + r);
    }
    function ct() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
    }
    function mt() {
        var e = this.clone().utc();
        return 0 < e.year() && e.year() <= 9999 ? x(Date.prototype.toISOString) ? this.toDate().toISOString() : V(e, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : V(e, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
    }
    function _t(t) {
        var n = V(this, t || e.defaultFormat);
        return this.localeData().postformat(n);
    }
    function vt(e, t) {
        return this.isValid() && (_(e) && e.isValid() || We(e).isValid()) ? Je({
            to: this,
            from: e
        }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
    }
    function pt(e) {
        return this.from(We(), e);
    }
    function gt(e, t) {
        return this.isValid() && (_(e) && e.isValid() || We(e).isValid()) ? Je({
            from: this,
            to: e
        }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate();
    }
    function yt(e) {
        return this.to(We(), e);
    }
    function wt(e) {
        var t;
        if (void 0 === e) return this._locale._abbr;
        t = Y(e);
        null != t && (this._locale = t);
        return this;
    }
    function Mt() {
        return this._locale;
    }
    function bt(e) {
        e = O(e);
        switch (e) {
          case "year":
            this.month(0);

          case "quarter":
          case "month":
            this.date(1);

          case "week":
          case "isoWeek":
          case "day":
            this.hours(0);

          case "hour":
            this.minutes(0);

          case "minute":
            this.seconds(0);

          case "second":
            this.milliseconds(0);
        }
        "week" === e && this.weekday(0);
        "isoWeek" === e && this.isoWeekday(1);
        "quarter" === e && this.month(3 * Math.floor(this.month() / 3));
        return this;
    }
    function Dt(e) {
        e = O(e);
        if (void 0 === e || "millisecond" === e) return this;
        return this.startOf(e).add(1, "isoWeek" === e ? "week" : e).subtract(1, "ms");
    }
    function St() {
        return +this._d - 6e4 * (this._offset || 0);
    }
    function Yt() {
        return Math.floor(+this / 1e3);
    }
    function kt() {
        return this._offset ? new Date(+this) : this._d;
    }
    function Ot() {
        var e = this;
        return [ e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond() ];
    }
    function Tt() {
        var e = this;
        return {
            years: e.year(),
            months: e.month(),
            date: e.date(),
            hours: e.hours(),
            minutes: e.minutes(),
            seconds: e.seconds(),
            milliseconds: e.milliseconds()
        };
    }
    function xt() {
        return this.isValid() ? this.toISOString() : "null";
    }
    function Wt() {
        return d(this);
    }
    function Pt() {
        return a({}, l(this));
    }
    function It() {
        return l(this).overflow;
    }
    function Ct() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        };
    }
    function Ut(e, t) {
        G(0, [ e, e.length ], 0, t);
    }
    function Gt(e) {
        return Rt.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
    }
    function Ft(e) {
        return Rt.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4);
    }
    function Ht() {
        return pe(this.year(), 1, 4);
    }
    function Vt() {
        var e = this.localeData()._week;
        return pe(this.year(), e.dow, e.doy);
    }
    function Rt(e, t, n, r, i) {
        var s;
        if (null == e) return ve(this, r, i).year;
        s = pe(e, r, i);
        t > s && (t = s);
        return Et.call(this, e, t, n, r, i);
    }
    function Et(e, t, n, r, i) {
        var s = _e(e, t, n, r, i), a = de(s.year, 0, s.dayOfYear);
        this.year(a.getUTCFullYear());
        this.month(a.getUTCMonth());
        this.date(a.getUTCDate());
        return this;
    }
    function jt(e) {
        return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3);
    }
    function Nt(e) {
        return ve(e, this._week.dow, this._week.doy).week;
    }
    function Lt() {
        return this._week.dow;
    }
    function At() {
        return this._week.doy;
    }
    function zt(e) {
        var t = this.localeData().week(this);
        return null == e ? t : this.add(7 * (e - t), "d");
    }
    function Zt(e) {
        var t = ve(this, 1, 4).week;
        return null == e ? t : this.add(7 * (e - t), "d");
    }
    function $t(e, t) {
        if ("string" !== typeof e) return e;
        if (!isNaN(e)) return parseInt(e, 10);
        e = t.weekdaysParse(e);
        if ("number" === typeof e) return e;
        return null;
    }
    function Qt(e, t) {
        return n(this._weekdays) ? this._weekdays[e.day()] : this._weekdays[this._weekdays.isFormat.test(t) ? "format" : "standalone"][e.day()];
    }
    function Bt(e) {
        return this._weekdaysShort[e.day()];
    }
    function qt(e) {
        return this._weekdaysMin[e.day()];
    }
    function Jt(e, t, n) {
        var r, i, s;
        if (!this._weekdaysParse) {
            this._weekdaysParse = [];
            this._minWeekdaysParse = [];
            this._shortWeekdaysParse = [];
            this._fullWeekdaysParse = [];
        }
        for (r = 0; r < 7; r++) {
            i = We([ 2e3, 1 ]).day(r);
            if (n && !this._fullWeekdaysParse[r]) {
                this._fullWeekdaysParse[r] = new RegExp("^" + this.weekdays(i, "").replace(".", ".?") + "$", "i");
                this._shortWeekdaysParse[r] = new RegExp("^" + this.weekdaysShort(i, "").replace(".", ".?") + "$", "i");
                this._minWeekdaysParse[r] = new RegExp("^" + this.weekdaysMin(i, "").replace(".", ".?") + "$", "i");
            }
            if (!this._weekdaysParse[r]) {
                s = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, "");
                this._weekdaysParse[r] = new RegExp(s.replace(".", ""), "i");
            }
            if (n && "dddd" === t && this._fullWeekdaysParse[r].test(e)) return r;
            if (n && "ddd" === t && this._shortWeekdaysParse[r].test(e)) return r;
            if (n && "dd" === t && this._minWeekdaysParse[r].test(e)) return r;
            if (!n && this._weekdaysParse[r].test(e)) return r;
        }
    }
    function Xt(e) {
        if (!this.isValid()) return null != e ? this : NaN;
        var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (null != e) {
            e = $t(e, this.localeData());
            return this.add(e - t, "d");
        }
        return t;
    }
    function Kt(e) {
        if (!this.isValid()) return null != e ? this : NaN;
        var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == e ? t : this.add(e - t, "d");
    }
    function en(e) {
        if (!this.isValid()) return null != e ? this : NaN;
        return null == e ? this.day() || 7 : this.day(this.day() % 7 ? e : e - 7);
    }
    function tn(e) {
        var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == e ? t : this.add(e - t, "d");
    }
    function nn() {
        return this.hours() % 12 || 12;
    }
    function rn(e, t) {
        G(e, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), t);
        });
    }
    function sn(e, t) {
        return t._meridiemParse;
    }
    function an(e) {
        return "p" === (e + "").toLowerCase().charAt(0);
    }
    function on(e, t, n) {
        return e > 11 ? n ? "pm" : "PM" : n ? "am" : "AM";
    }
    function un(e, t) {
        t[Tr] = p(1e3 * ("0." + e));
    }
    function ln() {
        return this._isUTC ? "UTC" : "";
    }
    function dn() {
        return this._isUTC ? "Coordinated Universal Time" : "";
    }
    function fn(e) {
        return We(1e3 * e);
    }
    function hn() {
        return We.apply(null, arguments).parseZone();
    }
    function cn(e, t, n) {
        var r = this._calendar[e];
        return x(r) ? r.call(t, n) : r;
    }
    function mn(e) {
        var t = this._longDateFormat[e], n = this._longDateFormat[e.toUpperCase()];
        if (t || !n) return t;
        this._longDateFormat[e] = n.replace(/MMMM|MM|DD|dddd/g, function(e) {
            return e.slice(1);
        });
        return this._longDateFormat[e];
    }
    function _n() {
        return this._invalidDate;
    }
    function vn(e) {
        return this._ordinal.replace("%d", e);
    }
    function pn(e) {
        return e;
    }
    function gn(e, t, n, r) {
        var i = this._relativeTime[n];
        return x(i) ? i(e, t, n, r) : i.replace(/%d/i, e);
    }
    function yn(e, t) {
        var n = this._relativeTime[e > 0 ? "future" : "past"];
        return x(n) ? n(t) : n.replace(/%s/i, t);
    }
    function wn(e) {
        var t, n;
        for (n in e) {
            t = e[n];
            x(t) ? this[n] = t : this["_" + n] = t;
        }
        this._ordinalParseLenient = new RegExp(this._ordinalParse.source + "|" + /\d{1,2}/.source);
    }
    function Mn(e, t, n, r) {
        var i = Y();
        var s = o().set(r, t);
        return i[n](s, e);
    }
    function bn(e, t, n, r, i) {
        if ("number" === typeof e) {
            t = e;
            e = void 0;
        }
        e = e || "";
        if (null != t) return Mn(e, t, n, i);
        var s;
        var a = [];
        for (s = 0; s < r; s++) a[s] = Mn(e, s, n, i);
        return a;
    }
    function Dn(e, t) {
        return bn(e, t, "months", 12, "month");
    }
    function Sn(e, t) {
        return bn(e, t, "monthsShort", 12, "month");
    }
    function Yn(e, t) {
        return bn(e, t, "weekdays", 7, "day");
    }
    function kn(e, t) {
        return bn(e, t, "weekdaysShort", 7, "day");
    }
    function On(e, t) {
        return bn(e, t, "weekdaysMin", 7, "day");
    }
    function Tn() {
        var e = this._data;
        this._milliseconds = yi(this._milliseconds);
        this._days = yi(this._days);
        this._months = yi(this._months);
        e.milliseconds = yi(e.milliseconds);
        e.seconds = yi(e.seconds);
        e.minutes = yi(e.minutes);
        e.hours = yi(e.hours);
        e.months = yi(e.months);
        e.years = yi(e.years);
        return this;
    }
    function xn(e, t, n, r) {
        var i = Je(t, n);
        e._milliseconds += r * i._milliseconds;
        e._days += r * i._days;
        e._months += r * i._months;
        return e._bubble();
    }
    function Wn(e, t) {
        return xn(this, e, t, 1);
    }
    function Pn(e, t) {
        return xn(this, e, t, -1);
    }
    function In(e) {
        return e < 0 ? Math.floor(e) : Math.ceil(e);
    }
    function Cn() {
        var e = this._milliseconds;
        var t = this._days;
        var n = this._months;
        var r = this._data;
        var i, s, a, o, u;
        if (!(e >= 0 && t >= 0 && n >= 0 || e <= 0 && t <= 0 && n <= 0)) {
            e += 864e5 * In(Gn(n) + t);
            t = 0;
            n = 0;
        }
        r.milliseconds = e % 1e3;
        i = v(e / 1e3);
        r.seconds = i % 60;
        s = v(i / 60);
        r.minutes = s % 60;
        a = v(s / 60);
        r.hours = a % 24;
        t += v(a / 24);
        u = v(Un(t));
        n += u;
        t -= In(Gn(u));
        o = v(n / 12);
        n %= 12;
        r.days = t;
        r.months = n;
        r.years = o;
        return this;
    }
    function Un(e) {
        return 4800 * e / 146097;
    }
    function Gn(e) {
        return 146097 * e / 4800;
    }
    function Fn(e) {
        var t;
        var n;
        var r = this._milliseconds;
        e = O(e);
        if ("month" === e || "year" === e) {
            t = this._days + r / 864e5;
            n = this._months + Un(t);
            return "month" === e ? n : n / 12;
        }
        t = this._days + Math.round(Gn(this._months));
        switch (e) {
          case "week":
            return t / 7 + r / 6048e5;

          case "day":
            return t + r / 864e5;

          case "hour":
            return 24 * t + r / 36e5;

          case "minute":
            return 1440 * t + r / 6e4;

          case "second":
            return 86400 * t + r / 1e3;

          case "millisecond":
            return Math.floor(864e5 * t) + r;

          default:
            throw new Error("Unknown unit " + e);
        }
    }
    function Hn() {
        return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * p(this._months / 12);
    }
    function Vn(e) {
        return function() {
            return this.as(e);
        };
    }
    function Rn(e) {
        e = O(e);
        return this[e + "s"]();
    }
    function En(e) {
        return function() {
            return this._data[e];
        };
    }
    function jn() {
        return v(this.days() / 7);
    }
    function Nn(e, t, n, r, i) {
        return i.relativeTime(t || 1, !!n, e, r);
    }
    function Ln(e, t, n) {
        var r = Je(e).abs();
        var i = Gi(r.as("s"));
        var s = Gi(r.as("m"));
        var a = Gi(r.as("h"));
        var o = Gi(r.as("d"));
        var u = Gi(r.as("M"));
        var l = Gi(r.as("y"));
        var d = i < Fi.s && [ "s", i ] || s <= 1 && [ "m" ] || s < Fi.m && [ "mm", s ] || a <= 1 && [ "h" ] || a < Fi.h && [ "hh", a ] || o <= 1 && [ "d" ] || o < Fi.d && [ "dd", o ] || u <= 1 && [ "M" ] || u < Fi.M && [ "MM", u ] || l <= 1 && [ "y" ] || [ "yy", l ];
        d[2] = t;
        d[3] = +e > 0;
        d[4] = n;
        return Nn.apply(null, d);
    }
    function An(e, t) {
        if (void 0 === Fi[e]) return false;
        if (void 0 === t) return Fi[e];
        Fi[e] = t;
        return true;
    }
    function zn(e) {
        var t = this.localeData();
        var n = Ln(this, !e, t);
        e && (n = t.pastFuture(+this, n));
        return t.postformat(n);
    }
    function Zn() {
        var e = Hi(this._milliseconds) / 1e3;
        var t = Hi(this._days);
        var n = Hi(this._months);
        var r, i, s;
        r = v(e / 60);
        i = v(r / 60);
        e %= 60;
        r %= 60;
        s = v(n / 12);
        n %= 12;
        var a = s;
        var o = n;
        var u = t;
        var l = i;
        var d = r;
        var f = e;
        var h = this.asSeconds();
        if (!h) return "P0D";
        return (h < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (o ? o + "M" : "") + (u ? u + "D" : "") + (l || d || f ? "T" : "") + (l ? l + "H" : "") + (d ? d + "M" : "") + (f ? f + "S" : "");
    }
    var $n;
    var Qn = e.momentProperties = [];
    var Bn = false;
    var qn = {};
    var Jn;
    var Xn = {};
    var Kn = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;
    var er = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;
    var tr = {};
    var nr = {};
    var rr = /\d/;
    var ir = /\d\d/;
    var sr = /\d{3}/;
    var ar = /\d{4}/;
    var or = /[+-]?\d{6}/;
    var ur = /\d\d?/;
    var lr = /\d\d\d\d?/;
    var dr = /\d\d\d\d\d\d?/;
    var fr = /\d{1,3}/;
    var hr = /\d{1,4}/;
    var cr = /[+-]?\d{1,6}/;
    var mr = /\d+/;
    var _r = /[+-]?\d+/;
    var vr = /Z|[+-]\d\d:?\d\d/gi;
    var pr = /Z|[+-]\d\d(?::?\d\d)?/gi;
    var gr = /[+-]?\d+(\.\d{1,3})?/;
    var yr = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
    var wr = {};
    var Mr = {};
    var br = 0;
    var Dr = 1;
    var Sr = 2;
    var Yr = 3;
    var kr = 4;
    var Or = 5;
    var Tr = 6;
    var xr = 7;
    var Wr = 8;
    G("M", [ "MM", 2 ], "Mo", function() {
        return this.month() + 1;
    });
    G("MMM", 0, 0, function(e) {
        return this.localeData().monthsShort(this, e);
    });
    G("MMMM", 0, 0, function(e) {
        return this.localeData().months(this, e);
    });
    k("month", "M");
    E("M", ur);
    E("MM", ur, ir);
    E("MMM", function(e, t) {
        return t.monthsShortRegex(e);
    });
    E("MMMM", function(e, t) {
        return t.monthsRegex(e);
    });
    A([ "M", "MM" ], function(e, t) {
        t[Dr] = p(e) - 1;
    });
    A([ "MMM", "MMMM" ], function(e, t, n, r) {
        var i = n._locale.monthsParse(e, r, n._strict);
        null != i ? t[Dr] = i : l(n).invalidMonth = e;
    });
    var Pr = /D[oD]?(\[[^\[\]]*\]|\s+)+MMMM?/;
    var Ir = "January_February_March_April_May_June_July_August_September_October_November_December".split("_");
    var Cr = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_");
    var Ur = yr;
    var Gr = yr;
    var Fr = {};
    e.suppressDeprecationWarnings = false;
    var Hr = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var Vr = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/;
    var Rr = /Z|[+-]\d\d(?::?\d\d)?/;
    var Er = [ [ "YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/ ], [ "YYYY-MM-DD", /\d{4}-\d\d-\d\d/ ], [ "GGGG-[W]WW-E", /\d{4}-W\d\d-\d/ ], [ "GGGG-[W]WW", /\d{4}-W\d\d/, false ], [ "YYYY-DDD", /\d{4}-\d{3}/ ], [ "YYYY-MM", /\d{4}-\d\d/, false ], [ "YYYYYYMMDD", /[+-]\d{10}/ ], [ "YYYYMMDD", /\d{8}/ ], [ "GGGG[W]WWE", /\d{4}W\d{3}/ ], [ "GGGG[W]WW", /\d{4}W\d{2}/, false ], [ "YYYYDDD", /\d{7}/ ] ];
    var jr = [ [ "HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/ ], [ "HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/ ], [ "HH:mm:ss", /\d\d:\d\d:\d\d/ ], [ "HH:mm", /\d\d:\d\d/ ], [ "HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/ ], [ "HHmmss,SSSS", /\d\d\d\d\d\d,\d+/ ], [ "HHmmss", /\d\d\d\d\d\d/ ], [ "HHmm", /\d\d\d\d/ ], [ "HH", /\d\d/ ] ];
    var Nr = /^\/?Date\((\-?\d+)/i;
    e.createFromInputFallback = se("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(e) {
        e._d = new Date(e._i + (e._useUTC ? " UTC" : ""));
    });
    G("Y", 0, 0, function() {
        var e = this.year();
        return e <= 9999 ? "" + e : "+" + e;
    });
    G(0, [ "YY", 2 ], 0, function() {
        return this.year() % 100;
    });
    G(0, [ "YYYY", 4 ], 0, "year");
    G(0, [ "YYYYY", 5 ], 0, "year");
    G(0, [ "YYYYYY", 6, true ], 0, "year");
    k("year", "y");
    E("Y", _r);
    E("YY", ur, ir);
    E("YYYY", hr, ar);
    E("YYYYY", cr, or);
    E("YYYYYY", cr, or);
    A([ "YYYYY", "YYYYYY" ], br);
    A("YYYY", function(t, n) {
        n[br] = 2 === t.length ? e.parseTwoDigitYear(t) : p(t);
    });
    A("YY", function(t, n) {
        n[br] = e.parseTwoDigitYear(t);
    });
    A("Y", function(e, t) {
        t[br] = parseInt(e, 10);
    });
    e.parseTwoDigitYear = function(e) {
        return p(e) + (p(e) > 68 ? 1900 : 2e3);
    };
    var Lr = W("FullYear", false);
    e.ISO_8601 = function() {};
    var Ar = se("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function() {
        var e = We.apply(null, arguments);
        return this.isValid() && e.isValid() ? e < this ? this : e : f();
    });
    var zr = se("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function() {
        var e = We.apply(null, arguments);
        return this.isValid() && e.isValid() ? e > this ? this : e : f();
    });
    var Zr = function() {
        return Date.now ? Date.now() : +new Date();
    };
    Fe("Z", ":");
    Fe("ZZ", "");
    E("Z", pr);
    E("ZZ", pr);
    A([ "Z", "ZZ" ], function(e, t, n) {
        n._useUTC = true;
        n._tzm = He(pr, e);
    });
    var $r = /([\+\-]|\d\d)/gi;
    e.updateOffset = function() {};
    var Qr = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?\d*)?$/;
    var Br = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/;
    Je.fn = Ue.prototype;
    var qr = tt(1, "add");
    var Jr = tt(-1, "subtract");
    e.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
    var Xr = se("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(e) {
        return void 0 === e ? this.localeData() : this.locale(e);
    });
    G(0, [ "gg", 2 ], 0, function() {
        return this.weekYear() % 100;
    });
    G(0, [ "GG", 2 ], 0, function() {
        return this.isoWeekYear() % 100;
    });
    Ut("gggg", "weekYear");
    Ut("ggggg", "weekYear");
    Ut("GGGG", "isoWeekYear");
    Ut("GGGGG", "isoWeekYear");
    k("weekYear", "gg");
    k("isoWeekYear", "GG");
    E("G", _r);
    E("g", _r);
    E("GG", ur, ir);
    E("gg", ur, ir);
    E("GGGG", hr, ar);
    E("gggg", hr, ar);
    E("GGGGG", cr, or);
    E("ggggg", cr, or);
    z([ "gggg", "ggggg", "GGGG", "GGGGG" ], function(e, t, n, r) {
        t[r.substr(0, 2)] = p(e);
    });
    z([ "gg", "GG" ], function(t, n, r, i) {
        n[i] = e.parseTwoDigitYear(t);
    });
    G("Q", 0, "Qo", "quarter");
    k("quarter", "Q");
    E("Q", rr);
    A("Q", function(e, t) {
        t[Dr] = 3 * (p(e) - 1);
    });
    G("w", [ "ww", 2 ], "wo", "week");
    G("W", [ "WW", 2 ], "Wo", "isoWeek");
    k("week", "w");
    k("isoWeek", "W");
    E("w", ur);
    E("ww", ur, ir);
    E("W", ur);
    E("WW", ur, ir);
    z([ "w", "ww", "W", "WW" ], function(e, t, n, r) {
        t[r.substr(0, 1)] = p(e);
    });
    var Kr = {
        dow: 0,
        doy: 6
    };
    G("D", [ "DD", 2 ], "Do", "date");
    k("date", "D");
    E("D", ur);
    E("DD", ur, ir);
    E("Do", function(e, t) {
        return e ? t._ordinalParse : t._ordinalParseLenient;
    });
    A([ "D", "DD" ], Sr);
    A("Do", function(e, t) {
        t[Sr] = p(e.match(ur)[0], 10);
    });
    var ei = W("Date", true);
    G("d", 0, "do", "day");
    G("dd", 0, 0, function(e) {
        return this.localeData().weekdaysMin(this, e);
    });
    G("ddd", 0, 0, function(e) {
        return this.localeData().weekdaysShort(this, e);
    });
    G("dddd", 0, 0, function(e) {
        return this.localeData().weekdays(this, e);
    });
    G("e", 0, 0, "weekday");
    G("E", 0, 0, "isoWeekday");
    k("day", "d");
    k("weekday", "e");
    k("isoWeekday", "E");
    E("d", ur);
    E("e", ur);
    E("E", ur);
    E("dd", yr);
    E("ddd", yr);
    E("dddd", yr);
    z([ "dd", "ddd", "dddd" ], function(e, t, n, r) {
        var i = n._locale.weekdaysParse(e, r, n._strict);
        null != i ? t.d = i : l(n).invalidWeekday = e;
    });
    z([ "d", "e", "E" ], function(e, t, n, r) {
        t[r] = p(e);
    });
    var ti = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_");
    var ni = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_");
    var ri = "Su_Mo_Tu_We_Th_Fr_Sa".split("_");
    G("DDD", [ "DDDD", 3 ], "DDDo", "dayOfYear");
    k("dayOfYear", "DDD");
    E("DDD", fr);
    E("DDDD", sr);
    A([ "DDD", "DDDD" ], function(e, t, n) {
        n._dayOfYear = p(e);
    });
    G("H", [ "HH", 2 ], 0, "hour");
    G("h", [ "hh", 2 ], 0, nn);
    G("hmm", 0, 0, function() {
        return "" + nn.apply(this) + U(this.minutes(), 2);
    });
    G("hmmss", 0, 0, function() {
        return "" + nn.apply(this) + U(this.minutes(), 2) + U(this.seconds(), 2);
    });
    G("Hmm", 0, 0, function() {
        return "" + this.hours() + U(this.minutes(), 2);
    });
    G("Hmmss", 0, 0, function() {
        return "" + this.hours() + U(this.minutes(), 2) + U(this.seconds(), 2);
    });
    rn("a", true);
    rn("A", false);
    k("hour", "h");
    E("a", sn);
    E("A", sn);
    E("H", ur);
    E("h", ur);
    E("HH", ur, ir);
    E("hh", ur, ir);
    E("hmm", lr);
    E("hmmss", dr);
    E("Hmm", lr);
    E("Hmmss", dr);
    A([ "H", "HH" ], Yr);
    A([ "a", "A" ], function(e, t, n) {
        n._isPm = n._locale.isPM(e);
        n._meridiem = e;
    });
    A([ "h", "hh" ], function(e, t, n) {
        t[Yr] = p(e);
        l(n).bigHour = true;
    });
    A("hmm", function(e, t, n) {
        var r = e.length - 2;
        t[Yr] = p(e.substr(0, r));
        t[kr] = p(e.substr(r));
        l(n).bigHour = true;
    });
    A("hmmss", function(e, t, n) {
        var r = e.length - 4;
        var i = e.length - 2;
        t[Yr] = p(e.substr(0, r));
        t[kr] = p(e.substr(r, 2));
        t[Or] = p(e.substr(i));
        l(n).bigHour = true;
    });
    A("Hmm", function(e, t, n) {
        var r = e.length - 2;
        t[Yr] = p(e.substr(0, r));
        t[kr] = p(e.substr(r));
    });
    A("Hmmss", function(e, t, n) {
        var r = e.length - 4;
        var i = e.length - 2;
        t[Yr] = p(e.substr(0, r));
        t[kr] = p(e.substr(r, 2));
        t[Or] = p(e.substr(i));
    });
    var ii = /[ap]\.?m?\.?/i;
    var si = W("Hours", true);
    G("m", [ "mm", 2 ], 0, "minute");
    k("minute", "m");
    E("m", ur);
    E("mm", ur, ir);
    A([ "m", "mm" ], kr);
    var ai = W("Minutes", false);
    G("s", [ "ss", 2 ], 0, "second");
    k("second", "s");
    E("s", ur);
    E("ss", ur, ir);
    A([ "s", "ss" ], Or);
    var oi = W("Seconds", false);
    G("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
    });
    G(0, [ "SS", 2 ], 0, function() {
        return ~~(this.millisecond() / 10);
    });
    G(0, [ "SSS", 3 ], 0, "millisecond");
    G(0, [ "SSSS", 4 ], 0, function() {
        return 10 * this.millisecond();
    });
    G(0, [ "SSSSS", 5 ], 0, function() {
        return 100 * this.millisecond();
    });
    G(0, [ "SSSSSS", 6 ], 0, function() {
        return 1e3 * this.millisecond();
    });
    G(0, [ "SSSSSSS", 7 ], 0, function() {
        return 1e4 * this.millisecond();
    });
    G(0, [ "SSSSSSSS", 8 ], 0, function() {
        return 1e5 * this.millisecond();
    });
    G(0, [ "SSSSSSSSS", 9 ], 0, function() {
        return 1e6 * this.millisecond();
    });
    k("millisecond", "ms");
    E("S", fr, rr);
    E("SS", fr, ir);
    E("SSS", fr, sr);
    var ui;
    for (ui = "SSSS"; ui.length <= 9; ui += "S") E(ui, mr);
    for (ui = "S"; ui.length <= 9; ui += "S") A(ui, un);
    var li = W("Milliseconds", false);
    G("z", 0, 0, "zoneAbbr");
    G("zz", 0, 0, "zoneName");
    var di = m.prototype;
    di.add = qr;
    di.calendar = rt;
    di.clone = it;
    di.diff = ft;
    di.endOf = Dt;
    di.format = _t;
    di.from = vt;
    di.fromNow = pt;
    di.to = gt;
    di.toNow = yt;
    di.get = C;
    di.invalidAt = It;
    di.isAfter = st;
    di.isBefore = at;
    di.isBetween = ot;
    di.isSame = ut;
    di.isSameOrAfter = lt;
    di.isSameOrBefore = dt;
    di.isValid = Wt;
    di.lang = Xr;
    di.locale = wt;
    di.localeData = Mt;
    di.max = zr;
    di.min = Ar;
    di.parsingFlags = Pt;
    di.set = C;
    di.startOf = bt;
    di.subtract = Jr;
    di.toArray = Ot;
    di.toObject = Tt;
    di.toDate = kt;
    di.toISOString = mt;
    di.toJSON = xt;
    di.toString = ct;
    di.unix = Yt;
    di.valueOf = St;
    di.creationData = Ct;
    di.year = Lr;
    di.isLeapYear = ce;
    di.weekYear = Gt;
    di.isoWeekYear = Ft;
    di.quarter = di.quarters = jt;
    di.month = X;
    di.daysInMonth = K;
    di.week = di.weeks = zt;
    di.isoWeek = di.isoWeeks = Zt;
    di.weeksInYear = Vt;
    di.isoWeeksInYear = Ht;
    di.date = ei;
    di.day = di.days = Xt;
    di.weekday = Kt;
    di.isoWeekday = en;
    di.dayOfYear = tn;
    di.hour = di.hours = si;
    di.minute = di.minutes = ai;
    di.second = di.seconds = oi;
    di.millisecond = di.milliseconds = li;
    di.utcOffset = Ee;
    di.utc = Ne;
    di.local = Le;
    di.parseZone = Ae;
    di.hasAlignedHourOffset = ze;
    di.isDST = Ze;
    di.isDSTShifted = $e;
    di.isLocal = Qe;
    di.isUtcOffset = Be;
    di.isUtc = qe;
    di.isUTC = qe;
    di.zoneAbbr = ln;
    di.zoneName = dn;
    di.dates = se("dates accessor is deprecated. Use date instead.", ei);
    di.months = se("months accessor is deprecated. Use month instead", X);
    di.years = se("years accessor is deprecated. Use year instead", Lr);
    di.zone = se("moment().zone is deprecated, use moment().utcOffset instead. https://github.com/moment/moment/issues/1779", je);
    var fi = di;
    var hi = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
    };
    var ci = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
    };
    var mi = "Invalid date";
    var _i = "%d";
    var vi = /\d{1,2}/;
    var pi = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    };
    var gi = y.prototype;
    gi._calendar = hi;
    gi.calendar = cn;
    gi._longDateFormat = ci;
    gi.longDateFormat = mn;
    gi._invalidDate = mi;
    gi.invalidDate = _n;
    gi._ordinal = _i;
    gi.ordinal = vn;
    gi._ordinalParse = vi;
    gi.preparse = pn;
    gi.postformat = pn;
    gi._relativeTime = pi;
    gi.relativeTime = gn;
    gi.pastFuture = yn;
    gi.set = wn;
    gi.months = Q;
    gi._months = Ir;
    gi.monthsShort = B;
    gi._monthsShort = Cr;
    gi.monthsParse = q;
    gi._monthsRegex = Gr;
    gi.monthsRegex = te;
    gi._monthsShortRegex = Ur;
    gi.monthsShortRegex = ee;
    gi.week = Nt;
    gi._week = Kr;
    gi.firstDayOfYear = At;
    gi.firstDayOfWeek = Lt;
    gi.weekdays = Qt;
    gi._weekdays = ti;
    gi.weekdaysMin = qt;
    gi._weekdaysMin = ri;
    gi.weekdaysShort = Bt;
    gi._weekdaysShort = ni;
    gi.weekdaysParse = Jt;
    gi.isPM = an;
    gi._meridiemParse = ii;
    gi.meridiem = on;
    D("en", {
        ordinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(e) {
            var t = e % 10, n = 1 === p(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th";
            return e + n;
        }
    });
    e.lang = se("moment.lang is deprecated. Use moment.locale instead.", D);
    e.langData = se("moment.langData is deprecated. Use moment.localeData instead.", Y);
    var yi = Math.abs;
    var wi = Vn("ms");
    var Mi = Vn("s");
    var bi = Vn("m");
    var Di = Vn("h");
    var Si = Vn("d");
    var Yi = Vn("w");
    var ki = Vn("M");
    var Oi = Vn("y");
    var Ti = En("milliseconds");
    var xi = En("seconds");
    var Wi = En("minutes");
    var Pi = En("hours");
    var Ii = En("days");
    var Ci = En("months");
    var Ui = En("years");
    var Gi = Math.round;
    var Fi = {
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
    };
    var Hi = Math.abs;
    var Vi = Ue.prototype;
    Vi.abs = Tn;
    Vi.add = Wn;
    Vi.subtract = Pn;
    Vi.as = Fn;
    Vi.asMilliseconds = wi;
    Vi.asSeconds = Mi;
    Vi.asMinutes = bi;
    Vi.asHours = Di;
    Vi.asDays = Si;
    Vi.asWeeks = Yi;
    Vi.asMonths = ki;
    Vi.asYears = Oi;
    Vi.valueOf = Hn;
    Vi._bubble = Cn;
    Vi.get = Rn;
    Vi.milliseconds = Ti;
    Vi.seconds = xi;
    Vi.minutes = Wi;
    Vi.hours = Pi;
    Vi.days = Ii;
    Vi.weeks = jn;
    Vi.months = Ci;
    Vi.years = Ui;
    Vi.humanize = zn;
    Vi.toISOString = Zn;
    Vi.toString = Zn;
    Vi.toJSON = Zn;
    Vi.locale = wt;
    Vi.localeData = Mt;
    Vi.toIsoString = se("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", Zn);
    Vi.lang = Xr;
    G("X", 0, 0, "unix");
    G("x", 0, 0, "valueOf");
    E("x", _r);
    E("X", gr);
    A("X", function(e, t, n) {
        n._d = new Date(1e3 * parseFloat(e, 10));
    });
    A("x", function(e, t, n) {
        n._d = new Date(p(e));
    });
    e.version = "2.11.2";
    t(We);
    e.fn = fi;
    e.min = Ie;
    e.max = Ce;
    e.now = Zr;
    e.utc = o;
    e.unix = fn;
    e.months = Dn;
    e.isDate = r;
    e.locale = D;
    e.invalid = f;
    e.duration = Je;
    e.isMoment = _;
    e.weekdays = Yn;
    e.parseZone = hn;
    e.localeData = Y;
    e.isDuration = Ge;
    e.monthsShort = Sn;
    e.weekdaysMin = On;
    e.defineLocale = S;
    e.weekdaysShort = kn;
    e.normalizeUnits = O;
    e.relativeTimeThreshold = An;
    e.prototype = fi;
    var Ri = e;
    return Ri;
});
var id = 0;

locale = {
    en: {
        month: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
        weekday: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
        Button: {
            Clean: "delete",
            Cancel: "cancel"
        }
    },
    de: {
        month: [ "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember" ],
        weekday: [ "So", "Mo", "Di", "Mi", "Do", "Fr", "Sa" ],
        Button: {
            Clean: "Löschen",
            Cancel: "Abbrechen"
        }
    }
}, prefixes = [ "moz", "ms", "webkit", "o" ];

(function($, window, document, undefined) {
    function flexbox_support() {
        var test = document.createElement("div").style;
        if (test.flex != undefined) return true;
        for (var i = prefixes.length - 1; i >= 0; i--) {
            if (test[prefixes[i] + "Flex"] != undefined) return true;
        }
        return false;
    }
    $.fn.md_datepicker = function(options) {
        "use strict";
        var start1 = moment();
        if (!flexbox_support()) {
            return $(this).each(function(index, el) {
                try {
                    el.type = "date";
                } catch (err) {
                    el.type = "text";
                }
            });
        }
        function createSvgElement(name) {
            return document.createElementNS(svgNS, name);
        }
        function createTick(dialRadius, radian, tickRadius, num, scale) {
            return '<div class="lolliclock-tick" style="left:' + (dialRadius + Math.sin(radian) * (radius * scale) - tickRadius).toFixed(2) + "px;top:" + (dialRadius - Math.cos(radian) * (radius * scale) - tickRadius).toFixed(2) + 'px">' + num + "</div>";
        }
        id++;
        var initilized = false;
        this.each(function() {
            if (this.initilized) initilized = true;
        });
        if (initilized) return;
        var defaults = {
            language: null,
            theme: "light",
            datepicker: true,
            timepicker: false,
            startday: 1,
            autoclose: false,
            mindate: null,
            maxdate: null,
            range: "past",
            _24h: false,
            format: "YYYY-MM-DD",
            animated: true,
            submit: "string",
            custom_class: ""
        }, localesupport = toLocaleStringSupports(), touchSupported = "ontouchstart" in window, mousedownEvent = "mousedown" + (touchSupported ? " touchstart" : ""), mousemoveEvent = "mousemove.lolliclock" + (touchSupported ? " touchmove.lolliclock" : ""), mouseupEvent = "mouseup.lolliclock" + (touchSupported ? " touchend.lolliclock" : ""), transitionend = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", today = new Date(), settings = $.extend({}, defaults, options), weekdaynumber = [ 0, 1, 2, 3, 4, 5, 6 ], parts = weekdaynumber.splice(-settings.startday), weekdaynumber = parts.concat(weekdaynumber);
        settings.language = settings.language ? settings.language : navigator.language || navigator.userLanguage || "en";
        settings.format = settings.timepicker && !options.format ? "YYYY-MM-DD HH:mm" : settings.format;
        today.setSeconds(0);
        if (settings.format) {
            var delimiter = settings.format.match(/\W/), format = settings.timepicker ? settings.format.split(" ")[0].split(delimiter).reverse() : settings.format.split(delimiter).reverse();
            console.log(format);
            if (settings.timepicker) {
                $.each(settings.format.split(" ")[1].split(":"), function(index, val) {
                    format.push(val);
                });
            }
            console.log(format);
        }
        if (localesupport) {
            for (var i = 0, temp_day, day_array = []; i < 7; i++) {
                temp_day = new Date(2015, 1, i);
                day_array[temp_day.getDateParts().weekday] = temp_day.toLocaleString(settings.language, {
                    weekday: "short"
                }).replace(".", "");
            }
            for (var i = 0, temp_day, month_array = []; i < 12; i++) {
                temp_day = new Date(2015, i, 1);
                month_array[i] = temp_day.toLocaleString(settings.language, {
                    month: "long"
                });
            }
        } else {
            var day_array = locale[settings.language.split("-")[0]].weekday.slice(0), month_array = locale[settings.language.split("-")[0]].month.slice(0);
        }
        parts = day_array.splice(0, settings.startday);
        var weekdays = day_array.concat(parts), day_template = "", weektemplate = "", month_template = "";
        $.each(weekdays, function(i, val) {
            weektemplate += "<span>" + val + "</span>";
        });
        $.each(month_array, function(i, val) {
            month_template += '<span data-month="' + i + '">' + month_array[i] + "</span>";
        });
        var max = 100, start = settings.mindate && settings.mindate.search(/^[-+]/) ? moment(settings.mindate) : moment().add(settings.mindate, "y"), end = settings.maxdate && settings.maxdate.search(/^[-+]/) ? moment(settings.maxdate) : moment().add(settings.maxdate, "y");
        if (settings.mindate && settings.maxdate) {
            max = moment.duration(end - start).years();
            settings.range = "calculated";
        } else if (settings.mindate && settings.range == "past") {
            max = moment.duration(today - start).years() + 1;
        } else if (settings.maxdate && settings.range == "future") {
            max = moment.duration(end - today).years();
        }
        for (var i = 0, temp_day, year_template = "", range = settings.range, today_year = today.getDateParts().year; i <= max; i++) {
            year_template += "<span>" + (range == "future" ? today_year + max - i : range == "past" ? today_year - i : range == "calculated" ? end.year() - i : today_year - (i - (max - max % 2) / 2)) + "</span>";
        }
        var submit_values = $(this);
        submit_values.each(function() {
            var Timestamp = document.createElement("input");
            Timestamp.type = "hidden";
            Timestamp.className = "";
            Timestamp.output = this;
            Timestamp.id = this.id + "-timestamp";
            this.readOnly = true;
            if (settings.submit == "timestamp") {
                this.name = "";
            } else {
                Timestamp.name = "";
            }
            this.Timestamp = Timestamp;
            this.parentNode.appendChild(Timestamp);
            this.onchange = function(e) {
                if (this.value != "") {
                    this.Timestamp.value = moment(this.value, settings.format).unix();
                    this.date = new Date(moment(this.value, settings.format).unix());
                } else {
                    this.Timestamp.value = 0;
                    this.Timestamp.date = undefined;
                }
            };
            this.Timestamp.onchange = function(e) {
                var Timestamp_value = Number(this.value * 1e3), old_function = Timestamp.output.onchange;
                Timestamp.output.onchange = null;
                if (this.value == "") {
                    Timestamp.output.value = "";
                    Timestamp.output.date = undefined;
                } else {
                    Timestamp.output.value = moment(Timestamp_value).format(settings.format);
                    Timestamp.output.date = new Date(Timestamp_value);
                }
                $(Timestamp.output).change();
                Timestamp.output.onchange = old_function;
            };
        });
        for (var i = 1; i <= 31; i++) {
            day_template += "<span>" + i + "</span>";
        }
        if (settings.timepicker) {
            var dummy_clock = $('<div class="md-clock" style="visibility: hidden">').appendTo("body"), height = parseInt(dummy_clock.height());
            dummy_clock.remove();
            var dialRadius = height / 2, radius = dialRadius - 32, tickRadius = 20, diameter = dialRadius * 2, duration = 350;
            var hours = settings._24h ? 25 : 13;
            for (var i = 1, hour_tmpl = "", radian; i < hours; i++) {
                radian = i / 6 * Math.PI;
                if (settings._24h && i < 13) {
                    hour_tmpl += createTick(dialRadius, radian, tickRadius, i, .6);
                } else {
                    hour_tmpl += createTick(dialRadius, radian, tickRadius, i, 1);
                }
            }
            for (var i = 0, min_tmpl = "", radian; i < 60; i += 5) {
                radian = i / 30 * Math.PI;
                min_tmpl += createTick(dialRadius, radian, tickRadius, i.pad(2), 1);
            }
            var timepicker = "" + '<div class="md-datepicker-timeview">' + '<div class="md-datepick-header">' + '<div class="md-datepicker-headline">' + '<span class="md-hour"></span>' + ":" + '<span class="md-minute"></span>' + '<div class="md-ampm-toggle">' + '<span class="md-am">AM</span>' + '<span class="md-pm">PM</span>' + "</div>" + "</div>" + '<i class="md-toggle-state no-hover">&#xE878</i>' + "</div>" + '<div class="md-clock">' + '<div class="md-hours">' + hour_tmpl + "</div>" + '<div class="md-minutes">' + min_tmpl + "</div>" + "</div>" + "</div>";
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="lolliclock-svg" width="' + height + '" height="' + height + '" style="transform: rotateZ(0deg);">' + '<g transform="translate(' + dialRadius + "," + dialRadius + ')">' + '<circle class="lolliclock-canvas-bg" r="' + tickRadius + '" cx="0" cy="-' + radius + '"></circle>' + '<circle class="lolliclock-canvas-fg" r="3.5" cx="0" cy="-' + radius + '" ></circle>' + '<line x1="0" y1="0" x2="0" y2="-' + (radius - tickRadius) + '"></line><circle class="lolliclock-bearing" cx="0" cy="0" r="3.5"></circle>' + "</g>" + "</svg>";
            var mousedown = function(e) {
                var offset = canvas.offset(), isTouch = /^touch/.test(e.type), x0 = offset.left + dialRadius, y0 = offset.top + dialRadius, dx = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0, dy = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0, z = Math.sqrt(dx * dx + dy * dy), moved = false;
                if (!cssua.ua.ie) proxy.el.svg.classList.remove("animate");
                if (z < radius - tickRadius || z > radius + tickRadius) {
                    return;
                }
                e.preventDefault();
                $(document.body).addClass("lolliclock-moving");
                canvas.append(self.canvas);
                setHand(dx, dy);
                proxy.el.svg.oldRot = proxy.el.svg.lastRot;
                $(document).off(mousemoveEvent).on(mousemoveEvent, function(e) {
                    e.preventDefault();
                    if (!cssua.ua.ie) proxy.el.svg.classList.remove("animate");
                    var isTouch = /^touch/.test(e.type), x = (isTouch ? e.originalEvent.touches[0] : e).pageX - x0, y = (isTouch ? e.originalEvent.touches[0] : e).pageY - y0;
                    if (!moved && x === dx && y === dy) {
                        return;
                    }
                    moved = true;
                    setHand(x, y);
                });
                $(document).off(mouseupEvent).on(mouseupEvent, function(e) {
                    e.preventDefault();
                    var isTouch = /^touch/.test(e.type), x = (isTouch ? e.originalEvent.changedTouches[0] : e).pageX - x0, y = (isTouch ? e.originalEvent.changedTouches[0] : e).pageY - y0;
                    if (x === dx && y === dy) {
                        setHand(x, y);
                    }
                    if (proxy.currentView === "hours") {
                        setTimeout(function() {
                            timepicker_change(true);
                        }, moved ? 0 : 250);
                    } else if (settings.autoclose) {}
                    $(document.body).removeClass("lolliclock-moving");
                    $(document).off(mousemoveEvent);
                    $(document).off(mouseupEvent);
                });
            };
        }
        var template = '<div class="md-datepicker md-' + settings.theme.split(" ").join(" md-") + (settings.animated == "all" || settings.animated == "inout" || settings.animated ? " md-datepicker-animated" : "") + (settings.custom_class != "" ? " " + settings.custom_class : "") + '" id="md-datepicker-' + id.pad(3) + '">' + '<div class="md-datepicker-views">' + '<div class="md-datepicker-dateview">' + '<div class="md-datepick-header">' + "<div>" + '<span class="year"></span>' + "</div>" + '<div class="md-datepicker-headline">' + '<span class="weekday"></span><span class="day"></span> <span class="month"></span>' + "</div>" + (settings.timepicker ? '<i class="md-toggle-state no-hover">&#xE192;</i>' : "") + "</div>" + '<div class="md-datepick-month">' + '<i class="md-previous md-touchtarget no-hover">&#xE408;</i><i class="md-next md-touchtarget no-hover">&#xE409;</i>' + "</div>" + '<div class="md-months">' + '<div class="md-previous-month md-month">' + '<div class="md-date-wrap"><span class="md-month-display"></span> <span class="md-year-display"></span></div>' + '<div class="md-weekday">' + weektemplate + "</div>" + '<div class="md-week">' + day_template + "</div>" + "</div>" + '<div class="md-current-month md-month">' + '<div class="md-date-wrap"><span class="md-month-display"></span> <span class="md-year-display"></span></div>' + '<div class="md-weekday">' + weektemplate + "</div>" + '<div class="md-week">' + day_template + "</div>" + "</div>" + '<div class="md-next-month md-month">' + '<div class="md-date-wrap"><span class="md-month-display"></span> <span class="md-year-display"></span></div>' + '<div class="md-weekday">' + weektemplate + "</div>" + '<div class="md-week">' + day_template + "</div>" + "</div>" + "</div>" + '<div class="month-select md-select-wrap">' + month_template + "</div>" + '<div class="year-select md-select-wrap">' + year_template + "</div>" + "</div>" + (settings.timepicker ? timepicker : "") + "</div>" + '<div class="md-buttons">' + '<div class="md-button-flat button-delete">' + locale[settings.language.split("-")[0]].Button.Clean + "</div>" + '<div class="md-button-flat button-cancel">' + locale[settings.language.split("-")[0]].Button.Cancel + "</div>" + '<div class="md-button-flat button-ok">OK</div>' + "</div>" + '</div><div class="md-datepicker__overlay"></div>';
        var setHand = function(x, y) {
            var radian = Math.atan2(-x, y) + Math.PI, isHours = proxy.currentView === "hours", unit = Math.PI / (isHours ? 6 : 30), nextview = isHours ? "minutes" : "hours", thisview = isHours ? "hours" : "minutes", nextRot = proxy.date.getDateParts()[nextview] * (Math.PI / (!isHours ? 6 : 30)) * (180 / Math.PI) % 360, value = Math.round(radian / unit), rotation = parseFloat((radian * (180 / Math.PI) % 360).toFixed(1));
            radian = value * unit;
            proxy.el.svg.lastRot = proxy.el.svg.currentRot - nextRot > 180 ? 360 + nextRot : nextRot;
            if (isHours) {
                value = isHours && value === 0 ? 12 : value;
                proxy.fg.style.visibility = "hidden";
                proxy.el.hour.text(proxy.hasClass("pm") ? value + 12 == 24 ? 12 : (value + 12).pad(2) : value == 12 ? "00" : value.pad(2));
                proxy.date.setHours(proxy.el.hour.text());
            } else {
                var isOnNum = value % 5 === 0;
                if (isOnNum) {
                    proxy.fg.style.visibility = "hidden";
                } else {
                    proxy.fg.style.visibility = "visible";
                }
                if (value === 60) {
                    value = 0;
                }
                proxy.el.minute.text(value.pad(2));
                proxy.date.setMinutes(proxy.el.minute.text());
            }
            var ticks = proxy.currentView == "hours" ? proxy.ticks.hours : proxy.ticks.minutes;
            ticks.each(function(index, el) {
                $(el).toggleClass("active", $(el).text() == value);
            });
            var currentRot = radian * (180 / Math.PI) % 360, calcRot = proxy.el.svg.lastRot - currentRot > 180 ? 360 + currentRot : currentRot;
            $(proxy.el.svg).css("transform", "rotateZ(" + calcRot + "deg)");
            proxy.el.svg.currentRot = calcRot;
        };
        var locate = function(input) {
            var pos = $(input).offset(), width = proxy.width(), height = proxy.height(), transform_origin = $(input).offset(), offsetTop = Math.min(window.innerHeight + window.pageYOffset, input.offsetParent.parentNode.getBoundingClientRect().height + input.offsetParent.parentNode.scrollTop), offsetLeft = Math.max(window.innerWidth + window.pageXOffset, input.offsetParent.parentNode.getBoundingClientRect().width + input.offsetParent.parentNode.scrollLeft);
            pos.top = pos.top + height + 8 >= offsetTop ? offsetTop - height - 8 : window.pageYOffset + 8 >= pos.top ? window.pageYOffset + 8 : pos.top;
            pos.left = pos.left + width + 8 >= offsetLeft ? offsetLeft - width - 8 : window.pageXOffset + 8 >= pos.left ? window.pageXOffset + 8 : pos.left;
            pos.transform_origin = transform_origin.left - pos.left + "px " + (transform_origin.top - pos.top) + "px";
            console.log({
                offsetTop: offsetTop,
                pagescrollY: window.pageYOffset,
                offsetLeft: offsetLeft,
                pagescrollX: window.pageXOffset,
                height: height,
                width: width
            });
            return pos;
        };
        this.show = function(input) {
            proxy.set = proxy.start == input ? "start" : "end";
            var date_str = input.value != "" ? settings.format ? moment(input.value, settings.format) : moment(input.value) : moment(validRange() ? proxy.set == "start" ? proxy.end.date : proxy.start.date : ""), pos = locate(input);
            proxy.date = new Date(date_str);
            proxy.date = isNaN(proxy.date.getTime()) ? new Date() : proxy.date;
            proxy.range = validRange();
            proxy.removeClass("invisible");
            proxy.el.prev_next_btns.removeClass("disabled");
            createMonthview("current");
            createMonthview("previous");
            createMonthview("next");
            update_view();
            if (settings.animated) {
                proxy.on(transitionend, function() {
                    proxy.addClass("animate");
                    proxy.off(transitionend);
                });
                if (proxy.hasClass("clockpicker")) {
                    proxy.removeClass("clockpicker");
                    proxy.on(transitionend, ".md-datepicker-views", function(event) {
                        event.preventDefault();
                        $(proxy).css({
                            top: pos.top,
                            left: pos.left,
                            "transform-origin": pos.transform_origin,
                            "-webkit-transform-origin": pos.transform_origin
                        }).off(transitionend);
                    });
                } else {
                    $(proxy).css({
                        top: pos.top,
                        left: pos.left,
                        "transform-origin": pos.transform_origin,
                        "-webkit-transform-origin": pos.transform_origin
                    }).addClass("md-datepicker-visible");
                }
            } else {
                $(proxy).css({
                    top: pos.top,
                    left: pos.left,
                    "transform-origin": pos.transform_origin,
                    "-webkit-transform-origin": pos.transform_origin
                }).addClass("md-datepicker-visible");
            }
            proxy.el.buttons.off();
            proxy.el.buttons.on("click", ".button-ok", function(event) {
                event.preventDefault();
                if ($(input).is("[type=date]")) {
                    $(input).val(proxy.date.getDateParts().year + "-" + (proxy.date.getDateParts().month + 1).pad(2) + "-" + proxy.date.getDateParts().day.pad(2)).change();
                } else if (settings.format) {
                    $(input).val(moment(proxy.date).format(settings.format)).change();
                } else if (settings.timepicker) {
                    $(input).val(proxy.date.toLocaleString()).change();
                } else {
                    $(input).val(proxy.date.toLocaleDateString()).change();
                }
                proxy[proxy.set].date = proxy.date;
                input.date = proxy.date;
                hide(input);
            });
            proxy.el.buttons.on("click", ".button-delete", function(event) {
                event.preventDefault();
                input.date = undefined;
                $(input).val("").change();
                hide(input);
            });
            proxy.el.buttons.children(".button-delete").toggleClass("disabled", input.value == "");
            proxy.el.buttons.on("click", ".button-cancel", function(event) {
                event.preventDefault();
                hide(input);
            });
            var doit;
            $(window).on("resize.id" + proxy.id_number, function(event) {
                clearTimeout(doit);
                pos = locate(input);
                proxy.css({
                    top: pos.top,
                    left: pos.left,
                    "transform-origin": pos.transform_origin,
                    "-webkit-transform-origin": pos.transform_origin
                }).removeClass("animate");
                doit = setTimeout(function() {
                    proxy.addClass("animate");
                }, 100);
            });
            $(window).on("scroll.id" + proxy.id_number, function(event) {
                clearTimeout(doit);
                pos = locate(input);
                proxy.css({
                    top: pos.top,
                    left: pos.left,
                    "transform-origin": pos.transform_origin,
                    "-webkit-transform-origin": pos.transform_origin
                }).removeClass("animate");
                doit = setTimeout(function() {
                    proxy.addClass("animate");
                }, 100);
            });
        };
        var hide = function(input) {
            $(input).removeClass("focused");
            proxy.removeClass("clockpicker md-datepicker-visible animate");
            proxy.el.buttons.off();
            $(window).off("resize.id" + proxy.id_number);
            $(window).off("scroll.id" + proxy.id_number);
            proxy.on(transitionend, function(event) {
                event.preventDefault();
                proxy.addClass("invisible");
                proxy.off(transitionend);
            });
        };
        var update_view = function() {
            if (validRange()) {
                var select = proxy.set == "start" ? "end" : "start";
                var elem = proxy.el.select_year.find("span:matches(" + proxy[select].date.getDateParts().year + ")");
                if (proxy.start.date && proxy.start.date.getDateParts().year <= proxy.date.getDateParts().year && select == "start" || proxy.end.date && proxy.end.date.getDateParts().year >= proxy.date.getDateParts().year && select == "end") {
                    $(proxy.el.prev_next_btns[proxy.set == "start" | 0]).toggleClass("disabled", proxy.date.getDateParts().year == proxy[select].date.getDateParts().year && proxy[select].date.getDateParts().month == proxy.date.getDateParts().month);
                    if (proxy.date.getDateParts().year == proxy[select].date.getDateParts().year) {
                        elem.push(proxy.el.select_month.find("span[data-month=" + proxy[select].date.getDateParts().month + "]")[0]);
                    }
                    proxy.find(".md-select-wrap>span").removeClass("disabled");
                    if (proxy.set == "end") {
                        $(elem[1]).prevAll().addClass("disabled");
                        $(elem[0]).nextAll().addClass("disabled");
                    } else {
                        $(elem[0]).prevAll().addClass("disabled");
                        $(elem[1]).nextAll().addClass("disabled");
                    }
                }
            } else {
                proxy.find(".md-select-wrap>span").removeClass("disabled");
            }
            proxy.el.months.text(proxy.date.loc(settings.language, {
                month: "long"
            }));
            proxy.el.years.text(proxy.date.getDateParts().year);
            proxy.el.days.text(proxy.date.getDateParts().day);
            proxy.el.weekday.text(proxy.date.loc(settings.language, {
                weekday: "short"
            }).replace(".", ""));
            if (settings.timepicker) {
                proxy.removeClass("minute");
                proxy.currentView = "hours";
                proxy.toggleClass("pm", proxy.date.getDateParts().hours >= 12);
                proxy.el.hour.text(proxy.date.getDateParts().hours.pad(2));
                proxy.el.minute.text(proxy.date.getDateParts().minutes.pad(2));
                var radian = proxy.date.getDateParts().hours * (Math.PI / 6), radian2 = proxy.date.getDateParts().minutes * (Math.PI / 30), x = Math.sin(radian) * radius, y = -Math.cos(radian) * radius;
                proxy.el.svg.lastRot = radian2 * (180 / Math.PI);
                proxy.el.svg.currentRot = radian * (180 / Math.PI);
                setHand(x, y);
            }
        };
        var timepicker_change = function(event) {
            var isHour = !$(event.target).is(".md-hour");
            proxy.el.svg.lastRot = proxy.el.svg.currentRot;
            proxy.currentView = isHour ? "minutes" : "hours";
            var radian = (isHour ? proxy.el.minute.text() : proxy.el.hour.text()) * (Math.PI / (proxy.currentView === "hours" ? 6 : 30)), x = Math.sin(radian) * radius, y = -Math.cos(radian) * radius;
            if (!cssua.ua.ie) proxy.el.svg.classList.add("animate");
            $(proxy.el.svg).on(transitionend, function(event) {
                $(proxy.el.svg).off();
                if (!cssua.ua.ie) proxy.el.svg.classList.remove("animate");
            });
            proxy.toggleClass("minute", isHour);
            setHand(x, y);
        };
        var show_select = function(view) {
            var elem = view == "year" ? proxy.el.select_year.find("span:matches(" + proxy.date.getDateParts().year + ")") : proxy.el.select_month.find("span[data-month=" + proxy.date.getDateParts().month + "]");
            if (!elem.length) {
                var run = proxy.date.getDateParts().year - Number(proxy.el.select_year.children(":first-child").text());
                for (var i = 1, lastyear = Number(proxy.el.select_year.children(":first-child").text()); i <= run; i++) {
                    proxy.el.select_year.prepend("<span>" + (lastyear + i) + "</span>");
                }
                elem = proxy.el.select_year.find("span:matches(" + proxy.date.getDateParts().year + ")");
            }
            var offset = elem.position().top;
            proxy.el["select_" + view].children("span").removeClass("md-currentdate");
            if (view == "year") proxy.el.select_year.find("span:matches(" + proxy.date.getDateParts().year + ")").addClass("md-currentdate"); else proxy.el.select_month.find("span[data-month=" + proxy.date.getDateParts().month + "]").addClass("md-currentdate");
            if (!proxy.el["select_" + view].hasClass("inview")) proxy.el["select_" + view].addClass("inview animate");
            proxy.el["select_" + view].stop().animate({
                scrollTop: offset + proxy.el["select_" + view][0].scrollTop - (proxy.el["select_" + view][0].clientHeight - 48) / 2
            }, parseInt(Math.abs(offset.remap(0, 2e3, 500, 3e3))), "easeInOutExpo");
            proxy.el["select_" + view].on(transitionend, function() {
                proxy.el["select_" + view].removeClass("animate");
            });
            proxy.el["select_" + view].on("mousewheel", function(event) {
                proxy.el["select_" + view].stop();
            });
        };
        var changeMonth = function(direction) {
            var animate = proxy.range ? direction == "next" ? proxy.set == "start" && proxy.date.getDateParts().month < proxy.end.date.getDateParts().month || proxy.set == "start" && proxy.date.getDateParts().year != proxy.end.date.getDateParts().year || proxy.set == "end" : proxy.set == "end" && proxy.date.getDateParts().month > proxy.start.date.getDateParts().month || proxy.set == "end" && proxy.date.getDateParts().year != proxy.start.date.getDateParts().year || proxy.set == "start" : true;
            var select = proxy.set == "start" ? "end" : "start";
            if (animate) {
                proxy.el.prev_next_btns.off("click");
                proxy.el.month_wrap.addClass("animate " + direction);
                if (direction == "next") {
                    proxy.date.setMonth(proxy.date.getDateParts().month + 1);
                } else {
                    proxy.date.setMonth(proxy.date.getDateParts().month - 1);
                }
                if (proxy.range && proxy.set == "start" && proxy.end.date <= proxy.date || proxy.range && proxy.set == "end" && proxy.start.date >= proxy.date) {
                    proxy.date = new Date(proxy[select].date);
                    updateMonthviews();
                }
                update_view();
                proxy.el.month_wrap.on(transitionend, function() {
                    proxy.el.current.html(proxy.el[direction].html());
                    proxy.el.month_wrap.removeClass("animate " + direction);
                    createMonthview("next");
                    createMonthview("previous");
                    proxy.el.month_wrap.off(transitionend);
                    proxy.el.prev_next_btns.on("click", prev_next);
                });
            }
        };
        var updateMonthviews = function() {
            var view = [ "next", "previous" ];
            for (var i = view.length - 1; i >= 0; i--) {
                proxy.el[view[i]].find(".md-selecteddate").removeClass("md-selecteddate");
                proxy.el[view[i]].find("span:matches(" + proxy.date.getDateParts().day + ")").addClass("md-selecteddate");
            }
        };
        function validRange() {
            if (proxy.start && proxy.end) {
                return proxy.date != undefined && proxy[proxy.set == "start" ? "end" : "start"].date != undefined;
            } else return false;
        }
        var createMonthview = function(view) {
            var month = proxy.date.getDateParts().month, tempdate = new Date(proxy.date), startday, days = "", classes;
            if (view == "previous") {
                tempdate.setMonth(month - 1);
            } else if (view == "next") {
                tempdate.setMonth(month + 1);
            }
            startday = weekdaynumber[startDay(tempdate)];
            var dim = daysInMonth(tempdate);
            for (var i = settings.startday; i < startday + settings.startday; i++) {
                days += "<span></span>";
            }
            var isSameYearMonth = today.getDateParts().month == tempdate.getDateParts().month && today.getDateParts().year == tempdate.getDateParts().year, setting = proxy.set == "start" ? "end" : "start";
            if (proxy.range) var isSameStartEnd = tempdate.getDateParts().month == proxy[setting].date.getDateParts().month && tempdate.getDateParts().year == proxy[setting].date.getDateParts().year;
            for (var i = 1; i <= dim; i++) {
                classes = [];
                if (proxy.date.getDateParts().day == i) classes.push("md-selecteddate");
                if (today.getDateParts().day == i && isSameYearMonth) classes.push("md-currentdate");
                if (proxy.range && proxy.set == "start" && i > proxy.end.date.getDateParts().day && isSameStartEnd || proxy.range && proxy.set == "end" && i < proxy.start.date.getDateParts().day && isSameStartEnd) classes.push("disabled");
                days += "<span" + (classes.length >= 1 ? ' class="' + classes.join(" ") + '"' : "") + " >" + i + "</span>";
            }
            proxy.el[view].find(".md-month-display").text(tempdate.loc(settings.language, {
                month: "long"
            }));
            proxy.el[view].find(".md-year-display").text(tempdate.getDateParts().year);
            proxy.el[view].find(".md-week").html(days);
        };
        function prev_next() {
            changeMonth(this.className.split(" ")[0].split("-")[1]);
        }
        var proxy = $($(template).appendTo("body")[0]);
        proxy.el = {};
        proxy.id_number = id;
        if (settings.timepicker) {
            var canvas = proxy.find(".md-clock");
            svg = $(svg).appendTo(canvas)[0];
            $.extend(proxy, {
                fg: cssua.ua.ie ? $(svg).find('[class="lolliclock-canvas-fg"]')[0] : $(svg).find(".lolliclock-canvas-fg")[0],
                canvas: canvas,
                ticks: {}
            });
            proxy.el.svg = svg;
            proxy.el.svg.currentRot = 0;
            proxy.ticks.minutes = proxy.canvas.find(".md-minutes>div");
            proxy.ticks.hours = proxy.canvas.find(".md-hours>div");
            proxy.el.hour = proxy.find(".md-hour");
            proxy.el.minute = proxy.find(".md-minute");
            proxy.el.ampm = proxy.find(".md-ampm-toggle");
            proxy.currentView = "hours";
            canvas.on(mousedownEvent, mousedown);
        }
        proxy.el.years = proxy.find(".year");
        proxy.el.months = proxy.find(".month");
        proxy.el.days = proxy.find(".day");
        proxy.el.buttons = proxy.find(".md-buttons");
        proxy.el.weekday = proxy.find(".weekday");
        proxy.el.month_wrap = proxy.find(".md-months");
        proxy.el.current = proxy.find(".md-current-month");
        proxy.el.next = proxy.find(".md-next-month");
        proxy.el.prev_next_btns = proxy.find(".md-next").add(proxy.find(".md-previous"));
        proxy.el.select_month = proxy.find(".month-select");
        proxy.el.select_year = proxy.find(".year-select");
        proxy.el.previous = proxy.find(".md-previous-month");
        proxy.el.prev_next_btns.on("click", prev_next);
        proxy.on("click", ".month-select>span, .year-select>span", function(event) {
            if ($(this).data("month") === undefined) {
                proxy.date.setYear($(this).text());
                proxy.el["select_year"].off();
            } else {
                proxy.date.setMonth($(this).data("month"));
                proxy.el["select_month"].off();
            }
            if (proxy.range) {
                if (proxy.set == "start" && proxy.end.date <= proxy.date || proxy.set == "end" && proxy.start.date >= proxy.date) {
                    var select = proxy.set == "start" ? "end" : "start";
                    proxy.date = new Date(proxy[select].date);
                }
            }
            update_view();
            createMonthview("current");
            $(this).parents(".md-select-wrap").addClass("animate").removeClass("inview").off(transitionend);
            createMonthview("previous");
            createMonthview("next");
        });
        proxy.el.months.on("click", function(event) {
            show_select("month");
        });
        proxy.el.years.on("click", function(event) {
            show_select("year");
        });
        proxy.on("click", ".md-week span", function(event) {
            proxy.el.month_wrap.find(".md-selecteddate").removeClass("md-selecteddate");
            proxy.el.month_wrap.find("span:matches(" + $(this).text() + ")").addClass("md-selecteddate");
            proxy.date.setDate($(this).text());
            update_view();
        });
        proxy.on("click", ".md-toggle-state", function(event) {
            proxy.toggleClass("clockpicker", !proxy.hasClass("clockpicker"));
        });
        proxy.on("click", ".md-minute, .md-hour", function(event) {
            timepicker_change(event);
        });
        proxy.on("click", ".md-pm, .md-am", function() {
            toggleAM();
        });
        function toggleAM() {
            proxy.toggleClass("pm", !proxy.hasClass("pm"));
            var value = parseInt(proxy.el.hour.text());
            value = proxy.hasClass("pm") ? value + 12 == 24 ? 12 : value + 12 : value == 0 ? 0 : value - 12;
            proxy.el.hour.text(value.pad(2));
            proxy.date.setHours(value.pad(2));
        }
        var that = this, container = [];
        return this.each(function() {
            this.initilized = true;
            $(this).on("focus", function(event) {
                event.preventDefault();
                $(container).removeClass("focused");
                $(event.target).addClass("focused");
                that.show(event.target);
            });
            container.push(this);
            if ($(this).is("[data-md-start]")) proxy.start = this;
            if ($(this).is("[data-md-end]")) proxy.end = this;
        }).promise().done(function() {
            proxy.state = "ready";
            if (container.length > 2 && proxy.start) {
                throw new Error("Only one start and one end Date is allowed");
            }
            proxy.container = container;
            console.log(moment.duration(moment() - start1));
        });
    };
    $.fn.hasScrollBarY = function(options) {
        var innerWidth = this.innerWidth();
        var clientWidth = this[0].clientWidth;
        if (innerWidth == clientWidth) {
            return false;
        }
        return true;
    };
})(jQuery, window, document);

function daysInMonth(date) {
    return new Date(date.getDateParts().year, date.getDateParts().month + 1, 0).getDateParts().day;
}

function startDay(date) {
    return new Date(date.getDateParts().year, date.getDateParts().month, 1).getDateParts().weekday;
}

Number.prototype.remap = function(low1, high1, low2, high2) {
    return low2 + (this - low1) * (high2 - low2) / (high1 - low1);
};

Date.prototype.getDateParts = function() {
    return {
        year: this.getFullYear(),
        month: this.getMonth(),
        hours: this.getHours(),
        minutes: this.getMinutes(),
        day: this.getDate(),
        weekday: this.getDay()
    };
};

Date.prototype.loc = function(lang, options) {
    if (toLocaleStringSupports()) {
        return this.toLocaleString(lang, options);
    } else {
        return locale[lang.split("-")[0]][Object.keys(options)[0]][this.getDateParts()[Object.keys(options)]];
    }
};

Element.prototype.setProperties = function(props) {
    "use strict";
    for (var prop in props) {
        if (props.hasOwnProperty(prop)) {
            if (!(this instanceof SVGElement)) {
                this[prop] = props[prop];
            }
            if (this[prop] != props[prop]) this.setAttribute(prop, props[prop]);
        }
    }
    return this;
};

Number.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};

String.prototype.pad = function(size) {
    var s = String(this);
    while (s.length < (size || 2)) {
        s = "0" + s;
    }
    return s;
};

$.expr[":"].matches = $.expr.createPseudo(function(arg) {
    return function(elem) {
        return $(elem).text().match("^" + arg + "$");
    };
});

function toLocaleStringSupports() {
    try {
        new Date().toLocaleString("i");
    } catch (e) {
        return e.name === "RangeError";
    }
    return false;
}


