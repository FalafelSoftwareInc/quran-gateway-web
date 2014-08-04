/**
 * This is a helper utils module
 */
define([
	'jquery',
	'underscore',
	'baseurl',
	'basescriptsurl',
	'baseservicesurl'
], function ($, _, baseUrl, baseScriptsUrl, baseServicesUrl) {

    return {

        toUrl: function (url) {
            if (url && url.indexOf('~/') === 0)
                url = this.combinePaths(baseUrl, url);

            return url;
        },

        toServicesUrl: function (url) {
            return this.toUrl(this.combinePaths(baseServicesUrl, url));
        },

        toScriptsUrl: function (url) {
            return this.toUrl(this.combinePaths(baseScriptsUrl, url));
        },

        toViewsUrl: function (url) {
            return this.toScriptsUrl('views/' + _.ltrim(url, '~/'));
        },

        combinePaths: function (path1, path2) {
            return _.rtrim(path1, '/') + '/' + _.ltrim(path2, '~/');
        },

        getCurrentPage: function () {
            var file = window.location.pathname;
            var n = file.lastIndexOf('/');
            return n >= 0 ? file.substring(n + 1).toLowerCase() : '';
        },

        getCurrentPageUrl: function () {
            return window.location.pathname.substring(baseUrl.length);
        },

        getCurrentHashPage: function () {
            var path = _.ltrim(window.location.hash, '#!/');

            //VALIDATE INPUT
            if (path === '') return '';

            //ROOT PAGE IF APPLICABLE
            if (path.indexOf('/') < 0) return path;

            //DETERMINE ROOT PAGE
            return path.substring(0, path.indexOf('/'));
        },

        scrollTop: function () {
            $('html, body').animate({
                scrollTop: 0
            }, 'slow');
        },

        sendClientMail: function (options) {
            //CONSTRUCT EMAIL PARAMETERS
            var url = 'mailto:' + encodeURIComponent(options.mailto) + '?';
            if (options.cc) url += 'cc=' + encodeURIComponent(options.cc) + '&';
            if (options.subject) url += 'subject=' + encodeURIComponent(options.subject) + '&';
            if (options.body) url += 'body=' + encodeURIComponent(options.body) + '&';

            //TRIM TRAILING QUERYSTRING DELIMITERS
            _.rtrim(url, '?&');

            //TRIGGER BROWSER EMAIL REQUEST (TIMEOUT BECAUSE OF "REDIRECT")
            setTimeout(function () {
                window.location.href = url;
            }, 1000);
        },

        convertToBoolean: function (value) {
            //VALIDATE INPUT
            if (this.isNullOrEmpty(value)) return false;

            //DETERMINE BOOLEAN VALUE FROM STRING
            if (typeof value === 'string') {
                switch (value.toLowerCase()) {
                    case 'true':
                    case 'yes':
                    case '1':
                        return true;
                    case 'false':
                    case 'no':
                    case '0':
                        return false;
                }
            }

            //RETURN DEFAULT HANDLER
            return Boolean(value);
        },

        parseJson: function (json) {
            //USES BROWSER JSON IF AVAILABLE FOR PERFORMANCE
            return JSON && JSON.parse(json) || $.parseJSON(json);
        },

        isExternalUrl: function (url) {
            var pattern = /^https?:\/\//i;
            return pattern.test(url);
        },

        isNullOrEmpty: function (value) {
            return typeof value === 'undefined' || value === null || value.length === 0;
        },

        getValueOrDefault: function (value, defaultValue) {
            return !this.isNullOrEmpty(value) ? value : defaultValue;
        },

        toJquery: function (selector) {
            return selector instanceof $ ? selector : $(selector);
        },

        pushUnique: function (arr, value) {
            if ($.inArray(value, arr) < 0)
                arr.push(value);
        },

        remove: function (arr, value) {
            if (_.isObject(value)) {
                //FIND OBJECT TO SPLICE
                $.each(arr, function (i, item) {
                    if (_.isEqual(item, value)) {
                        arr.splice(i, 1);
                        return false;
                    }
                });
            } else {
                //FIND ELEMENT TO SPLICE
                if ($.inArray(value, arr) >= 0)
                    arr.splice($.inArray(value, arr), 1);
            }
        },

        //http://stackoverflow.com/a/11654596/235334
        updateQueryString: function (url, key, value) {
            var re = new RegExp("([?|&])" + key + "=.*?(&|#|$)(.*)", "gi");

            if (re.test(url)) {
                if (typeof value !== 'undefined' && value !== null)
                    return url.replace(re, '$1' + key + "=" + value + '$2$3');
                else return url.replace(re, '$1$3').replace(/(&|\?)$/, '');
            }
            else {
                if (typeof value !== 'undefined' && value !== null) {
                    var separator = url.indexOf('?') !== -1 ? '&' : '?',
                        hash = url.split('#');
                    url = hash[0] + separator + key + '=' + value;
                    if (hash[1]) url += '#' + hash[1];
                    return url;
                }
                else return url;
            }
        },

        isPhoneGap: function () {
            return window.device && navigator.userAgent.indexOf('Browzr') < 0;
        },

        hasPhoneGapPlugins: function () {
            return this.isPhoneGap()
                && device.uuid != 'e0101010d38bde8e6740011221af335301010333' //PLUGINS DO NOT WORK IN SIMULATOR
                && device.uuid != 'e0908060g38bde8e6740011221af335301010333' //PLUGINS DO NOT WORK IN SIMULATOR
                && window.plugins;
        }
    };
});
