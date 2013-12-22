/**
 * This is a chapter model module
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
            verses: { type: 'number' },
            chronology: { type: 'number' },
            virtues: { type: 'string' },
            period: { type: 'string' },
            period_exceptions: { type: 'string' },
            juz: { type: 'number' },
            sajdah: { type: 'string' }
        }
    });
});
