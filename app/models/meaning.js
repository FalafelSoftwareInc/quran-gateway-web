/**
 * This is a meaning model module
 */
define([], function () {

    //RETURN MODEL FOR CHAPTER
    return kendo.data.Model.define({
        id: 'id',
        fields: {
            id: { type: 'number' },
            chapter: { type: 'number' },
            start: { type: 'number' },
            end: { type: 'number' },
            description: { type: 'string' },
            arabic: { type: 'string' },
            //exegesis: { type: 'boolean' },
            //lecture: { type: 'boolean' },
            source: { type: 'string' }
        }
    });
});
