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

    //CONFIGURE SHORTCUT ALIASES
    require.config({
        baseUrl: currentPath,
        paths: {
            add2home: '../scripts/add2home/add2home',
            hijri: '../scripts/hijricalendar/hijricalendar.mod',
            jplayer: '../scripts/jplayer/jquery.jplayer.min',
            jplaylist: '../scripts/jplayer/add-on/jplayer.playlist.min',
            jsurl: '../scripts/js-url/url.min',
            kendoui: '../scripts/kendoui/js', //FOR AMD USE
            lostorage: '../scripts/lostorage/loStorage.min',
            localstoragedb: '../scripts/localstoragedb/localstoragedb.min',
            moment: '../scripts/moment/moment.min',
            spin: '../scripts/spin/spin.min',
            text: '../scripts/require/text',
            toastr: '../scripts/toastr/toastr.min',
            underscore: '../scripts/underscore/underscore-min',
            'underscore.string': '../scripts/underscore/underscore.string.min'
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