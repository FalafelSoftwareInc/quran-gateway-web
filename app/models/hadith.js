/**
 * This is a hadith model module
 */
define([], function () {

    //RETURN MODEL FOR CHAPTER
    return kendo.data.Model.define({
        id: 'id',
        fields: {
            id: { type: 'number' },
            name: { type: 'string' },
            translation: { type: 'string' },
            arabic: { type: 'string' },
            //sunnah: { type: 'boolean' },
            //qudsi: { type: 'boolean' },
            //nawawi: { type: 'boolean' },
            //supplication: { type: 'boolean' },
            note: { type: 'string' },
            source: { type: 'string' }
        }
    });
});
