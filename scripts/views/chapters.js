/**
 * This is a chapters view
 */
define([
    'views/baseview',
    'text!../../views/chapters/_list.html',
    'data/datasourcechapters'
], function (BaseView, listTemplate) {
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
            //BIND CHAPTERS TO LIST
            e.view.element.find('.listview').kendoMobileListView({
                dataSource: new kendo.ui.DataSourceChapters(),
                template: listTemplate,
                endlessScroll: true,
                virtualViewSize: 10,
                filterable: {
                    field: 'name',
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

            //SCROLL TO TOP ON PAGE LOAD
            e.view.scroller.reset();

            //INITIALIZE FAVORITES COUNT
            BaseView.fn.updateFavoritesDisplay.call(this, e);
        },

        onPopOverShow: function (e) {
            //SELECT FIRST BUTTON AS DEFAULT
            e.view.element.find('.km-listview input[value="id"]')
                .prop('checked', true);
        },

        onSort: function (e) {
            var value = e.item.find('input').val();

            //APPLY FILTER TO DATASOURCE
            context.dataSource.query({
                sort: [
                    {
                        field: value,
                        dir: 'asc'
                    },
                    {
                        field: 'id',
                        dir: 'asc'
                    }
                ]
            });

            //CLOSE POPOVER
            $('[data-role="popover"]')
                .data("kendoMobilePopOver")
                .close();

            //RESET SEARCH INPUT
            context.view.element.find('[type="search"]').val('');
        },

        reset: function (e) {
            //CALL BASE METHOD
            BaseView.fn.reset.call(this, e);

            //RESET QUERY ON DATASOURCE
            context.dataSource.query({
                sort: [{
                    field: 'id',
                    dir: 'asc'
                }]
            });

            //RESET SORT INPUT
            $('[data-role="popover"] input[value="id"]').prop('checked', true);

            //RESET SEARCH INPUT
            e.view.element.find('[type="search"]').val('');
        }

    });

    //RETURN VIEW
    return new View();
});