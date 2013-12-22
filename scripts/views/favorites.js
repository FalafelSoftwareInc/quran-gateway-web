/**
 * This is a favorites view
 */
define([
    'underscore',
    'api',
    'views/baseview',
    'text!../../views/favorites/_list.html',
    'data/datasourcefavorites'
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
                dataSource: new kendo.ui.DataSourceFavorites,
                template: listTemplate,
                fixedHeaders: true,
                autoBind: false
            });
        },

        onShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //CACHE DATASOURCE FOR LATER USE
            context.dataSource = e.view.element.find('.listview')
                .data('kendoMobileListView')
                .dataSource;

            //REFRESH DATA VIEW
            context.dataSource.read();

            //SCROLL TO TOP ON PAGE LOAD
            e.view.scroller.reset();

            //INITIALIZE FAVORITES COUNT
            BaseView.fn.updateFavoritesDisplay.call(this, e);
        },

        onModalOpen: function (e) {
            var me = this;

            //INITIALIZE VARIABLES
            var btn = e.target.closest('a');
            var data = Api.getFavorite({
                id: btn.data('favorite-id'),
                type: btn.data('favorite-type')
            });
            var name = _.truncate(_.stripTags(data.name), 18);

            //PASS VARIABLES TO BASE FOR PROCESSING
            BaseView.fn.onModalOpen.call(me, e, name, data.description);
        }

    });

    //RETURN VIEW
    return new View();
});