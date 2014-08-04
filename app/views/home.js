/**
 * This is a home view
 */
define([
    'api',
    'views/baseview'
], function (Api, BaseView) {
    var context = null;

    var View = BaseView.extend({
        view: null,

        //CONSTRUCTOR
        init: function () {
            BaseView.fn.init.call(this);

            //CACHE CONTEXT FOR LATER
            context = this;
        },

        //EVENTS
        onShow: function (e) {
            //CACHE VIEW FOR LATER USE
            context.view = e.view;

            //SCROLL TO FIRST PAGE
            e.view.element.find('.km-scrollview')
                .data('kendoMobileScrollView')
                .scrollTo(0);

            //INITIALIZE CHARTS
            context.loadProgress('recitation');
            context.loadProgress('memorization');
            context.loadProgress('names99', '99 Names');
            context.loadProgress('understanding', 'Understand');
            context.loadProgress('supplications');
            context.loadProgress('prayers');
            context.loadProgress('fasting');
            context.loadProgress('charity');
            context.loadProgress('sunnah');

            //CENTER CHARTS
            var spaceRemainder = e.view.element.find('.progress-wrapper').width()
                % e.view.element.find('.k-chart').width();
            e.view.element.find('.progress-wrapper').css('padding-left', (spaceRemainder / 2) + 'px');

            //INITIALIZE RANDOM VERSE
            Api.getVerses()
                .done(function (data) {
                    //GET RANDOM
                    var index = Math.floor(Math.random() * data.length);

                    //BIND CONTENT
                    var range = data[index].start;
                    if (data[index].end) range += '-' + data[index].end;
                    var location = ' [Quran, ' + data[index].chapter + ':' + range + ']';
                    e.view.element.find('.verse .title').html('Verse of the Day:');
                    e.view.element.find('.verse .translation').html(data[index].translation + location);
                });

            //INITIALIZE RANDOM VERSE
            Api.getHadiths()
                .done(function (data) {
                    //GET RANDOM
                    var index = Math.floor(Math.random() * data.length);

                    //BIND CONTENT
                    e.view.element.find('.hadith .title').html('Hadith of the Day:');
                    e.view.element.find('.hadith .translation').html(data[index].translation);
                });

            //INITIALIZE FAVORITES COUNT
            BaseView.fn.updateFavoritesDisplay.call(this, e);

            //DISPLAY WELCOME SCREEN IF APPLICABLE
            if (Api.getEnableInstructions())
                $('#getting-started-modal').getKendoMobileModalView().open();
        },

        onModalConfirm: function (e) {
            //DISABLE INSTRUCTIONS
            Api.setEnableInstructions(false);

            //GET MODAL
            var modal = e.target.closest('.km-modalview')
                .data('kendoMobileModalView');

            //CLOSE MODAL
            modal.close();
        },

        loadProgress: function (key, title) {
            //SET PIE VALUES
            var perUnit = 100 / (Api.getProgress(key).total || 1);
            var amount = Api.getProgress(key).complete.length * perUnit;
            var data = [amount || 1, (100 - amount)];

            //SET COLOR BASED ON VALUE
            var color = data[0] > 60 ? '#10c4b2'
                : data[0] > 30 ? '#ffb74f'
                : '#ff7663';

            //INITIALIZE CHART
            context.view.element.find('.chart-' + key).kendoChart({
                title: {
                    text: title || (key.charAt(0).toUpperCase() + key.slice(1))
                },
                legend: {
                    position: 'top'
                },
                chartArea: {
                    background: 'transparent'
                },
                series: [{
                    data: data
                }],
                seriesDefaults: {
                    type: 'pie',
                    padding: 0
                },
                seriesColors: [color, '#ccc'],
                seriesClick: function (e) {
                    App.mobile.navigate('views/progress/' + key + '.html');
                },
                tooltip: {
                    visible: false
                }
            });
        }

    });

    //RETURN VIEW
    return new View();
});