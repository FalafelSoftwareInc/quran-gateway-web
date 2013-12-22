(function () {
    //DETERMINE BASE URL FROM CURRENT SCRIPT PATH
    var scripts = document.getElementsByTagName('script');
    var src = scripts[scripts.length - 1].src;
    var currentPath = src.substring(src.indexOf(window.location.pathname), src.lastIndexOf('/'));

    //REGISTER DEFAULT JS MODULE
    define('baseurl', [], function () { return '../'; });
    define('basescriptsurl', [], function () { return currentPath + '/'; });
    define('baseservicesurl', [], function () { return 'http://api.publicrealm.net/qurangateway'; });
    define('baseresourcesurl', [], function () { return 'http://resources.publicrealm.net'; });
    define('jquery', [], function () { return window.jQuery; });

    //CONFIFURE SHORTCUT ALIASES
    require.config({
        baseUrl: currentPath,
        paths: {
            add2home: 'libs/add2home/add2home',
            hijri: 'libs/hijricalendar/hijricalendar.mod',
            jplayer: 'libs/jplayer/jquery.jplayer.min',
            jplaylist: 'libs/jplayer/add-on/jplayer.playlist.min',
            jsurl: 'libs/js-url/url.min',
            kendoui: 'libs/kendoui/js', //FOR AMD USE
            lostorage: 'libs/lostorage/loStorage.min',
            localstoragedb: 'libs/localstoragedb/localstoragedb.min',
            moment: 'libs/moment/moment.min',
            spin: 'libs/spin/spin.min',
            text: 'libs/require/text',
            toastr: 'libs/toastr/toastr.min',
            underscore: 'libs/underscore/underscore-min',
            'underscore.string': 'libs/underscore/underscore.string.min'
        },
        // The shim config allows us to configure dependencies for
        // scripts that do not call define() to register a module
        shim: {
            jplaylist: ['jplayer'],
            jsurl: {
                deps: ['jquery'],
                exports: 'url'
            },
            localstoragedb: {
                exports: 'localStorageDB'
            },
            moment: {
                deps: ['jquery'],
                exports: 'moment'
            },
            toastr: {
                deps: ['jquery'],
                exports: 'toastr'
            },
            underscore: {
                deps: ['underscore.string'],
                exports: '_',
                init: function (_s) {
                    //MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
                    _.mixin(_s.exports());
                    return _;
                }
            }
        }
    });

    require([
        'app'
    ], function (App) {
        //INITIALIZE APP
        App.init();
    });
})();