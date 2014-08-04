define([
	'jquery',
	'toastr',
    'spin'
], function ($, toastr, Spinner) {
    var spinner;

    return {
        spinnerDefaults: {
            lines: 13, // The number of lines to draw
            length: 20, // The length of each line
            width: 10, // The line thickness
            radius: 30, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1, // Rounds per second
            trail: 60, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        },

        initLoading: function (message, timeout) {
            App.mobile.showLoading();
        },

        exitLoading: function () {
            App.mobile.hideLoading();
        },

        initSpinner: function () {
            //ASSIGN DEFAULT VALUES
            var settings = $.extend(this.spinnerDefaults, {
                top: $(document).height() / 2 + 'px'
            });

            //CREATE SPINNER CONTAINER IF APPLICABLE
            if (!$('#spinner-container').length)
                $('body').prepend('<div id="spinner-container"></div>');

            //CREATE CUSTOM SPINNER IF NEEDED:
            //http://fgnass.github.io/spin.js/
            if (!spinner)
                spinner = new Spinner(settings).spin(document.getElementById('spinner-container'));
        },

        exitSpinner: function () {
            if (spinner) {
                spinner.stop();
                spinner = null;
            }
        },

        success: function (message, title) {
            toastr.success(message, title);
        },

        info: function (message, title) {
            toastr.info(message, title);
        },

        warning: function (message, title, icon, timeout) {
            toastr.warning(message, title);
        },

        error: function (message, title) {
            toastr.error(message, title);
        }
    };
});