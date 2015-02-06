/**
 * Created by tan on 15-2-6.
 */

define([], function() {
    var Notebook = {};

    Notebook.queryNotebooks = function (callback) {
        $.getJSON("/notebook", function (rsNotebooks) {
            if (callback) {
                callback(rsNotebooks);
            }
        });
    };

    return Notebook;
});