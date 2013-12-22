/**
 * This is a helper utils module
 */
define([
	'jquery',
    'utils/helpers',
    'utils/alerts'
], function ($, Helpers, Alerts) {

    //LOADS VIEW AND POPULATES WITH DATA
    $.fn.loadView = function (options) {
        var me = this;
        var defer = new $.Deferred();

        //ASSIGN DEFAULT VALUES
        var settings = $.extend({
            loading: false
        }, options);

        //ACTIVATE LOADING PANEL IF APPLICABLE
        if (settings.loading) Alerts.initLoading();

        //GET VIEW VIA AJAX
        $.get(settings.url, function (frag) {
            //INITALIZE CONTENT
            var content = settings.data
                ? kendo.template(frag)(settings.data)
                : frag;

            //LOAD DATA INTO VIEW AND MOBILE ENHANCE IT
            me.html(content);

            //ENABLE CHAINING AND PASS TO CALLBACK
            defer.resolve(me);
        }).fail(function () {
            defer.reject();
        }).always(function () {
            //DEACTIVATE LOADING PANEL IF APPLICABLE
            if (settings.loading) Alerts.exitLoading();
        });

        return defer.promise();
    };

    //MODIFY QUERY STRING OF LINKS
    $.fn.queryString = function (data) {
        //UPDATE LINKS BASED ON DATA PROPERTIES
        for (var prop in data) {
            this.each(function() {
                var value = $(this).attr('href');
                $(this).attr('href', Helpers.updateQueryString(value, prop, data[prop]));
            });
        }
    };
});
