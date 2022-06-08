<script>
    window.serverSettings = {
        fbAppId: '290410448063109',
        googleAppId: '13150095650-mo8psu2colep6uv90a2mu6r87u87s35a.apps.googleusercontent.com'
    };
    window.isAuthenticated = 1;
    window.logEvent = 1;
    window.userHasAdsParams = 0;
    window.utmSourceFromReferrer = 0;
    window.currentLang = '';
    window.baseUrl = 'templates';
    window.currentUrl = 'templates';
    var np_userId = '';
    try {
        np_userId = localStorage.getItem('np_userId');
    } catch (err) {
    }
    if (!np_userId) {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

// then to call it, plus stitch in '4' in the third group
        np_userId = (S4() + S4() + S4() + S4().substr(0, 3) + S4() + S4() + S4() + S4()).toLowerCase();
        try {
            localStorage.setItem('np_userId', np_userId);
            setCookie('np_userId', np_userId, 365);
        } catch (err) {
        }
    } else if (!readCookie('np_userId')) {
        setCookie('np_userId', np_userId, 365);
    }

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }

    function sendAnalyticsData(eventType, props, cb) {
        var json = { data: {} };
        json.userToken = np_userId;
        json.data.adsParams = readCookie('AdsParameters');
        json.data.ga = readCookie('_ga');
        json.data.gac = readCookie('_gac_UA-88868916-2');
        json.data.userAgent = navigator.userAgent;
        json.data.eventType = eventType;
        json.data.props = props;
        $.ajax({
            'type': 'POST',
            'url': '/Feedback/SendAdsLog',
            'contentType': 'application/json; charset=utf-8',
            'data': JSON.stringify(json),
            'dataType': 'json',
            'complete': cb || function() {}
        });
    }

    var isAmplitudeInitialized = false;

    function initializeAmplitudeUser() {
        if (isAmplitudeInitialized) {
            return;
        }
        isAmplitudeInitialized = true;

            identifyAmplitudeUser(1326822, '7bee0b30-a539-453e-a32c-dd2442f94b04');
    }

    function sendAmplitudeAnalyticsData(eventName, analyticsData, userProperties, callback_function) {
        initializeAmplitudeUser();

        if (userProperties) {
            if(userProperties.utm_source || userProperties.utm_campaign) {
                var identify = new amplitude.Identify();
                identify.setOnce("utm_campaign", userProperties.utm_campaign);
                identify.setOnce("utm_source", userProperties.utm_source);
                identify.setOnce("utm_content", userProperties.utm_content);
                identify.setOnce("utm_term", userProperties.utm_term);
                identify.setOnce("utm_page", userProperties.utm_page);
                identify.setOnce("utm_page2", userProperties.utm_page);
                identify.setOnce("referrer", userProperties.referrer);

                amplitude.getInstance().identify(identify);

                userProperties.utm_source_last = userProperties.utm_source;
                userProperties.utm_campaign_last = userProperties.utm_campaign;
                userProperties.utm_content_last = userProperties.utm_content;
                userProperties.utm_term_last = userProperties.utm_term;
                userProperties.utm_page_last = userProperties.utm_page;
            }

            var userProps = _objectWithoutProperties(userProperties, ["utm_campaign", "utm_source","utm_content", "utm_term", "utm_page", "referrer"]);
            amplitude.getInstance().setUserProperties(userProps);
        }

        analyticsData.WebSite = 'true';
        if (typeof callback_function === 'function') {
            amplitude.getInstance().logEvent(eventName, analyticsData, callback_function);
        } else {
            amplitude.getInstance().logEvent(eventName, analyticsData);
        }
    }

    function identifyAmplitudeUser(userId, token) {
        if (userId) {
            amplitude.getInstance().setUserProperties({
                "Token": token,
                "UserId": userId
            });
        }

        var identify = new amplitude.Identify();
        amplitude.getInstance().identify(identify);
        if (userId) {
            amplitude.getInstance().setUserId(userId);
        }
    }

    function _objectWithoutProperties(obj, keys) {
        var target = {};
        for (var i in obj) {
            if (keys.indexOf(i) >= 0) continue;
            if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
            target[i] = obj[i];
        }
        return target;
    }

    function getUtmParams(url) {
        if (!url.searchParams) {
            return {};
        }

        var utmSource = url.searchParams.get("utm_source");
        if (url.searchParams.get("sscid")) {
            utmSource = 'ShareASale';
        } else if (url.searchParams.get("fbclid")) {
            utmSource = 'Facebook';
        }
        var utmCampaign = url.searchParams.get("utm_campaign") || url.searchParams.get("campaign");
        var utmContent = url.searchParams.get("utm_content") || url.searchParams.get("content");
        var utmTerm = url.searchParams.get("utm_term") || url.searchParams.get("term");


        return { utmSource : utmSource, utmCampaign: utmCampaign, utmContent: utmContent, utmTerm: utmTerm}
    }

    function clearPageUrl(pageUrl) {
        if (window.currentLang) {
            pageUrl = pageUrl.replace('/' + window.currentLang, '');
        }
        if (window.currentUrl) {
            pageUrl = pageUrl.replace(window.currentUrl, window.baseUrl);
        }

        var url = pageUrl.replace(/\?.*/, '').replace(/(.)\/$/, '$1');
        var match = url.match(/\/\d+(\/|$)/);
        if (match && match.index > 0) {
            url = url.substring(0, match.index);
        }
        return url.replace(/\/editor\//ig, '/').replace(/\/frame\//ig, '/').toLowerCase();
    }

    function getUtmPageValue(pageUrl) {
        var url = '/';
        var parts = pageUrl.split('/');
        if (pageUrl.startsWith('/') && parts.length > 1) {
            url += parts[1];
        } else {
            return pageUrl;
        }
        return url;
    }

    function sendAnalyticsFromUrl(referrer, pageType) {
        var hash = window.location.hash;

        var urlIsAvailable = typeof URL === "function" || (navigator.userAgent.indexOf('MSIE') != -1 && typeof URL === 'object');
        if (!urlIsAvailable) {
            return;
        }

        var url = new URL(window.location.href);
        if (hash && hash.indexOf('utm_') >= 0) {
            url = new URL(window.location.origin + window.location.pathname + hash.replace('#', '?'));
        }

        if (!url.searchParams) {
            return;
        }
        var paramsFromCookie = false;
        var utmParams = getUtmParams(url);
        if (userHasAdsParams)
        {
            var adsParamsFromCookie = readCookie('AdsParameters');
            if (!utmParams.utmCampaign && !utmParams.utmSource && adsParamsFromCookie) {
                url = new URL(window.location.origin + (adsParamsFromCookie.indexOf('?') === -1 ? '?' : '') + readCookie('AdsParameters'));
                utmParams = getUtmParams(url);
                paramsFromCookie = true;
            }
        }

        var source = url.searchParams.get("source");
        var gclid = url.searchParams.get("gclid");

        var needLogEvent = utmParams.utmSource || utmParams.utmCampaign || gclid;
        var fullPageUrl = window.location.pathname.split('?')[0];
        var pageUrl = clearPageUrl(fullPageUrl);

        if (needLogEvent) {
            var eventProps = {
                "utm_source": utmParams.utmSource || source,
                "utm_campaign": utmParams.utmCampaign,
                "utm_content": utmParams.utmContent,
                "utm_term": utmParams.utmTerm,
                "utm_page": getUtmPageValue(pageUrl),
                "page_url": pageUrl,
                "full_page_url": fullPageUrl
            };
            if (utmParams.utmSource === "elastic") {
                sendAmplitudeAnalyticsData('Email Click', eventProps);
            }
            if (!paramsFromCookie || utmSourceFromReferrer) {
                var userProps = {
                    "utm_source": utmParams.utmSource,
                    "utm_campaign": utmParams.utmCampaign,
                    "utm_content": utmParams.utmContent,
                    "utm_term": utmParams.utmTerm,
                    "utm_page": getUtmPageValue(pageUrl),
                    "utm_lang": window.currentLang || '',
                    "referrer": referrer
                };
                sendAmplitudeAnalyticsData('Campaign', eventProps, userProps);
            }
        }

        if (logEvent && (isAuthenticated || needLogEvent)) {
            var pageEventProps = {
                'page': pageUrl,
                'full_page_url': fullPageUrl,
                'type': pageType,
                'lang': window.currentLang || ''
            };
            sendAmplitudeAnalyticsData('Page View', pageEventProps);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        var referrer = '';
        var pageType = 'Template Page Preview';
        sendAnalyticsFromUrl(referrer, pageType);
    });
</script>


<!--
<style>.async-hide { opacity: 0 !important} </style>
<script>(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
})(window,document.documentElement,'async-hide','dataLayer',4000,
{'GTM-KGP3NM3':true});</script>
-->    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-88868916-2"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        var options = {};
                 options = { 'user_id': 1326822 };
        // gtag('config', 'GA_TRACKING_ID', { 'optimize_id': 'OPT_CONTAINER_ID'});
        gtag('config', 'UA-88868916-2', options);
        gtag('config', 'AW-797221335');
    </script>
        <!-- Facebook Pixel Code -->
        <script>
            if(window.hideFacebookPixelCode !== true) {
                !function (f, b, e, v, n, t, s) {
                    if (f.fbq) return; n = f.fbq = function () {
                        n.callMethod ?
                            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                    };
                    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                    n.queue = []; t = b.createElement(e); t.async = !0;
                    t.src = v; s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s)
                }(window, document, 'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '251025992170426');
                fbq('track', 'PageView');
            }
        </script>
        <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=251025992170426&ev=PageView&noscript=1"/></noscript>
        <!-- End Facebook Pixel Code -->

