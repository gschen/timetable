// 
// This work by http://twitter.com/Ben_Lowe of http://www.triballabs.net is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 2.0 UK: England & Wales License.
// http://creativecommons.org/licenses/by-nc-sa/2.0/uk/ 
//

/// <reference path="jquery-1.7.1-vsdoc.js" />

Array.prototype.last = function() {return this[this.length-1];}

function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
    return "";
}

(function ($) {
    var _dataFn = $.fn.data;
    $.fn.data = function (key, val) {
        if (typeof val !== 'undefined') {
            $.expr.attrHandle[key] = function (elem) {
                return $(elem).attr(key) || $(elem).data(key);
            };
        }
        return _dataFn.apply(this, arguments);
    };
})(jQuery);

function removeOldCookieValues() {
    var cookieValue = getCookie("agentTabs");
    var tabs = cookieValue.split('|');

    if (tabs[0] == '') {
        tabs.shift();
    }

    for (i = 0; i < tabs.length; i++) {
        var tabDetails = tabs[i].split('#');
        var localToken = tabDetails[0].substring(tabDetails[0].indexOf("token=") + 6);
        if (token != localToken) {
            tabs[i] = "";
        }
    }

    cookieValue = '';
    var itemCount = 0;
    for (i = 0; i < tabs.length; i++) {
        if (tabs[i] != "") {
            if (itemCount > 0) {
                cookieValue += '|';
            }
            cookieValue += tabs[i];
            itemCount++;
        }
    }

    setCookie("agentTabs", cookieValue, 1);
}

$(function () {

    $.fn.textWidth = function () {
        var html_org = $(this).html();
        var html_calc = '<span>' + html_org + '</span>';
        $(this).html(html_calc);
        var width = $(this).find('span:first').width();
        $(this).html(html_org);
        return width;
    };

    // http://www.foliotek.com/devblog/getting-the-width-of-a-hidden-element-with-jquery-using-width/
    $.fn.getHiddenDimensions = function (includeMargin) {
        var $item = this,
	        props = { position: 'absolute', visibility: 'hidden', display: 'block' },
	        dim = { width: 0, height: 0, innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
	        $hiddenParents = $item.parents().andSelf().not(':visible'),
	        includeMargin = (includeMargin == null) ? false : includeMargin;

        var oldProps = [];
        $hiddenParents.each(function () {
            var old = {};

            for (var name in props) {
                old[name] = this.style[name];
                this.style[name] = props[name];
            }

            oldProps.push(old);
        });

        dim.width = $item.width();
        dim.outerWidth = $item.outerWidth(includeMargin);
        dim.innerWidth = $item.innerWidth();
        dim.height = $item.height();
        dim.innerHeight = $item.innerHeight();
        dim.outerHeight = $item.outerHeight(includeMargin);

        $hiddenParents.each(function (i) {
            var old = oldProps[i];
            for (var name in props) {
                this.style[name] = old[name];
            }
        });

        return dim;
    }

    $.fn.setLastTab = function () {
        //alert($(this).attr('href'));
        //alert(window.location.search);

        removeOldCookieValues();

        var tabFound = false;
        var cookieValue = getCookie("agentTabs");
        var tabs = cookieValue.split('|');

        if (tabs[0] == '') {
            tabs.shift();
        }

        for (i = 0; i < tabs.length; i++) {
            var tabDetails = tabs[i].split('#');
            if (tabDetails[0] == window.location.search.replace('guest=1&', '')) {
                tabs[i] = window.location.search.replace('guest=1&', '') + '#' + $(this).attr('href').slice(1);
                tabFound = true;
            }
        }
        if (!tabFound) {
            tabs.push(window.location.search.replace('guest=1&', '') + '#' + $(this).attr('href').slice(1));
        }

        cookieValue = '';
        for (i = 0; i < tabs.length; i++) {
            if (i > 0) {
                cookieValue += '|';
            }
            cookieValue += tabs[i];
        }

        setCookie("agentTabs", cookieValue, 1);
    }

    $(document).ready(function (e) {
        removeOldCookieValues();
        var cookieValue = getCookie("agentTabs");
        var tabs = cookieValue.split('|');

        if (tabs[0] == '') {
            tabs.shift();
        }

        for (i = 0; i < tabs.length; i++) {
            var tabDetails = tabs[i].split('#')
            if (tabDetails[0] == window.location.search.replace('guest=1&', '')) {
                var tabId = tabDetails[1].split('-');
                $('#' + tabId[0] + ' li:eq(' + tabId[1] + ') a').tab('show');
            }
        }
    })

    $('.configLink').click(function (e) {
        var params = $(this).data('params');

        /*if (params.substring(0, 4) == 'http') {
            document.location = params;
            return false;
        }*/

        var localGuest = "";
        if (guest == 1) {
            localGuest = 'guest=1&';
        }
        var params = $(this).data('params');
        if (typeof params === 'undefined') {
            params = "";
        }
        else {
            params += '&';
        }

        var cookieValue = getCookie("agentTabs");
        var tabs = cookieValue.split('|');

        if (tabs[0] == '') {
            tabs.shift();
        }

        for (i = 0; i < tabs.length; i++) {
            var tabDetails = tabs[i].split('#');
            if (tabDetails[0] == '?' + params + 'token=' + token) {
                tabs.splice(i, 1);
                break;
            }
        }
        cookieValue = '';
        for (i = 0; i < tabs.length; i++) {
            if (i > 0) {
                cookieValue += '|';
            }
            cookieValue += tabs[i];
        }

        setCookie("agentTabs", cookieValue, 1);
        document.location = 'dynamicpage.php?' + params + 'token=' + token;

        return false;
    });
});