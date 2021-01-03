(function() {
    var isoDate = (new Date()).toISOString();
    var jsonCookieObject = [];
    var referrer = '';
    if (document.referrer) {
        referrer = document.referrer.split('/')[2];
        if (referrer === window.location.host) {
            referrer = '';
        }
    }
    var uuidv4 = function() {
        var d = new Date().getTime();
        if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
    var getCookie = function(name) {
        var i, x, y, cookies = document.cookie.split(';');
        for (i=0; i < cookies.length; i++) {
            x = cookies[i].substr(0, cookies[i].indexOf('='));
            y = cookies[i].substr(cookies[i].indexOf('=')+1);
            x = x.replace(/^\s+|\s+$/g,'');
            if ( x == name ) {
                return decodeURIComponent(y);
            }
        }
    }
    var brandid = 'pkf';//{{Taxonomy - brand}} || '';
    var eventMetadata = {
        'service': 'web-client',
        'module': 'vivid',
        'eventName': 'PkfPageLoaded',
        'version': '1.00',
        'eventId': uuidv4(),
        'sessionId': '',
        'xdSessionId': getCookie('pkfxdsid') || '',
        'accountId': '',
        'brand': brandid,
        'fp': '',
        'occurredAt': isoDate,
        'submittedAt': isoDate,
        'correlationId': '',
        'tags': [],
        'synthetic':{},
        'tachyon': {
            'receivedAt': '',
            'sourceIP': '',
            'dc':''
        }
    };
    if(document.cookie && document.cookie != '')
    {
        var cookies = document.cookie.split(';');
        for(var i = 0; i < cookies.length; i++) {
            var cname = cookies[i].split("=");
            cname[0] = cname[0].replace(/^ /, '');
            var cookieObject = {
                'name': decodeURIComponent(cname[0]),
                'value': decodeURIComponent(cname[1])
            };
            jsonCookieObject.push(cookieObject);
        }
    }
    var pkfVisitID = getCookie('pkfvid');
    if (!pkfVisitID) {
        pkfVisitID = uuidv4();
        document.cookie = 'pkfvid=' + pkfVisitID;
        var cookieObject = {
            'name': 'pkfvid',
            'value': pkfVisitID
        };
        jsonCookieObject.push(cookieObject);
    }
    eventMetadata.sessionId = pkfVisitID;
    var makeInt = function(value, fallback) {
        return parseInt(value) || value === 0 ? parseInt(value) : fallback;
    }
    var perfData = function() {
        var pageWeight = document.getElementsByTagName('HTML')[0].outerHTML.length;
        var w = window;
        var pt;
        var res = [];
        if (window && w.performance) {
            pt = w.performance.timing;
            if (w.performance.getEntriesByType !== undefined) {
                w.performance.setResourceTimingBufferSize(200);
                res = w.performance.getEntriesByType("resource");
            } else if (w.performance.webkitGetEntriesByType !== undefined) {
                w.performance.setResourceTimingBufferSize(200)
                res = w.performance.webkitGetEntriesByType("resource");
            }
        }
        var downlink = -1;
        if (navigator && navigator.connection !== undefined) {
            downlink = navigator.connection.downlink;
        }
        var perf = {
            "enabled": !!!!pt,
            "dl": downlink,
            "ttfb": -1,
            "respS": -1,
            "reqS": -1,
            "dns": -1,
            "plt": -1,
            "tcp": -1,
            "pw": makeInt(pageWeight, -1),
            "wf": []
        };
        if (pt) {
            perf.ttfb = makeInt(pt.responseStart - pt.requestStart, -1);
            perf.respS = makeInt(pt.responseStart, -1);
            perf.reqS = makeInt(pt.requestStart, -1);
            perf.dns = makeInt(pt.domainLookupEnd - pt.domainLookupStart, -1);
            perf.tcp = makeInt(pt.connectEnd - pt.connectStart, -1);
        }
        return perf;
    }
    var screenW = -1;
    var screenH = -1;
    if (screen) {
        screenW = screen.width || -1;
        screenH = screen.height || -1;
    }
    var pageLoadedData = {
        'timezone': (new Date()).getTimezoneOffset() / 60,
        'path': {
            'protocol': window.location.protocol,
            'host': window.location.host,
            'path': window.location.pathname,
            'search': window.location.search,
            'hash': window.location.hash
        },
        'performance': perfData(),
        'device': {
          'screenWidth': screenW,
          'screenHeight': screenH,
          'ua': navigator.userAgent,
        },
        'cookies': jsonCookieObject,
        'referrer': referrer
    };
    eventMetadata.fp = getCookie('pkfcid') || '';

    var tachyonPageLoadedEvent = {'metadata': eventMetadata,
        'payload': {
            'pageLoaded': pageLoadedData
        }
    };
    var http = new XMLHttpRequest();
    http.open('POST', 'https://tachyon.qwengo.co.za/tachyon/PkfPageLoaded', true);
    http.setRequestHeader('Content-type', 'application/json');
    http.send(JSON.stringify(tachyonPageLoadedEvent));
    http.onload = function() {
        console.log(http.responseText);
    };
})();
