/**
 * Base class for Kendo data source for favorites
 */
define([
    'underscore',
    'api'
], function (_, Api) {

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
            name: 'DataSourceFavorites',
            transport: {
                read: function (options) {
                    //SEND BACK TO KENDO DATA SOURCE
                    options.success(Api.getFavorites());
                }
            },
            group: {
                field: 'type'
            },
            sort: {
                field: 'id',
                dir: 'asc'
            }
        }
    });

    kendo.ui.plugin(DataSource);

    return {}
});