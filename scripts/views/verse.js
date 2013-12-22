/**
 * This is a verse view
 */
define([
    'underscore',
    'jsurl',
    'baseresourcesurl',
    'api',
    'utils/helpers',
    'utils/alerts',
    'views/baseview',
    'jplaylist'
], function (_, url, baseResourcesUrl, Api, Helpers, Alerts, BaseView) {
    var context = null;

    var View = BaseView.extend({
        view: null,
        audioPlayer: null,

        //CONSTRUCTOR
        init: function () {
            BaseView.fn.init.call(this);

            //CACHE CONTEXT FOR LATER
            context = this;
        },

        //EVENTS
        onShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e, {
                id: parseInt(e.view.params.id),
                type: 'Verses'
            });

            //RESET AUDIO SELECTION
            var audioControls = e.view.element.find('[data-role="buttongroup"]');
            audioControls.data('kendoMobileButtonGroup').select(1);

            //GET REQUESTED ITEMS
            $.when(Api.getVerse(parseInt(e.view.params.id)), Api.getChapter(parseInt(e.view.params.chapter)))
                .done(function (verse, chapter) {
                    //INITIALIZE VARIABLES
                    verse.range = verse.start;
                    if (verse.end) verse.range += '-' + verse.end;
                    var title = context.view.params.title
                        ? decodeURIComponent(context.view.params.title)
                        : '[Quran, ' + chapter.id + ':' + verse.range + ']';

                    //UPDATE HEADER TITLE
                    e.view.header.find('[data-role="navbar"]')
                        .data('kendoMobileNavBar')
                        .title(title);

                    //BIND CONTENT
                    e.view.element.find('.arabic').html(verse.arabic);
                    e.view.element.find('.translation').html(verse.translation);

                    //BIND VERSE DETAILS
                    var template = kendo.template('#= chapter.transliteration # (#= chapter.translation #)<br />[#= chapter.id #:#= verse.range #]');
                    e.view.element.find('.range').html(template({ chapter: chapter, verse: verse }));

                    //HANDLE QUR'AN CLICK
                    e.view.element.find('.actions a[data-icon="featured"]').attr('href', 'http://beta.quranexplorer.com/#' + chapter.id
                        + '/' + verse.start + '/' + (verse.end || verse.start) + '/');

                    //HANDLE SHARE CLICK
                    var bodyTemplate = kendo.template('Chapter #= chapter.id #. #= chapter.translation #, Verse #= verse.range #:'
                        + '\n\n#=verse.arabic #\n\nTranslation:\n#= verse.translation #'
                        + '\n\nvia Quran Gateway - http://falafelsoft.ae');
                    var body = bodyTemplate({ chapter: chapter, verse: verse });
                    e.view.element.find('.actions a[data-icon="share"]').attr('href', 'mailto: ?'
                        + 'subject=' + encodeURIComponent('Qur\'an verse')
                        + '&body=' + encodeURIComponent(body));
                    
                    /*TODO: SOME DEVICES NOT SUPPORTED FOR EMAILING
                    if (kendo.support.mobileOS && kendo.support.mobileOS == 'windows') {
                        e.view.element.find('.actions a[data-icon="share"]').onclick(function (e) {
                            e.preventDefault();
                            alert('Your device does not support sharing via email.');
                        });
                    }*/

                    //INITIALIZE AUDIO IF APPLICABLE
                    if (!context.audioPlayer) {
                        context.audioPlayer = new jPlayerPlaylist({
                            jPlayer: '#jq_jplayer',
                            cssSelectorAncestor: '#jq_jplayer_container'
                        }, [], {
                            supplied: 'mp3',
                            ended: function (e) {
                                //RESET AUDIO CONTROLS TO PAUSE BY CHECKING IF LAST IN PLAYLIST
                                if (e.jPlayer.status.media.mp3 == context.audioPlayer.playlist[context.audioPlayer.playlist.length - 1].mp3) {
                                    audioControls.data('kendoMobileButtonGroup').select(1);
                                    context.audioPlayer.select(0); //REWIND TO START OF PLAYLIST
                                }
                            }
                        });
                    }

                    //BUILD AUDIO PLAYLIST
                    context.audioPlayer.remove();
                    context.audioPlayer.setPlaylist([{
                        mp3: context.getAudioName(chapter.id, verse.start)
                    }]);

                    //ADD RANGE OF AUDIO IF APPLIABLE
                    if (verse.end) {
                        var count = parseInt(verse.start);
                        while (count < parseInt(verse.end)) {
                            context.audioPlayer.add({
                                mp3: context.getAudioName(chapter.id, ++count)
                            })
                        }
                    }

                    //ADD AUDIO DETAILS TO BUTTON GROUP
                    audioControls
                        .data('record-id', e.view.params.id)
                        .data('chapter', chapter.id)
                        .data('start', verse.start)
                        .data('end', verse.end)
                        .data('title', e.view.params.title);
                });
        },

        onSelect: function (e) {
            //INITIALIZE VARIABLES
            var id = this.element.data('record-id');
            var chapter = this.element.data('chapter');
            var start = this.element.data('start');
            var end = this.element.data('end');
            var title = this.element.data('title');
            var index = this.current().index();
            var player = context.view.element.find('#jq_jplayer');
            var template = kendo.template('views/verses/detail.html?id=#= id #&chapter=#= chapter #&title=#= title #&favorite=#= favorite #');
            var favorite = Helpers.convertToBoolean(context.view.params.favorite);
            var data = null;
            var list = null;

            //GET DATA SOURCE FOR NEXT/PREVIOUS FUNCTIONS
            if (favorite) {
                data = App.views.Favorites.dataSource.get(id);
                list = App.views.Favorites.dataSource.view();
            } else if (App.views.Verses.dataSource) {
                data = App.views.Verses.dataSource.get(id);
                list = App.views.Verses.dataSource.view();
            }

            switch (index) {
                case 0:
                    if (navigator.onLine) context.audioPlayer.play();
                    else {
                        Alerts.error('You are current offline! This feature requires online connnectivity.');
                        this.select(1);
                    }
                    break;
                case 1:
                    context.audioPlayer.pause();
                    break;
                case 2:
                    //GO TO PREVIOUS RECORD
                    for (var i = 0; i < list.length; i++) {
                        for (var j = 0; j < list[i].items.length; j++) {
                            if (data.uid == list[i].items[j].uid) {
                                //VALIDATE REQUESTED POSITION
                                if (j == 0 && (i == 0 || favorite)) {
                                    Alerts.warning('You are at the beginning!');
                                    this.select(1);
                                    return;
                                }

                                //DETERMINE PARENT AND ITEM INDEX
                                var parent, index;
                                if (j > 0) {
                                    //LOAD PREVIOUS ITEM OF CURRENT GROUP
                                    parent = i;
                                    index = j - 1;
                                } else {
                                    //LOAD LAST ITEM OF PREVIOUS GROUP
                                    parent = i - 1;
                                    index = list[parent].items.length - 1;
                                }

                                //NAVIGATE TO PREVIOUS RECORD
                                App.mobile.navigate(template({
                                    id: list[parent].items[index].id,
                                    chapter: favorite
                                        ? url('?chapter', list[parent].items[index].url)
                                        : list[parent].items[index].chapter,
                                    title: title,
                                    favorite: favorite
                                }));

                                //EXIT LOOP
                                return;
                            }
                        }
                    }
                    break;
                case 3:
                    //GO TO NEXT RECORD
                    for (var i = 0; i < list.length; i++) {
                        for (var j = 0; j < list[i].items.length; j++) {
                            if (data.uid == list[i].items[j].uid) {
                                //VALIDATE REQUESTED POSITION
                                if (j == list[i].items.length - 1 && (i == list.length - 1 || favorite)) {
                                    Alerts.warning('You are at the end!');
                                    this.select(1);
                                    return;
                                }

                                //DETERMINE PARENT AND ITEM INDEX
                                var parent, index;
                                if (j < list[i].items.length - 1) {
                                    //LOAD PREVIOUS ITEM OF CURRENT GROUP
                                    parent = i;
                                    index = j + 1;
                                } else {
                                    //LOAD LAST ITEM OF PREVIOUS GROUP
                                    parent = i + 1;
                                    index = 0;
                                }

                                //NAVIGATE TO PREVIOUS RECORD
                                App.mobile.navigate(template({
                                    id: list[parent].items[index].id,
                                    chapter: favorite
                                        ? url('?chapter', list[parent].items[index].url)
                                        : list[parent].items[index].chapter,
                                    title: title,
                                    favorite: favorite
                                }));

                                //EXIT LOOP
                                return;
                            }
                        }
                    }
                    break;
            }
        },

        onReciterOpen: function (e) {
            //SELECT FIRST BUTTON AS DEFAULT
            e.sender.element.find('.km-listview input[value="' + Api.getReciter() + '"]')
                .prop('checked', true);
        },

        onReciterSelect: function (e) {
            //GET SELECTION
            var value = e.item.find('input').val();

            //UPDATE AUDIO PLAYER
            var playlist = context.audioPlayer.playlist;
            for (var i = 0; i < playlist.length; i++) {
                playlist[i].mp3 = playlist[i].mp3.replace(Api.getReciter(), value);
            }
            context.audioPlayer.remove();
            context.audioPlayer.setPlaylist(playlist);

            //STORE DATA
            Api.setReciter(value);
        },

        toggleFavorite: function (e) {
            var me = this;

            //GET REQUESTED ITEM
            Api.getVerse(parseInt(context.view.params.id))
                .done(function (data) {
                    var template = kendo.template('<span>#= summary #</span><small>Chapter: #= chapter #, # if (end) { # Verses: #= start # to #= end # # } else { # Verse: #= start # # } #</small>');

                    //EXTEND DATA
                    data.summary = _.truncate(data.translation, 150);
                    data.chapter = context.view.params.chapter;

                    //UPDATE FAVORITE BUTTON
                    BaseView.fn.toggleFavorite.call(me, context, null, {
                        id: data.id,
                        type: 'Verses',
                        name: template(data),
                        description: null,
                        url: 'views/verses/detail.html?id=' + data.id
                            + '&chapter=' + context.view.params.chapter
                            + '&title=' + context.view.params.title
                    });
                });
        },

        getAudioName: function (chapter, verse) {
            return verse
                ? baseResourcesUrl + '/audio/' + Api.getReciter() + '/'
                    + _.lpad(chapter, 3, '0')
                    + _.lpad(verse, 3, '0')
                    + '.mp3'
                : null;
        }

    });

    //RETURN VIEW
    return new View();
});