//EXPOSE APP MODULE TO GLOBAL FOR KENDO ACCESS
var App = {};

/**
 * This is the app
 */
define([
    'jquery',
    'underscore',
    'api',
    'utils/helpers',
    'utils/alerts',
    'layouts/default',
    'views/home',
    'views/chapter',
    'views/chapters',
    'views/verse',
    'views/verses',
    'views/names99',
    'views/hadiths',
    'views/progress',
    'views/topics',
    'views/ummah',
    'views/favorites',
    'views/shared',
    'add2home'
], function ($, _, Api, Helpers, Alerts, Default, Home, Chapter, Chapters, Verse, Verses,
    Names99, Hadiths, Progress, Topics, Ummah, Favorites, Shared) {

    //CONSTRUCTOR
    var init = function () {
        //START LOADING PANEL
        Alerts.initSpinner();
        
        //INITIALIZE DATA
        initStorage(function () {
            //STOP LOADING PANEL
            Alerts.exitSpinner();

            //INITIALIZE APP PARTS
            initErrors();
            initLayouts();
            initViews();
            initMobile();
            initPlugins();
            initStats();
        });
    };

    var initStorage = function (callback) {
        //PRELOAD OTHER DATA IN CASE GOES OFFLINE LATER
        $.when(Api.getChapters(), Api.getVerses(), Api.getHadiths, Api.getNames99())
            .done(callback);
    };

    var initErrors = function () {
        //ATTACH TO WINDOW ERROR
        window.onerror = function (msg, url, line) {
            //NOTIFY THE USER IF APPLICABLE
            Alerts.error('There was an error with your request: "' + msg
                + '". Please try again or restart the app.');

            /*LOG TO SERVER USING WEB SERVICE API
            try {
                $.ajax({
                    type: 'GET',
                    contentType: 'application/json',
                    cache: false,
                    url: Helpers.toServicesUrl('/System/Log'),
                    data: {
                        message: msg,
                        file: window.location.href,
                        line: line,
                        url: url,
                        userAgent: navigator.userAgent
                    }
                });
            } catch (err) {
                //DO NOTHING TO AVOID INFINITE ERROR LOOP
            }*/

            //BUBBLE ERROR TO CONSOLE STILL
            return false;
        };
    };

    var initLayouts = function () {
        //STORE IN GLOBAL
        App.layouts = {
            Default: Default
        };
    };

    var initViews = function () {
        //STORE IN GLOBAL
        App.views = {
            Home: Home,
            Chapter: Chapter,
            Chapters: Chapters,
            Verse: Verse,
            Verses: Verses,
            Names99: Names99,
            Hadiths: Hadiths,
            Progress: Progress,
            Topics: Topics,
            Ummah: Ummah,
            Favorites: Favorites,
            Shared: Shared
        };
    };

    var initMobile = function () {
        //RUN APP AND STORE IN GLOBAL
        var startApp = function () {
            //SET MOBILE APP OPTIONS
            var options = {
                initial: 'views/shared/home.html',
                skin: 'flat'
            };

            //FIX FOR IOS7 STATUS BAR FOR APPS
            if (kendo.support.mobileOS.ios && kendo.support.mobileOS.flatVersion >= 700)
                options.statusBarStyle = 'black-translucent';

            //FIX FOR REMOVING INITIAL HASH SINCE KENDO CRASHES
            history.pushState('', document.title, window.location.pathname);

            //START KENDO MOBILE AND CACHE FOR LATER USE
            App.mobile = new kendo.mobile.Application(document.body, options);
        };

        //INITIALIZE MOBILE APP BASED ON ENVIRONMENT
        if (Helpers.isPhoneGap()) {
            //ATTACH TO DEVICE READY EVENT FOR PHONEGAP
            document.addEventListener('deviceready', startApp, false);
        } else {
            //IMMEDIATE FOR WEB BROWSERS
            startApp();
        }
    };

    var initPlugins = function () {
        //INITIALIZE MOBILE PLUGINS IF DEVICE
        if (Helpers.isPhoneGap()) {
            //INITIALIZE CHILD BROWSER IF APPLICABLE
            $(document).on('click', 'a[data-rel="external"][target="_blank"]', function (e) {
                e.preventDefault();
                //OPEN LINKS VIA CHILD BROWSER PLUGIN
                window.open($(this).attr('href'), '_blank');
            });
        }
    };

    var initStats = function () {
        //STORE INSTALL DATE AND USAGE COUNTER
        Api.setInstallDate();
        Api.setUsageCounter();
    };

    //PUBLIC PROPERTIES
    return {
        init: init
    };
});