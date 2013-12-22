/**
 * This is the storage
 */
define([
    'jquery',
    'underscore',
    'moment',
    'lostorage',
    'localstoragedb',
    'utils/helpers'
], function ($, _, moment, loStorage, localStorageDB, Helpers) {
    //PRIVATE PROPERTIES
    var database;

    var initDatabase = function () {
        //INITALIZE DATABASE AS LOCAL STORAGE
        if (!database)
            database = new localStorageDB('app', localStorage);
    };

    var get = function (key, filter, options) {
        options = options || {};

        //GET LOCAL OR REMOTE DATA IF APPLICABLE
        if (options.local !== false) {
            //USE LOCAL STORAGE
            return getAll(key, filter, options)
                .then(function (data) {
                    return data.length ? data[0] : null;
                });
        } else {
            //DETERMINE SERVICE URL TO GET DATA
            var serviceUrl = options.remoteUrl
                || Helpers.toServicesUrl(options.service || key);

            //GET REMOTE DATA
            return $.get(serviceUrl);
        }
    };

    var getAll = function (key, filter, options) {
        var defer = new $.Deferred();
        options = options || {};

        //INITIALIZE DATABASE FOR LATER USE
        initDatabase();

        //ACTION TO GET DATA FOR LATER USE
        var getData = function () {
            if (options.local !== false && database.tableExists(key)) {
                //PASS RESPONSE TO CALLBACK
                defer.resolve(database.query(key, buildQuery()));
            } else {
                //DETERMINE SERVICE URL TO GET DATA
                var serviceUrl = options.remoteUrl
                    || Helpers.toServicesUrl(options.service || key);

                //GET REMOTE DATA
                $.get(serviceUrl).done(function (data) {
                    //CREATE TABLE IF APPLICABLE
                    if (data && data.length) {
                        if (options.local !== false) {
                            //CREATE TABLE SCHEMA BASED ON FIELD NAMES
                            database.createTable(key, _.keys(data[0]));

                            //INSERT EACH RECORD
                            _.each(data, function (item) {
                                //ADD DATA TO TABLE
                                database.insert(key, item);
                            });

                            //PERSIST TO LOCAL STORAGE
                            database.commit();

                            //PASS RESPONSE TO CALLBACK
                            defer.resolve(database.query(key, buildQuery()));
                        } else {
                            //PASS RESPONSE TO CALLBACK
                            defer.resolve(filter ? _.where(data, buildQuery()) : data);
                        }
                    }
                }).fail(function () {
                    defer.reject();
                });
            }
        };

        //CONVERT FILTER TO OVERLOADED QUERY
        var buildQuery = function () {
            //CONSTRUCT FILTER BASED ON PARAMETER
            if (!filter || _.isObject(filter)) return filter;
            else if (options.primaryKey) {
                //CREATE FILTER QUERY
                var query = {};
                query[options.primaryKey] = filter;

                //RETURN QUERY
                return query;
            } else return { id: filter };
        };

        //HANDLE MODIFIED AND ONLINE/OFFLINE DATA
        if (options.local !== false && navigator.onLine) {
            //DETERMINE TABLE FRESHNESS FOR CLEARING CACHE
            $.get(options.modifiedUrl || Helpers.toServicesUrl('lastmodified/' + key))
                .done(function (data) {
                    var loTimestampKey = key + '-modified';
                    var loTimestamp = loStorage.storage.get(loTimestampKey);

                    //CLEAR CACHE IF APPLICABLE
                    if (!loTimestamp || moment(data.last_modified) < moment(loTimestamp)) {
                        //STORE DATA IN LOCAL STORAGE AND TIMESTAMP
                        loStorage.storage.set(loTimestampKey, data.last_modified);

                        //CLEAR STALE CACHE IF APPLICABLE
                        if (database.tableExists(key))
                            database.dropTable(key);
                    }

                    //GET DATA FRESH FROM STORAGE
                    getData();
                });
        } else getData();

        return defer.promise();
    };

    var localStorageExists = function (key) {
        return loStorage.storage.get(key);
    };

    var localStorageUsed = function () {
        var allStrings = '';
        for (var key in window.localStorage) {
            if (window.localStorage.hasOwnProperty(key)) {
                allStrings += window.localStorage[key];
            }
        }

        //CALCULATE KB OF SPACE USE
        return allStrings ? 3 + ((allStrings.length * 16) / (8 * 1024)) : 0;
    };

    //PUBLIC PROPERTIES
    return {
        get: get,
        getAll: getAll,
        localStorageExists: localStorageExists,
        localStorageUsed: localStorageUsed
    };
});