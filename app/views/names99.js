/**
 * This is a names99 view
 */
define([
    'api',
    'views/baseview',
    'text!../../views/names99/_list.html',
    'data/datasourcenames99'
], function (Api, BaseView, listTemplate) {
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
        onInit: function () {
            //CREATE LIST VIEW
            this.element.find('.listview').kendoMobileListView({
                dataSource: new kendo.ui.DataSourceNames99(),
                template: listTemplate,
                endlessScroll: true,
                virtualViewSize: 20
            });
        },

        onShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //INITIALIZE FAVORITES COUNT
            BaseView.fn.updateFavoritesDisplay.call(this, e);
        },

        toggleFavorite: function (e) {
            var me = this;
            var id = parseInt(e.button.data('name99-id'));

            //GET REQUESTED ITEM
            Api.getName99(id)
                .done(function (data) {
                    var template = kendo.template('<span>#= name # - #= arabic #</span>');

                    //UPDATE FAVORITE BUTTON
                    BaseView.fn.toggleFavorite.call(me, context, null, {
                        id: id,
                        type: 'Names of Allah',
                        name: template(data),
                        description: null,
                        url: null
                    });
                });
        },

        isFavorite: function (id) {
            return Api.isFavorite({
                id: parseInt(id),
                type: 'Names of Allah'
            });
        }

    });

    //RETURN VIEW
    return new View();
});