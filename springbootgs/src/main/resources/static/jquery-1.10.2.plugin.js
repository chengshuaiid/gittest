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
    } return null
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
    return colorList.darkblue;
}

(function () {
    currentColor = getCurrentColor();
})();


var gridMap = [], controlMap = [], messageMap = [], resultData = [];
var ajaxTime = 0;
(function () {
    if (parent.messageMap)
        messageMap = parent.messageMap;
})();

function finishajax() {
    --ajaxTime;
    if (ajaxTime == 0) {
        if (parent.endloading) parent.endloading();
    }

}
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

   aliases = { "anchor": "fragment" }, // aliases for backwards compatability

   parser = {
       strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, //less intuitive, more accurate to the specs
       loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
   },

   querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g, // supports both ampersand and semicolon-delimted query string key/value pairs

   fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g; // supports both ampersand and semicolon-delimted fragment key/value pairs

    function parseUri(url, strictMode) {
        var str = decodeURI(url),
        res = parser[strictMode || false ? "strict" : "loose"].exec(str),
        uri = { attr: {}, param: {}, seg: {} },
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
        } catch (e) { }
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
        $.cookie(key, '', $.extend({}, options, { expires: -1 }));
        return !$.cookie(key);
    };

}));

/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/
/* http://github.com/mindmup/bootstrap-wysiwyg */
/*global jQuery, $, FileReader*/
/*jslint browser:true*/
(function ($) {
    'use strict';
    var readFileIntoDataUrl = function (fileInfo) {
        var loader = $.Deferred(),
			fReader = new FileReader();
        fReader.onload = function (e) {
            loader.resolve(e.target.result);
        };
        fReader.onerror = loader.reject;
        fReader.onprogress = loader.notify;
        fReader.readAsDataURL(fileInfo);
        return loader.promise();
    };
    $.fn.cleanHtml = function () {
        var html = $(this).html();
        return html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '');
    };
    $.fn.wysiwyg = function (userOptions) {
        var editor = this,
			selectedRange,
			options,
			toolbarBtnSelector,
			updateToolbar = function () {
			    if (options.activeToolbarClass) {
			        $(options.toolbarSelector).find(toolbarBtnSelector).each(function () {
			            var command = $(this).data(options.commandRole);
			            if (document.queryCommandState(command)) {
			                $(this).addClass(options.activeToolbarClass);
			            } else {
			                $(this).removeClass(options.activeToolbarClass);
			            }
			        });
			    }
			},
			execCommand = function (commandWithArgs, valueArg) {
			    var commandArr = commandWithArgs.split(' '),
					command = commandArr.shift(),
					args = commandArr.join(' ') + (valueArg || '');
			    document.execCommand(command, 0, args);
			    updateToolbar();
			},
			bindHotkeys = function (hotKeys) {
			    $.each(hotKeys, function (hotkey, command) {
			        editor.keydown(hotkey, function (e) {
			            if (editor.attr('contenteditable') && editor.is(':visible')) {
			                e.preventDefault();
			                e.stopPropagation();
			                execCommand(command);
			            }
			        }).keyup(hotkey, function (e) {
			            if (editor.attr('contenteditable') && editor.is(':visible')) {
			                e.preventDefault();
			                e.stopPropagation();
			            }
			        });
			    });
			},
			getCurrentRange = function () {
			    var sel = window.getSelection();
			    if (sel.getRangeAt && sel.rangeCount) {
			        return sel.getRangeAt(0);
			    }
			},
			saveSelection = function () {
			    selectedRange = getCurrentRange();
			},
			restoreSelection = function () {
			    var selection = window.getSelection();
			    if (selectedRange) {
			        try {
			            selection.removeAllRanges();
			        } catch (ex) {
			            document.body.createTextRange().select();
			            document.selection.empty();
			        }

			        selection.addRange(selectedRange);
			    }
			},
			insertFiles = function (files) {
			    editor.focus();
			    $.each(files, function (idx, fileInfo) {
			        if (/^image\//.test(fileInfo.type)) {
			            $.when(readFileIntoDataUrl(fileInfo)).done(function (dataUrl) {
			                execCommand('insertimage', dataUrl);
			            }).fail(function (e) {
			                options.fileUploadError("file-reader", e);
			            });
			        } else {
			            options.fileUploadError("unsupported-file-type", fileInfo.type);
			        }
			    });
			},
			markSelection = function (input, color) {
			    restoreSelection();
			    if (document.queryCommandSupported('hiliteColor')) {
			        document.execCommand('hiliteColor', 0, color || 'transparent');
			    }
			    saveSelection();
			    input.data(options.selectionMarker, color);
			},
			bindToolbar = function (toolbar, options) {
			    toolbar.find(toolbarBtnSelector).click(function () {
			        restoreSelection();
			        editor.focus();
			        execCommand($(this).data(options.commandRole));
			        saveSelection();
			    });
			    toolbar.find('[data-toggle=dropdown]').click(restoreSelection);

			    toolbar.find('input[type=text][data-' + options.commandRole + ']').on('webkitspeechchange change', function () {
			        var newValue = this.value; /* ugly but prevents fake double-calls due to selection restoration */
			        this.value = '';
			        restoreSelection();
			        if (newValue) {
			            editor.focus();
			            execCommand($(this).data(options.commandRole), newValue);
			        }
			        saveSelection();
			    }).on('focus', function () {
			        var input = $(this);
			        if (!input.data(options.selectionMarker)) {
			            markSelection(input, options.selectionColor);
			            input.focus();
			        }
			    }).on('blur', function () {
			        var input = $(this);
			        if (input.data(options.selectionMarker)) {
			            markSelection(input, false);
			        }
			    });
			    toolbar.find('input[type=file][data-' + options.commandRole + ']').change(function () {
			        restoreSelection();
			        if (this.type === 'file' && this.files && this.files.length > 0) {
			            insertFiles(this.files);
			        }
			        saveSelection();
			        this.value = '';
			    });
			},
			initFileDrops = function () {
			    editor.on('dragenter dragover', false)
					.on('drop', function (e) {
					    var dataTransfer = e.originalEvent.dataTransfer;
					    e.stopPropagation();
					    e.preventDefault();
					    if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
					        insertFiles(dataTransfer.files);
					    }
					});
			};
        options = $.extend({}, $.fn.wysiwyg.defaults, userOptions);
        toolbarBtnSelector = 'a[data-' + options.commandRole + '],button[data-' + options.commandRole + '],input[type=button][data-' + options.commandRole + ']';
        bindHotkeys(options.hotKeys);
        if (options.dragAndDropImages) {
            initFileDrops();
        }
        bindToolbar($(options.toolbarSelector), options);
        editor.attr('contenteditable', true)
			.on('mouseup keyup mouseout', function () {
			    saveSelection();
			    updateToolbar();
			});
        $(window).bind('touchend', function (e) {
            var isInside = (editor.is(e.target) || editor.has(e.target).length > 0),
				currentRange = getCurrentRange(),
				clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
            if (!clear || isInside) {
                saveSelection();
                updateToolbar();
            }
        });
        return this;
    };
    $.fn.wysiwyg.defaults = {
        hotKeys: {
            'ctrl+b meta+b': 'bold',
            'ctrl+i meta+i': 'italic',
            'ctrl+u meta+u': 'underline',
            'ctrl+z meta+z': 'undo',
            'ctrl+y meta+y meta+shift+z': 'redo',
            'ctrl+l meta+l': 'justifyleft',
            'ctrl+r meta+r': 'justifyright',
            'ctrl+e meta+e': 'justifycenter',
            'ctrl+j meta+j': 'justifyfull',
            'shift+tab': 'outdent',
            'tab': 'indent'
        },
        toolbarSelector: '[data-role=editor-toolbar]',
        commandRole: 'edit',
        activeToolbarClass: 'btn-info',
        selectionMarker: 'edit-focus-marker',
        selectionColor: 'darkgrey',
        dragAndDropImages: true,
        fileUploadError: function (reason, detail) { console.log("File upload error", reason, detail); }
    };
}(window.jQuery));

(function (jQuery) {

    jQuery.hotkeys = {
        version: "0.8",

        specialKeys: {
            8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
            20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
            96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
            104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111: "/",
            112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
            120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
        },

        shiftNums: {
            "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
            "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
            ".": ">", "/": "?", "\\": "|"
        }
    };

    function keyHandler(handleObj) {
        // Only care when a possible input has been specified
        if (typeof handleObj.data !== "string") {
            return;
        }

        var origHandler = handleObj.handler,
			keys = handleObj.data.toLowerCase().split(" "),
			textAcceptingInputTypes = ["text", "password", "number", "email", "url", "range", "date", "month", "week", "time", "datetime", "datetime-local", "search", "color"];

        handleObj.handler = function (event) {
            // Don't fire in text-accepting inputs that we didn't directly bind to
            if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) ||
				jQuery.inArray(event.target.type, textAcceptingInputTypes) > -1)) {
                return;
            }

            // Keypress represents characters, not special keys
            var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
				character = String.fromCharCode(event.which).toLowerCase(),
				key, modif = "", possible = {};

            // check combinations (alt|ctrl|shift+anything)
            if (event.altKey && special !== "alt") {
                modif += "alt+";
            }

            if (event.ctrlKey && special !== "ctrl") {
                modif += "ctrl+";
            }

            // TODO: Need to make sure this works consistently across platforms
            if (event.metaKey && !event.ctrlKey && special !== "meta") {
                modif += "meta+";
            }

            if (event.shiftKey && special !== "shift") {
                modif += "shift+";
            }

            if (special) {
                possible[modif + special] = true;

            } else {
                possible[modif + character] = true;
                possible[modif + jQuery.hotkeys.shiftNums[character]] = true;

                // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
                if (modif === "shift+") {
                    possible[jQuery.hotkeys.shiftNums[character]] = true;
                }
            }

            for (var i = 0, l = keys.length; i < l; i++) {
                if (possible[keys[i]]) {
                    return origHandler.apply(this, arguments);
                }
            }
        };
    }

    jQuery.each(["keydown", "keyup", "keypress"], function () {
        jQuery.event.special[this] = { add: keyHandler };
    });

})(jQuery);

/***属性扩展方法***柏林 2014/8/5 ****/
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
/***匿名函数***柏林 2014/8/26 ****/





jQuery.extend({

    request : function(url,data, success, error) {
        return jQuery.ajax({
            url : url,
            type : 'post',
            dataType : 'json',
            data : data,
            success : function(result) {
                if (success) {
                    success(result);
                }

            },
            error: function (result) {
                if (result.status == 600) {
                    alert(result.responseText)
                } else if (result.status == 604) {
                    alert(result.responseText);
                    window.parent.location.href = '/templates/login.html';
                } else if (result.status == 602) {
                    alert(result.responseText)
                }
                if (error) {
                    error(result);
                }
            }
            /*            error : function(result) {
                if(result.status==200){
                    window.parent.location.href='/login.html';
                    //  alert("您尚未登录系统，拒绝访问！")
                }
                if (error) {
                    error(result);
                }
             }*/
        });
    },

    //Ajax请求
    AjaxRequest: function (ActionCode, myData, handler, async, errorContinue) {

        if (errorContinue == undefined)
            errorContinue = false;

        ++ajaxTime;
        var me = this;
        me.ActionCode = ActionCode;
        var isstring = Object.prototype.toString.call(myData) === "[object String]";

        function initialData(actionCode, data) {
            var objData = { TokenGuid: $.token(), ActionCode: actionCode, Data: isstring ? data : $.toJSON(data) };
            var data = $.toJSON(objData);
            return data;
        }
        async = (async == undefined ? ((handler == undefined) ? false : true) : async);
        var reqdata = initialData(ActionCode, myData);
        var result = { success: false, data: {} };

        var dtd = $.ajax({
            type: "post",
            url: '/Handlers/Do.ashx',
            'async': async,
            dataType: "json",
            data: { RequestData: reqdata },
            success: function (data) {

                var data = me.getResponseData(data);

                if (data) {
                    if (data.success) {
                        result.success = true;
                        result.data = data.data;
                        if (handler) {
                            handler(data.data);
                        }
                    } else if (errorContinue) {
                        result.success = false;
                        handler(data);
                    }
                }

                finishajax();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                try {
                    result.success = false;
                    //未登陆
                    if ($.evalJSON(XMLHttpRequest.responseText.substring(0, XMLHttpRequest.responseText.indexOf("}") + 1)).Code == "Public.E_0006") {
                        window.location.href = "/templates/login.html";
                    }
                    else {
                        alert(errorThrown);
                    }
                    finishajax();

                } catch (e) {
                    alert(errorThrown);
                }

            }
        });
        return async ? dtd : result;
    },




    getResponseData: function (response) {
        var data, error;

        function getType(code) {
            //Public.I_0001
            if (code && code.length > 8)
                return code.substr(code.length - 6, 1);
            return null;
        }

        function getMessageString(stringKey) {
            Array.prototype.get = function (key) {
                for (i = 0; i < this.length; i++) {
                    if (this[i].resKey == key)
                        return this[i];
                }
                return null;
            };


            var me = this, map, resInfo;

            //获取系统公用多语
            if (stringKey.indexOf("Public.") == 0) {
                stringKey = "Public." + stringKey;
            }

            map = messageMap;

            if (map && map.length > 0) {
                resInfo = map.get(stringKey);
            }

            if (resInfo) {
                resInfo = "[" + resInfo.StringKeyDesc + "]";
            }

            return resInfo;
        }

        try {
            data = response;
            this.raw = data;
            var code = data.Code;
            var codeType = getType(code);
            this.message = data.Message || getMessageString(data.Code);//;

            if (codeType == "I") {
                this.success = true;
                var content;
                if (data.Data && data.Data.length > 0) {
                    try {
                        content = $.evalJSON(data.Data);

                    } catch (e) {
                        content = data.Data;
                    }
                }
                if (content === null || content === undefined) {
                    return {
                        total: 0,
                        count: 0,
                        records: [],
                        success: true,
                        message: this.message
                    };
                }

                return {
                    success: true,
                    data: content
                };
            } else if (codeType == "E") {

                if (code === "Public.E_0006") {
                    //alert(this.message)
                    window.parent.parent.location.href = "/templates/login.html";
                }
                else {
                    alert(this.message);
                    return {
                        success: false
                    };
                }
            } else {
                if (codeType == "V") {
                    //handle message
                    var msg = getMessageString(data.Code);
                    if (msg != null && msg != "") {
                        this.message = $.format(msg, data.Message)
                    }
                }
                alert(this.message);
                return {
                    total: 0,
                    count: 0,
                    records: [],
                    success: false,
                    message: this.message
                };
            }
        } catch (ex) {
            return ({
                total: 0,
                count: 0,
                records: [],
                success: false,
                message: ex.message
            });
        }
    },

    DateTime: function (time, format) {

        if (!format) format = "yyyy-MM-dd hh:mm:ss";
        if (time == null || time == "" || time.length == 0)
            return "";
        function formatdate(date, format) {
            var o = {

                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(), //day
                "h+": date.getHours(), //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "/S": date.getMilliseconds() //millisecond
            };
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;

        }

        function InitialDate(date) {
            try {
                date = date.replace('Z', '');

                var dateStr = date.split('T')[0];
                var timeStr = date.split('T')[1];
                var year = dateStr.split('-')[0];
                var month = dateStr.split('-')[1];
                var day = dateStr.split('-')[2];

                var hour = timeStr.split('.')[0].split(':')[0];
                var min = timeStr.split('.')[0].split(':')[1];
                var sec = timeStr.split('.')[0].split(':')[2];
                var misec = timeStr.split('.')[1];

                var ret = new Date();
                ret.setFullYear(year, month - 1, day);
                ret.setHours(hour, min, sec, misec || 0);
                return (ret);
            } catch (e) {
                return date;
            }

        }
        var mydate = InitialDate(time);
        return formatdate(mydate, format);
    },

    objserialize: function (action, data) {
        var post = {TokenGuid: $.token(), ActionCode: action, Data: $.toJSON(data)};
        return $.toJSON(post);
    },
    getobject: function (formid) {
        var object = {};
        //#region text,password,hidden,textarea,select 已实现
        $("#" + formid + " input[type='text'], #" + formid + " input[type='password'], #" + formid + " input[type='hidden'], #" + formid + " textarea, #" + formid + " select").each(function (i, e) {
            var $e = $(e);
            if ($e.val() != null && $e.val() != undefined && $e.attr("id") != undefined && $e.attr("id").length > 0 && $e.attr("id") != "__VIEWSTATE" && $e.attr("id").indexOf("xhe") != 0) {
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
                if (e.checked) { object[e.name] = $(e).val(); return false; }
            });
        });
        //#endregion

        //#region checkbox 需情景实现
        //#endregion
        return object;
    },
    setobject: function (data, scope) {
        $.each(data, function (id, value) {
            var control;
            if (scope) {
                control = $("#" + scope + " #" + id);
            } else {
                control = $("#" + id);
            }
            if (control.is("input[type='text']") || control.is("label") || control.is("input[type='password']") || control.is("input[type='hidden']")) {
                if (control.attr('data-date-format')) {
                    if (value != undefined && value != null && value != '')
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
                $("#input[name='" + id + "']").each(function (i, e) {
                    if (e.val() == value) { e.checked == true; return false; }
                })
            }
            else if (control.is("input[type='number']")) {
                control.val(value);
            }
            else if (control.is('select')) {
                control.val(value);
            }
        })
    },
    token: function () {
        var token = $.cookie('TokenGuid');
        if (token == undefined) { token = Guid.NewGuid() }
        return token;
    },
    username: function () {
        var username = $.cookie('cloud_name');
        if (username == undefined) { username = '游客' }
        return username;
    }


});

/***扩展函数***刘波 2014/12/10 ****/
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
    if (params != null) {
        if (params.constructor != Array) {
            params = [params];
        }
        $.each(params, function (i, n) {
            source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
        });
    }
    return source;
};
/***扩展函数***柏林 2014/8/27 ****/

(function ($) {
    $.fn.serializeJson = function () {
        var json = {};
        $(this.serializeArray()).each(function () {
            json[this.name] = this.value;
        });
        return json;
    },
    $.fn.formserialize = function (action, parm) {
        var tmp = this.serializeJson();
        if (parm) for (var p in parm) tmp[p] = parm[p];
        var post = {TokenGuid: $.token(), ActionCode: action, Data: $.toJSON(tmp)};
        return $.toJSON(post);
    },
    $.fn.objserialize = function (action) {
        var post;
        if (this.selector != "") {
            post = { TokenGuid: $.token(), ActionCode: action, Data: this.selector }
        } else {
            post = { TokenGuid: $.token(), ActionCode: action, Data: $.toJSON(this[0]) }
        }
        return $.toJSON(post);
    };
    $.fn.arrayserialize = function (action) {
        var post;
        if (this.selector != "") {
            post = { TokenGuid: $.token(), ActionCode: action, Data: this.selector }
        } else {
            post = { TokenGuid: $.token(), ActionCode: action, Data: $.toJSON(this) }
        }
        return $.toJSON(post);
    };
    $.fn.stringserialize = function (action) {
        var post = {TokenGuid: $.token(), ActionCode: action, Data: this.selector};
        return $.toJSON(post);
    }
})(jQuery);


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
QueryString = {
    data: {},
    Initial: function () {
        var aPairs, aTmp;
        var queryString = String(window.location.search);
        queryString = queryString.substr(1, queryString.length); //remove   "?"     
        aPairs = queryString.split("&");
        for (var i = 0; i < aPairs.length; i++) {
            aTmp = aPairs[i].split("=");
            this.data[aTmp[0]] = aTmp[1];
        }
    },
    GetValue: function (key) {
        return this.data[key] ? this.data[key] : "";
    }
};

$.Request = {
    QueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;

    }
};


var util = {
    browserVersion: function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
                (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
                    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
                        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
                            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

        return Sys;
    },

    isIE: function () {
        var obj = this.browserVersion();
        if (obj.ie)
            return true;
        else
            return false;
    },
    openUrl: function (url, type, name, width, height, left, top) {
        var availWidth = screen.availWidth - 25;
        var availHeight = screen.availHeight - 70;
        //var availWidth = screen.availWidth ;
        //var availHeight = screen.availHeight ;
        var myWidth = width ? width : availWidth;
        var myHeight = height ? height : availHeight;
        var myLeft = left ? left : (availWidth - myWidth) / 2;
        var myTop = top ? left : (availHeight - myHeight) / 2;
        if (!name)
            name = "";
        if (this.isIE() && type == 'modal') {
            var returnValue = window.showModalDialog(url, window, "edge:raised;scroll:1;status:0;help:0;resizable:1;dialogWidth:" + myWidth + "px;dialogHeight:" + myHeight + "px;dialogTop:" + myTop + "px;dialogLeft:" + myLeft + "px", true);
            if (returnValue == undefined) {
                returnValue = window.returnValue;
            }
            return returnValue;
        }
        else {
            var opened = window.open(url, name, 'height=' + myHeight + ',width=' + myWidth + ',status=1,toolbar=no,menubar=no,location=no,scrollbars=yes,modal=yes,dependent=yes,dialog=yes,minimizable=no,top=' + myTop + ',left=' + myLeft + ',resizable=yes', true);
            opened.focus();
            return opened;
        }

    }

};
