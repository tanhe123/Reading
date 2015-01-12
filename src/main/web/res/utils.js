/**
 * Created by tan on 15-1-8.
 */

define([], function() {
    var utils = {};

    // Faster than setTimeout (see http://dbaron.org/log/20100309-faster-timeouts)
    utils.defer = (function() {
        var timeouts = [];
        var messageName = "deferMsg";
        window.addEventListener("message", function(evt) {
            if(evt.source == window && evt.data == messageName) {
                evt.stopPropagation();
                if(timeouts.length > 0) {
                    timeouts.shift()();
                }
            }
        }, true);
        return function(fn) {
            timeouts.push(fn);
            window.postMessage(messageName, "*");
        };
    })();

    // Implements underscore debounce using our defer function
    utils.debounce = function(func, context) {
        var isExpected = false;

        function later() {
            isExpected = false;
            func.call(context);
        }

        return function() {
            if(isExpected === true) {
                return;
            }
            isExpected = true;
            utils.defer(later);
        };
    };

    return utils;
});