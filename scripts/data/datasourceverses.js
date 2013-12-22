/**
 * Base class for Kendo data source for verses
 */
define([
    'underscore',
    'api',
    'models/verse'
], function (_, Api, Model) {

    //EXTEND KENDO DATA SOURCE
    var DataSource = kendo.data.DataSource.extend({

        init: function (element, options) {
            //BASE CALL TO WIDGET INITIALIZATION
            kendo.data.DataSource.fn.init.call(this, element, options);
        },

        options: {
            //THE NAME IS WHAT IT WILL APPEAR AS OFF THE KENDO NAMESPACE (i.e. kendo.ui.YouTube)
            //THE JQUERY PLUGIN WOULD BE jQuery.fn.kendoYouTube
            //http://www.kendoui.com/blogs/teamblog/posts/12-04-03/creating_custom_kendo_ui_plugins.aspx
            name: 'DataSourceVerses',
            transport: {
                read: function (options) {
                    Api.getVerses()
                        .done(function (data) {
                            //MANIPULATE DATA
                            _.each(data, function (item) {
                                //TRUNCATE FOR DYNAMIC SUMMARY FIELD
                                item.summary = _.truncate(item.translation, 150);
                            })

                            //SEND BACK TO KENDO DATA SOURCE
                            options.success(data);
                        });
                }
            },
            schema: {
                model: Model
            },
            group: 'chapter',
            sort: [
                {
                    field: 'chapter',
                    dir: 'asc'
                },
                {
                    field: 'start',
                    dir: 'asc'
                }
            ]
        }
    });

    kendo.ui.plugin(DataSource);

    return {}
});