/**
 * This is a base layout
 */
define([
    'jquery'
], function ($) {

    //CREATE BASE CLASS FOR LATER INHERITANCE
    var BaseLayout = kendo.Class.extend({

        //CONSTRUCTOR CALLED ON NEW INSTANCES
        init: function () {
            //MUST CALL BELOW IN DERIVED CLASSES IF NEEDED
            //BaseLayout.fn.init.call(this);
        },

        //EVENTS
        onInit: function (e) {

        },

        onShow: function (e) {

        },

        onHide: function (e) {

        }
    });

    return BaseLayout;
});