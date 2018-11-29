function createCookie(n, t, i) {
    var r, u;
    i ? (r = new Date, r.setTime(r.getTime() + i * 864e5), u = ";expires=" + r.toGMTString()) : u = "";
    document.cookie = n + "=" + t + u + ";path=/"
}


function readCookie(n) {
    for (var t, r = n + "=", u = document.cookie.split(";"), i = 0;
         i < u.length;
         i++) {
        for (t = u[i];
             t.charAt(0) == " ";
        ) t = t.substring(1, t.length);
        if (t.indexOf(r) == 0) return t.substring(r.length, t.length)
    }
    return null
}


function isArray(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

var currentColor;
function getCurrentColor() {
    var colorList = {
        'azure': '#2dc3e8', 'black': '#474544', 'blue': '#5db2ff',
        'darkblue': '#0072c6', 'darkred': '#ac193d', 'deepblue': '#001940',
        'gray': '#585858', 'green': '#53a93f', 'orange': '#ff8f32',
        'pink': '#cc324b', 'purple': '#8c0095', 'teal': '#03b3b2'
    };
    if (readCookie('current-skin'))
        return colorList[readCookie('current-skin').replace('assets/css/skins/', '').replace('.min.css', '')];
    else {
        createCookie('current-skin', "assets/css/skins/darkblue.min.css");
        return colorList[readCookie('current-skin').replace('assets/css/skins/', '').replace('.min.css', '')];
    }
    return colorList.darkblue;
}

(function () {
    currentColor = getCurrentColor();
})();


/**
 * jQuery JSON Plugin
 * version: 2.3 (2011-09-17)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is
 * copyrighted 2005 by Bob Ippolito.
 */
(function ($) {
    var escapeable = /["\\\x00-\x1f\x7f-\x9f]/g,
        meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };

    /**
     * jQuery.toJSON
     * Converts the given argument into a JSON respresentation.
     *
     * @param o {Mixed} The json-serializble *thing* to be converted
     *
     * If an object has a toJSON prototype, that will be used to get the representation.
     * Non-integer/string keys are skipped in the object, as are keys that point to a
     * function.
     *
     */
    $.toJSON = typeof JSON === 'object' && JSON.stringify
        ? JSON.stringify
        : function (o) {

        if (o === null) {
            return 'null';
        }

        var type = typeof o;

        if (type === 'undefined') {
            return undefined;
        }
        if (type === 'number' || type === 'boolean') {
            return '' + o;
        }
        if (type === 'string') {
            return $.quoteString(o);
        }
        if (type === 'object') {
            if (typeof o.toJSON === 'function') {
                return $.toJSON(o.toJSON());
            }
            if (o.constructor === Date) {
                var month = o.getUTCMonth() + 1,
                    day = o.getUTCDate(),
                    year = o.getUTCFullYear(),
                    hours = o.getUTCHours(),
                    minutes = o.getUTCMinutes(),
                    seconds = o.getUTCSeconds(),
                    milli = o.getUTCMilliseconds();

                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }
                if (hours < 10) {
                    hours = '0' + hours;
                }
                if (minutes < 10) {
                    minutes = '0' + minutes;
                }
                if (seconds < 10) {
                    seconds = '0' + seconds;
                }
                if (milli < 100) {
                    milli = '0' + milli;
                }
                if (milli < 10) {
                    milli = '0' + milli;
                }
                return '"' + year + '-' + month + '-' + day + 'T' +
                    hours + ':' + minutes + ':' + seconds +
                    '.' + milli + 'Z"';
            }
            if (o.constructor === Array) {
                var ret = [];
                for (var i = 0; i < o.length; i++) {
                    ret.push($.toJSON(o[i]) || 'null');
                }
                return '[' + ret.join(',') + ']';
            }
            var name,
                val,
                pairs = [];
            for (var k in o) {
                type = typeof k;
                if (type === 'number') {
                    name = '"' + k + '"';
                } else if (type === 'string') {
                    name = $.quoteString(k);
                } else {
                    // Keys must be numerical or string. Skip others
                    continue;
                }
                type = typeof o[k];

                if (type === 'function' || type === 'undefined') {
                    // Invalid values like these return undefined
                    // from toJSON, however those object members
                    // shouldn't be included in the JSON string at all.
                    continue;
                }
                val = $.toJSON(o[k]);
                pairs.push(name + ':' + val);
            }
            return '{' + pairs.join(',') + '}';
        }
    };

    /**
     * jQuery.evalJSON
     * Evaluates a given piece of json source.
     *
     * @param src {String}
     */
    $.evalJSON = typeof JSON === 'object' && JSON.parse
        ? JSON.parse
        : function (src) {
        return eval('(' + src + ')');
    };

    /**
     * jQuery.secureEvalJSON
     * Evals JSON in a way that is *more* secure.
     *
     * @param src {String}
     */
    $.secureEvalJSON = typeof JSON === 'object' && JSON.parse
        ? JSON.parse
        : function (src) {

        var filtered =
            src
                .replace(/\\["\\\/bfnrtu]/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, '');

        if (/^[\],:{}\s]*$/.test(filtered)) {
            return eval('(' + src + ')');
        } else {
            throw new SyntaxError('Error parsing JSON, source is not valid.');
        }
    };

    /**
     * jQuery.quoteString
     * Returns a string-repr of a string, escaping quotes intelligently.
     * Mostly a support function for toJSON.
     * Examples:
     * >>> jQuery.quoteString('apple')
     * "apple"
     *
     * >>> jQuery.quoteString('"Where are we going?", she asked.')
     * "\"Where are we going?\", she asked."
     */
    $.quoteString = function (string) {
        if (string.match(escapeable)) {
            return '"' + string.replace(escapeable, function (a) {
                    var c = meta[a];
                    if (typeof c === 'string') {
                        return c;
                    }
                    c = a.charCodeAt();
                    return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                }) + '"';
        }
        return '"' + string + '"';
    };

})(jQuery);

(function ($, undefined) {
    var tag2attr = {
            a: 'href',
            img: 'src',
            form: 'action',
            base: 'href',
            script: 'src',
            iframe: 'src',
            link: 'href'
        },

        key = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"], // keys available to query

        aliases = {"anchor": "fragment"}, // aliases for backwards compatability

        parser = {
            strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, //less intuitive, more accurate to the specs
            loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
        },

        querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g, // supports both ampersand and semicolon-delimted query string key/value pairs

        fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g; // supports both ampersand and semicolon-delimted fragment key/value pairs

    function parseUri(url, strictMode) {
        var str = decodeURI(url),
            res = parser[strictMode || false ? "strict" : "loose"].exec(str),
            uri = {attr: {}, param: {}, seg: {}},
            i = 14;

        while (i--) {
            uri.attr[key[i]] = res[i] || "";
        }

        // build query and fragment parameters

        uri.param['query'] = {};
        uri.param['fragment'] = {};

        uri.attr['query'].replace(querystring_parser, function ($0, $1, $2) {
            if ($1) {
                uri.param['query'][$1] = $2;
            }
        });

        uri.attr['fragment'].replace(fragment_parser, function ($0, $1, $2) {
            if ($1) {
                uri.param['fragment'][$1] = $2;
            }
        });

        // split path and fragement into segments

        uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g, '').split('/');

        uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g, '').split('/');

        // compile a 'base' domain attribute

        uri.attr['base'] = uri.attr.host ? uri.attr.protocol + "://" + uri.attr.host + (uri.attr.port ? ":" + uri.attr.port : '') : '';

        return uri;
    }
    function getAttrName(elm) {
        var tn = elm.tagName;
        if (tn !== undefined) return tag2attr[tn.toLowerCase()];
        return tn;
    }

    $.fn.url = function (strictMode) {
        var url = '';

        if (this.length) {
            url = $(this).attr(getAttrName(this[0])) || '';
        }

        return $.url(url, strictMode);
    };

    $.url = function (url, strictMode) {
        if (arguments.length === 1 && url === true) {
            strictMode = true;
            url = undefined;
        }

        strictMode = strictMode || false;
        url = url || window.location.toString();

        return {

            data: parseUri(url, strictMode),

            // get various attributes from the URI
            attr: function (attr) {
                attr = aliases[attr] || attr;
                return attr !== undefined ? this.data.attr[attr] : this.data.attr;
            },

            // return query string parameters
            param: function (param) {
                return param !== undefined ? this.data.param.query[param] : this.data.param.query;
            },

            // return fragment parameters
            fparam: function (param) {
                return param !== undefined ? this.data.param.fragment[param] : this.data.param.fragment;
            },

            // return path segments
            segment: function (seg) {
                if (seg === undefined) {
                    return this.data.seg.path;
                }
                else {
                    seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.path[seg];
                }
            },

            // return fragment segments
            fsegment: function (seg) {
                if (seg === undefined) {
                    return this.data.seg.fragment;
                }
                else {
                    seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
                    return this.data.seg.fragment[seg];
                }
            }

        };

    };

})(jQuery);
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var pluses = /\+/g;

    function encode(s) {
        return config.raw ? s : encodeURIComponent(s);
    }

    function decode(s) {
        return config.raw ? s : decodeURIComponent(s);
    }

    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value));
    }

    function parseCookieValue(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape...
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }

        try {
            // Replace server-side written pluses with spaces.
            // If we can't decode the cookie, ignore it, it's unusable.
            // If we can't parse the cookie, ignore it, it's unusable.
            s = decodeURIComponent(s.replace(pluses, ' '));
            return config.json ? JSON.parse(s) : s;
        } catch (e) {
        }
    }

    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value;
    }

    var config = $.cookie = function (key, value, options) {

        // Write

        if (value !== undefined && !$.isFunction(value)) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setTime(+t + days * 864e+5);
            }

            return (document.cookie = [
                encode(key), '=', stringifyCookieValue(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : ';path=/',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // Read

        var result = key ? undefined : {};

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all. Also prevents odd result when
        // calling $.cookie().
        var cookies = document.cookie ? document.cookie.split('; ') : [];

        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = parts.join('=');

            if (key && key === name) {
                // If second argument (value) is a function it's a converter...
                result = read(cookie, value);
                break;
            }

            // Prevent storing a cookie that we couldn't decode.
            if (!key && (cookie = read(cookie)) !== undefined) {
                result[name] = cookie;
            }
        }

        return result;
    };

    config.defaults = {};

    $.removeCookie = function (key, options) {
        if ($.cookie(key) === undefined) {
            return false;
        }

        // Must not alter options, thus extending a fresh object...
        $.cookie(key, '', $.extend({}, options, {expires: -1}));
        return !$.cookie(key);
    };

}));

/**
 * 服务访问
 */
jQuery.extend({

    request: function (url, data, success, error) {
        return jQuery.ajax({
            url: url + "?token=" + $.cookie('jeesite_token'),
            type: 'post',
            dataType: 'json',
            contentType: "application/json; charset=utf-8",

            data: $.toJSON(data),
            success: function (result) {
                if (success) {
                    success(result);
                }
            },
            error: function (result) {
                if (result.status == 600) {
                    alert(result.responseText)
                } else if (result.status == 604) {
                    alert(result.responseText);
                    window.parent.location.href = '/login.html';
                } else if (result.status == 602) {
                    alert(result.responseText)
                }
                if (error) {
                    error(result);
                }
            }
        });
    },
    getobject: function (formid) {
        var object = {};
        //#region text,password,hidden,textarea,select 已实现
        $("#" + formid + " input[type='number'], #" + formid + " input[type='date'], #" + formid + " input[type='text'], #" + formid + " input[type='password'], #" + formid + " input[type='hidden'], #" + formid + " textarea, #" + formid + " select").each(function (i, e) {
            var $e = $(e);
            if ($e.val() != null && $e.val() != undefined && $e.attr("id").length > 0 && $e.attr("id") != "__VIEWSTATE" && $e.attr("id").indexOf("xhe") != 0) {
                object[$e.attr("id")] = $e.val();
            }
        });
        //#endregion

        //#region radio  已实现
        var radios = [];
        $("#" + formid + " input[type='radio']").each(function (i, e) {
            if ($.inArray(e.name, radios) == -1) {
                radios.push(e.name);
            }
        });
        $.each(radios, function (i, e) {
            $("#" + formid + " input[name='" + e + "']").each(function (i, e) {
                if (e.checked) {
                    object[e.name] = $(e).val();
                    return false;
                }
            });
        });
        return object;
    },

    upload: function (data, success, error) {
        return jQuery.ajax({
            //url: '/com/upload/do?token=' + $.cookie('jeesite_token'),
            url: '/a/sys/file/upload' + $.cookie('jeesite_token'),
            type: 'POST',
            enctype: "multipart/form-data",
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            data:data,
            success: function (result) {
                if (success) {
                    success(result);
                }
            },
            error: function (result) {
                if (result.status == 600) {
                    alert(result.responseText)
                } else if (result.status == 604) {
                    alert(result.responseText)
                    window.parent.location.href = '/login.html';
                } else if (result.status == 602) {
                    alert(result.responseText)
                } else if (result.status == 605) {
                    alert(result.responseText)
                }
                if (error) {
                    error(result);
                }
            }
        });
    },

    setobject: function (data, scope, win) {
        $.each(data, function (id, value) {
            var control;
            if (scope) {
                if (win) {
                    control = $("#" + scope + " #" + id, win);
                } else {
                    control = $("#" + scope + " #" + id);
                }
            } else {
                if (win) {
                    control = $("#" + id, win);
                } else {
                    control = $("#" + id);
                }

            }

            if (control.is("input[type='mumber']") || control.is("input[type='date']") || control.is("input[type='text']") || control.is("label") || control.is("input[type='password']") || control.is("input[type='hidden']")) {
                if (control.attr('data-date-format')) {
                    value = new Date(value).format(control.attr('data-date-format'));
                }
                if (control.is("label")) {
                    if (value != null) {
                        control.text(value);
                    }
                    else {
                        control.text('');
                    }
                }
                else
                    control.val(value);
            }
            else if (control.is('textarea')) {
                control.val(value);
            }
            else if (control.is("input[type='radio']")) {
                $('input[name=' + id + '][value=' + value + ']', win).attr("checked", true);
            }
            else if (control.is("input[type='number']")) {
                control.val(value);
            }
            else if (control.is('select')) {
                $('select[name=' + id + ']', win).val(value);
            } else if (control.is('input[type=date]')) {
                $('input[name=' + id + ']', win).val( value);
            }
        });
    }
});


Date.prototype.format = function (format) {
    var o = {
        "m+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "i+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "/S": this.getMilliseconds() //millisecond
    };
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
};

var Namespace = {};

Namespace.register = function (fullNS) {
    if (this.Ns == undefined)
        this.Ns = [];
    this.Ns[this.Ns.length] = fullNS;
    var nsArray = fullNS.split('.');
    var sEval = "";
    var sNS = "";
    for (var i = 0; i < nsArray.length; i++) {
        if (i != 0) sNS += ".";
        sNS += nsArray[i];
        sEval += "if (typeof(" + sNS + ") == 'undefined') " + sNS + " = new Object();"
    }
    if (sEval != "") eval(sEval);
};
var Guid = {
    NewGuid: function () {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    Empty: function () {
        return "00000000-0000-0000-0000-000000000000";
    }
};
$.format = function (source, params) {
    if (arguments.length == 1)
        return function () {
            var args = $.makeArray(arguments);
            args.unshift(source);
            return $.format.apply(this, args);
        };
    if (arguments.length > 2 && params.constructor != Array) {
        params = $.makeArray(arguments).slice(1);
    }
    if (params.constructor != Array) {
        params = [params];
    }
    $.each(params, function (i, n) {
        source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
    });
    return source;
};
