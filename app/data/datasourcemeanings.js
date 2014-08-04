/**
 * Base class for Kendo data source for meanings
 */
define([
    'baseresourcesurl',
    'api',
    'models/meaning'
], function (baseResourcesUrl, Api, Model) {
    var context = null;

    //EXTEND KENDO DATA SOURCE
    var DataSource = kendo.data.DataSource.extend({

        init: function (element, options) {
            //BASE CALL TO WIDGET INITIALIZATION
            kendo.data.DataSource.fn.init.call(this, element, options);

            //CACHE CONTEXT FOR LATER
            context = this;
        },

        options: {
            //THE NAME IS WHAT IT WILL APPEAR AS OFF THE KENDO NAMESPACE (i.e. kendo.ui.YouTube)
            //THE JQUERY PLUGIN WOULD BE jQuery.fn.kendoYouTube
            //http://www.kendoui.com/blogs/teamblog/posts/12-04-03/creating_custom_kendo_ui_plugins.aspx
            name: 'DataSourceMeanings',
            chapter: null,
            transport: {
                read: function (options) {
                    if (context.options.chapter) {
                        Api.getMeaningsByChapter(context.options.chapter)
                            .done(function (data) {
                                //SEND BACK TO KENDO DATA SOURCE
                                options.success(data);
                            });
                    }
                }
            },
            schema: {
                model: Model
            }
        }
    });

    kendo.ui.plugin(DataSource);

    return {}
});