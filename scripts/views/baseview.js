/**
 * This is a base view
 */
define([
    'jquery',
    'api',
    'utils/alerts'
], function ($, Api, Alerts) {
    var context = null;

    //CREATE BASE CLASS FOR LATER INHERITANCE
    var BaseView = kendo.Class.extend({

        //CONSTRUCTOR CALLED ON NEW INSTANCES
        init: function (scope) {
            //MUST CALL BELOW IN DERIVED CLASSES IF NEEDED
            //BaseView.fn.init.call(this);
        },

        //EVENTS
        onInit: function (e) {

        },

        onBeforeShow: function (e) {

        },

        onAfterShow: function (e) {

        },

        onShow: function (e) {

        },

        onHide: function (e) {

        },

        reset: function (e, data) {
            //SCROLL TO TOP ON PAGE LOAD
            e.view.scroller.reset();

            //CLEAR ACTIVE TAB STRIP
            e.view.footer.find('[data-role="tabstrip"]')
                .data('kendoMobileTabStrip')
                .clear();

            //UPDATE FAVORITE BUTTON IF APPLICABLE
            if (data) context.toggleFavorite(e, Api.isFavorite(data));

            //INITIALIZE FAVORITES COUNT
            context.updateFavoritesDisplay.call(this, e);
        },

        toggleFavorite: function (e, toggle, data) {
            var btnFavorite = e.view.header.find('.km-button.favorite .km-icon');
            if (btnFavorite.length == 0) btnFavorite = this.element;

            //HANDLE TOGGLE VALUE IF APPLICABLE
            if (toggle == null) toggle = !Api.getFavorite(data);

            //UPDATE FAVORITE ICON
            if (toggle === true) {
                //UPDATE INTERFACE
                if (btnFavorite.length > 0) {
                    if (btnFavorite.hasClass('km-heart-empty'))
                        btnFavorite.removeClass('km-heart-empty').addClass('km-heart');
                    else if (btnFavorite.hasClass('km-rowinsert'))
                        btnFavorite.removeClass('km-rowinsert').addClass('km-rowdelete');
                }

                //ADD FAVORITE IF APPLICABLE
                if (data) {
                    Api.addFavorite(data);
                    Alerts.success('Added to favorites!');
                }
            } else if (toggle === false) {
                //UPDATE INTERFACE
                if (btnFavorite.length > 0) {
                    if (btnFavorite.hasClass('km-heart'))
                        btnFavorite.removeClass('km-heart').addClass('km-heart-empty');
                    else if (btnFavorite.hasClass('km-rowdelete'))
                        btnFavorite.removeClass('km-rowdelete').addClass('km-rowinsert');
                }

                //REMOVE FROM FAVORITE IF APPLICABLE
                if (data) {
                    Api.removeFavorite(data);
                    Alerts.warning('Removed from favorites!');
                }
            }

            //UPDATE FAVORITES TABS
            context.updateFavoritesDisplay(e);
        },

        updateFavoritesDisplay: function (e) {
            var favCount = Api.getFavorites().length;
            e.view.footer.find('[data-role="tabstrip"]')
                .data('kendoMobileTabStrip')
                .badge(3, favCount > 0 ? favCount : false);
        },

        onModalOpen: function (e, title, content) {
            //ADD TITLE TO HEADER
            if (title) {
                this.header.find('[data-role="navbar"]')
                    .data('kendoMobileNavBar')
                    .title(title);
            }

            //GET TRANSLATION AND INJECT TO DOM
            if (content)
                this.element.find('.content').html(content);
        },

        onModalClose: function (e) {
            //GET MODAL
            var modal = e.target.closest('.km-modalview')
                .data('kendoMobileModalView');

            //CLEAR CONTENT FOR NEXT REQUEST if applicable
            if (modal.element.find('.content').length) {
                modal.element.find('.content').empty();
                modal.header.find('[data-role="navbar"]')
                    .data('kendoMobileNavBar')
                    .title('');
            }

            //CLOSE MODAL
            modal.close();
        }
    });

    //STORE ORIGINAL SCOPE FOR LATER USE
    context = BaseView.fn;

    return BaseView;
});