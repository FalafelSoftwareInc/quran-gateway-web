/**
 * This is a ummah view
 */
define([
    'views/baseview'
], function (BaseView) {

    var View = BaseView.extend({

        //EVENTS
        onShow: function (e) {
            //RESET SCROLL AND MENUS
            BaseView.fn.reset.call(this, e);
        }

    });

    //RETURN VIEW
    return new View();
});