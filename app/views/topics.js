/**
 * This is a topics view
 */
define([
    'views/baseview',
    'text!../../views/topics/_list.html',
    'data/datasourcetopics'
], function (BaseView, listTemplate) {

    var View = BaseView.extend({

        //EVENTS
        onInit: function () {
            this.element.find('.listview').kendoMobileListView({
                dataSource: new kendo.ui.DataSourceTopics(),
                template: listTemplate
            });
        }

    });

    //RETURN VIEW
    return new View();
});