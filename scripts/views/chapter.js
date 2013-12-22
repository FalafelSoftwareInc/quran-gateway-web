/**
 * This is a chapters view
 */
define([
    'api',
    'views/baseview',
    'utils/helpers',
    'utils/alerts',
    'text!../../views/chapters/_lecture.html',
    'data/datasourcemeanings',
    'utils/plugins'
], function (Api, BaseView, Helpers, Alerts, lectureTemplate) {
    var context = null;

    var View = BaseView.extend({
        view: null,

        //CONSTRUCTOR
        init: function () {
            BaseView.fn.init.call(this);

            //CACHE CONTEXT FOR LATER
            context = this;
        },

        //EVENTS
        onInit: function (e) {
            //HANDLE CLICK TO DISPLAY CORRECT CONTENT VIEW
            var contents = e.view.element.find('.content');
            e.view.element.find('.sections').kendoMobileButtonGroup({
                select: function () {
                    //DATA IN OTHER TABS TOO LARGE FOR LOCAL STORAGE
                    if (this.selectedIndex == 0 || navigator.onLine) {
                        //SWITCH LIST ON BUTTON SELECT
                        contents.hide()
                            .eq(this.selectedIndex)
                            .show();
                    } else {
                        Alerts.error('You are current offline! This feature requires online connnectivity.');
                        this.select(0);
                    }
                },
                index: 0
            });

            //INITALIZE LECTURES LIST CONTAINER
            e.view.element.find('.lectures').kendoMobileListView({
                template: lectureTemplate,
                style: 'inset'
            });
        },

        onShow: function (e) {
            //CACHE VARIABLES FOR LATER USE
            context.view = e.view;

            //RESET SCROLL AND MENUS IF APPLICABLE
            if (!e.view._back) {
                context.reset(e, {
                    id: parseInt(e.view.params.id),
                    type: 'Chapters'
                });
            }

            //GET REQUESTED ITEM FOR POPULATING DETAILS
            Api.getChapter(parseInt(e.view.params.id))
                .done(function (data) {
                    //UPDATE HEADER TITLE
                    var template = kendo.template('#= transliteration #');
                    e.view.header.find('[data-role="navbar"]')
                        .data('kendoMobileNavBar')
                        .title(template(data));

                    //GET LIST VIEW
                    var infoItems = e.view.element.find('.km-listview.info')
                        .data('kendoMobileListView')
                        .items();

                    //POPULATE DATA
                    infoItems.eq(0).find('span').text(data.arabic);
                    infoItems.eq(1).find('span').text(data.id);
                    infoItems.eq(2).find('span').text(data.verses);
                    infoItems.eq(3).find('span').text(data.chronology);
                    infoItems.eq(4).find('span').text(data.juz);
                    infoItems.eq(5).find('span').text(data.sajdah || 'none');
                });

            //SET MEANINGS LINKS
            e.view.element.find('.meanings a')
                .queryString({ chapter: e.view.params.id });

            //SET QUERY FOR LECTURES
            e.view.element.find('.lectures')
                .data('kendoMobileListView')
                .setDataSource(new kendo.ui.DataSourceMeanings({
                    chapter: e.view.params.id,
                    filter: [
                        {
                            field: 'lecture',
                            operator: 'eq',
                            value: true
                        },
                        {
                            field: 'start',
                            operator: 'eq',
                            value: null
                        },
                        {
                            field: 'end',
                            operator: 'eq',
                            value: null
                        }
                    ],
                    sort: [
                        {
                            field: 'source',
                            dir: 'asc'
                        },
                        {
                            field: 'description',
                            dir: 'asc'
                        }
                    ]
                }));
        },

        onMeaningShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //GET CHAPTER ITEM
            Api.getChapter(parseInt(e.view.params.chapter))
                .done(function (data) {
                    //UPDATE HEADER TITLE
                    var template = kendo.template('#= transliteration #');
                    e.view.header.find('[data-role="navbar"]')
                        .data('kendoMobileNavBar')
                        .title(template(data));
                });

            //POPULATE DATA
            Api.getMeaningsByChapter(e.view.params.chapter, {
                source: e.view.params.source,
                start: null,
                end: null,
                exegesis: 1
            }).done(function (data) {
                var content = data && data.length ? data[0].description : 'Coming soon...';

                if (data[0].file) {
                    content += '<br /><br /><a href="' + data[0].fileCdn
                        + '" data-rel="external" class="button-file large" target="_blank">Open File</a>';
                }

                e.view.element.find('.content').html(content);
                e.view.element.find('.button-file').kendoMobileButton({
                    icon: 'organize'
                });
            });

            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e);
        },

        toggleFavorite: function (e) {
            var me = this;

            //GET REQUESTED ITEM
            Api.getChapter(parseInt(context.view.params.id))
                .done(function (data) {
                    var template = kendo.template('#= id #: #= transliteration # (#= translation #)');

                    //UPDATE FAVORITE BUTTON
                    BaseView.fn.toggleFavorite.call(me, context, null, {
                        id: parseInt(data.id),
                        type: 'Chapters',
                        name: template(data),
                        description: null,
                        url: 'views/chapters/detail.html?id=' + data.id
                    });
                });
        },

        reset: function (e, data) {
            //CALL BASE METHOD
            BaseView.fn.reset.call(this, e, data);

            //SELECT FIRST BUTTON AS DEFAULT
            e.view.element.find('.sections')
                .data('kendoMobileButtonGroup')
                .select(0);

            //SELEST FIRST LIST VIEW AS DEFAULT
            e.view.element.find('.content')
                .hide()
                .eq(0)
                .show();
        }
    });

    //RETURN VIEW
    return new View();
});