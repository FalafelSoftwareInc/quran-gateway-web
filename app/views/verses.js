/**
 * This is a verses view
 */
define([
    'underscore',
    'api',
    'views/baseview',
    'text!../../views/verses/_list.html',
    'data/datasourceverses'
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
            //BIND LIST
            e.view.element.find('.listview').kendoMobileListView({
                template: listTemplate,
                headerTemplate: 'Chapter #= value #',
                fixedHeaders: true
                /*TODO: DOES NOT WORK WITH ANY APPLIED FILTERS
                filterable: {
                    field: 'translation',
                    operator: 'contains',
                    ignoreCase: true
                }*/
            });
        },

        onShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //RESET SCROLL AND MENUS IF APPLICABLE
            if (!e.view._back) {
                BaseView.fn.reset.call(this, e);
            }

            //DETERMINE FILTER FROM PARAM
            var filter = e.view.params.type ? {
                field: e.view.params.type,
                operator: 'eq',
                value: true
            } : null;

            //CACHE DATASOURCE FOR LATER USE
            context.dataSource = new kendo.ui.DataSourceVerses({
                filter: filter
            });

            //SET DATASOURCE FOR LIST
            e.view.element.find('.listview')
                .data('kendoMobileListView')
                .setDataSource(context.dataSource);
               
            //UPDATE HEADER TITLE
            e.view.header.find('[data-role="navbar"]')
                .data('kendoMobileNavBar')
                .title(decodeURIComponent(this.params.title));
        },

        getTitle: function () {
            return context.view.params.title;
        }

    });

    //RETURN VIEW
    return new View();
});