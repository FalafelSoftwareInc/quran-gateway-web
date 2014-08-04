/**
 * This is a hadiths view
 */
define([
    'underscore',
    'api',
    'views/baseview',
    'text!../../views/hadiths/_list.html',
    'data/datasourcehadiths'
], function (_, Api, BaseView, listTemplate) {
    var context = null;

    var View = BaseView.extend({
        view: null,
        dataSource: null,

        //CONSTRUCTOR
        init: function () {
            BaseView.fn.init.call(this);

            //CACHE CONTEXT FOR LATER
            context = this;
        },

        //EVENTS
        onInit: function (e) {
            e.view.element.find('.listview').kendoMobileListView({
                dataSource: new kendo.ui.DataSourceHadiths(),
                template: listTemplate,
                endlessScroll: true,
                virtualViewSize: 10,
                filterable: {
                    field: 'translation',
                    operator: 'contains',
                    ignoreCase: true
                }
            });
        },

        onShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //CACHE DATASOURCE FOR LATER USE
            context.dataSource = e.view.element.find('.listview')
                .data('kendoMobileListView')
                .dataSource;

            //RESET QUERY ON DATASOURCE
            context.dataSource.query({
                filter: {
                    field: 'qudsi',
                    operator: 'eq',
                    value: true
                },
                sort: [
                    {
                        field: 'qudsi',
                        dir: 'desc'
                    },
                    {
                        field: 'nawawi',
                        dir: 'desc'
                    },
                    {
                        field: 'title',
                        dir: 'asc'
                    }
                ]
            });

            //RESET SEARCH INPUT
            e.view.element.find('[type="search"]').val('');

            //SELECT FIRST BUTTON AS DEFAULT
            e.view.header.find('[data-role="buttongroup"]')
                .data('kendoMobileButtonGroup')
                .select(0);

            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e);
        },

        onSupplicationsShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //CACHE DATASOURCE FOR LATER USE
            context.dataSource = e.view.element.find('.listview')
                .data('kendoMobileListView')
                .dataSource;

            //RESET QUERY ON DATASOURCE
            context.dataSource.query({
                filter: {
                    field: 'supplication',
                    operator: 'eq',
                    value: true
                },
                sort: [
                    {
                        field: 'title',
                        dir: 'asc'
                    }
                ]
            });

            //RESET SEARCH INPUT
            e.view.element.find('[type="search"]').val('');

            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e);
        },

        onFilter: function (e) {
            //DETERMINE FILTER FROM SELECTION
            var filter = null;
            switch (this.selectedIndex) {
                case 0:
                    filter = {
                        field: 'qudsi',
                        operator: 'eq',
                        value: true
                    };
                    break;
                case 1:
                    filter = {
                        field: 'nawawi',
                        operator: 'eq',
                        value: true
                    };
                    break;
            }

            //APPLY FILTER TO DATASOURCE
            context.dataSource.query({
                filter: filter,
                sort: [
                    {
                        field: 'qudsi',
                        dir: 'desc'
                    },
                    {
                        field: 'nawawi',
                        dir: 'desc'
                    },
                    {
                        field: 'title',
                        dir: 'asc'
                    }
                ]
            });

            //RESET SEARCH INPUT
            context.view.element.find('[type="search"]').val('');

            //SCROLL TO TOP ON PAGE LOAD
            context.view.scroller.reset();
        },

        onModalOpen: function (e) {
            var me = this;

            //INITIALIZE VARIABLES
            var id = parseInt(e.target.closest('a').data('hadith-id'));
            var title = e.target.closest('a').text();

            Api.getHadith(id)
                .done(function (data) {
                    //CONSTRUCT CONTENT
                    var content;
                    if (title == 'References') {
                        content = 'Sources: ' + data.source;

                        //ADD NOTES IF AVAILABLE
                        if (data.note)
                            content = data.note + '<br /><br />' + content;
                    } else if (title == 'Arabic') {
                        content = '<p class="arabic panel-container success">' + data.arabic + '</p>';
                    }

                    //PASS VARIABLES TO BASE FOR PROCESSING
                    BaseView.fn.onModalOpen.call(me, e, title, content);
                });
        },

        toggleFavorite: function (e) {
            var me = this;
            var id = parseInt(e.button.data('hadith-id'));

            //GET REQUESTED ITEM
            Api.getHadith(id)
                .done(function (data) {
                    var template = kendo.template('<em>#= name #:</em><br /><span>#= summary #</span>');

                    //EXTEND DATA
                    data.summary = _.truncate(data.translation, 150);

                    //UPDATE FAVORITE BUTTON
                    BaseView.fn.toggleFavorite.call(me, context, null, {
                        id: id,
                        type: 'Hadiths',
                        name: template(data),
                        description: data.translation,
                        url: null
                    });
                });
        },

        isFavorite: function (id) {
            return Api.isFavorite({
                id: id,
                type: 'Hadiths'
            });
        }

    });

    //RETURN VIEW
    return new View();
});