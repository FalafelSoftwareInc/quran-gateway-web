/**
 * This is a progress view
 */
define([
    'api',
    'views/baseview',
    'text!../../views/progress/_chapters.html',
    'text!../../views/progress/_names99.html',
    'data/datasourcechapters'
], function (Api, BaseView, chaptersTemplate, names99Template) {
    var context = null;

    var View = BaseView.extend({

        //CONSTRUCTOR
        init: function () {
            BaseView.fn.init.call(this);

            //CACHE CONTEXT FOR LATER
            context = this;
        },

        //PAGE EVENTS
        onShow: function (e) {
            //GET LIST VIEW
            var listview = e.view.element.find('.km-listview')
                .data('kendoMobileListView');

            //BIND EVENTS
            listview.bind('click', context.onClick);
            context.onDataBound({ sender: listview }); //MANUALLY TRIGGER

            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e);
        },

        onChaptersShow: function (e) {
            //BIND DATA SOURCE
            e.view.element.find('.listview').kendoMobileListView({
                dataSource: new kendo.ui.DataSourceChapters(),
                template: chaptersTemplate,
                style: 'inset',
                click: context.onClick,
                dataBound: context.onDataBound
            });

            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e);
        },

        onNames99Show: function (e) {
            //BIND DATA SOURCE
            e.view.element.find('.listview').kendoMobileListView({
                dataSource: new kendo.ui.DataSourceNames99(),
                template: names99Template,
                style: 'inset',
                click: context.onClick,
                dataBound: context.onDataBound
            });

            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e);
        },

        onMemorizationFilter: function (e) {
            var redirect = e.sender.selectedIndex == 0
                ? 'views/progress/memorization.html'
                : 'views/progress/names99.html';

            //REDIRECT TO PAGE
            App.mobile.navigate(redirect);
        },

        //WIDGET EVENTS
        onClick: function (e) {
            var value = e.item.find('input').attr('name');
            if (value) {
                //GET PROGRESS TYPE
                var key = e.item.closest('ul').data('progress');

                //MODIFY PROGRESS BASED ON SELECTION
                var checked = !e.item.find('input[type="checkbox"]').is(':checked');
                if (checked) Api.addProgress(key, value);
                else Api.removeProgress(key, value);
            }
        },

        onDataBound: function (e) {
            //GET PROGRESS TYPE
            var key = e.sender.element.data('progress');

            //CHECK INPUTS BASED ON INPUT
            $.each(Api.getProgress(key).complete, function (index, item) {
                e.sender.element.find('input[name="' + item + '"]').prop('checked', true);
            });

            //STORE TOTAL FOR LATER PROGRESS
            Api.totalProgress(key, e.sender.element.find('input[type="checkbox"]').length);
        }

    });

    //RETURN VIEW
    return new View();
});