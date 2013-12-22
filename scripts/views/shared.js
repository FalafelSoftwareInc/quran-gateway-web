/**
 * This is a shared view
 */
define([
    'utils/alerts',
    'views/baseview'
], function (Alerts, BaseView) {
    var context = null;

    var View = BaseView.extend({
        view: null,
        videoPlayer: null,
        audioPlayer: null,

        //CONSTRUCTOR
        init: function () {
            BaseView.fn.init.call(this);

            //CACHE CONTEXT FOR LATER
            context = this;
        },

        //EVENTS
        onStreamShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //RESET MEDIA, SCROLL, AND MENUS
            context.reset.call(this, e);

            //UPDATE VIDEO SOURCE
            e.view.element.find('iframe')
                .attr('src', decodeURIComponent(e.view.params.url));

            //UPDATE HEADER TITLE
            e.view.header.find('[data-role="navbar"]')
                .data('kendoMobileNavBar')
                .title(decodeURIComponent(e.view.params.title));
        },

        onVideoShow: function (e) {
            var me = this;
            var player = e.view.element.find('video');

            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //RESET MEDIA, SCROLL, AND MENUS
            context.reset.call(this, e);

            //UPDATE VIDEO SOURCE
            player.find('source').attr('src', decodeURIComponent(e.view.params.url));

            //INITIALIZE AUDIO
            player.load();

            //SET AUDIO TITLE
            e.view.element.find('h2')
                .html(decodeURIComponent(e.view.params.title));
        },
        
        onAudioShow: function (e) {
            var me = this;
            var player = e.view.element.find('audio');

            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //RESET MEDIA, SCROLL, AND MENUS
            context.reset.call(this, e);

            //UPDATE AUDIO SOURCE
            player.find('source').attr('src', decodeURIComponent(e.view.params.url));

            //INITIALIZE AUDIO
            player.load();

            //SET AUDIO TITLE
            e.view.element.find('h2')
                .html(decodeURIComponent(e.view.params.title));
        },

        reset: function (e) {
            //STOP ALL EXISTING PLAYING MEDIA
            $('video, audio').each(function () {
                this.pause();
            });

            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e);

            //CHECK ONLINE CONNECTIVITY
            if (e.view.params.url.toLowerCase().substring(0, 4) == 'http' && !navigator.onLine)
                Alerts.error('You are current offline! This feature requires online connnectivity.');
        }

    });

    //RETURN VIEW
    return new View();
});