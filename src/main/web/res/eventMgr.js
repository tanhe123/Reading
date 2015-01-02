/**
 * Created by tan on 14-12-29.
 */
define([
    "jquery",
    "underscore",
    "classes/Extension",
    "extensions/markdownSectionParser",
    "bootstrap"
], function($, _, Extension) {

    var eventMgr = {};

    // Create a list of extensions from module arguments
    var extensionList = _.chain(arguments).map(function (argument) {
        // 这里可以参考 http://www.tuicool.com/articles/uMN7Nfv
        return argument instanceof Extension && argument;

        // compact 返回一个除去所有false值的 array副本。 在javascript中, false, null, 0, "", undefined 和 NaN 都是false值.
        // 可以参考 http://www.css88.com/doc/underscore/#compact
    }).compact().value();

    // Configure extensions

    // Returns all listeners with the specified name that are implemented in the
    // enabled extensions
    function getExtensionListenerList(eventName) {
        return _.chain(extensionList).map(function (extension) {
            return extension.enabled && extension[eventName];
        }).compact().value();
    }

    // Returns a function that calls every listeners with the specified name
    // from all enabled extensions
    var eventListenerListMap = {};

    function createEventHook(eventName) {
        eventListenerListMap[eventName] = getExtensionListenerList(eventName);
        return function () {
            var eventArguments = arguments;
            _.each(eventListenerListMap[eventName], function (listener) {
                try {
                    listener.apply(null, arguments);
                } catch (e) {
                    console.error(_.isObject(e) ? e.stack : e);
                }
            })
        }
    }

    // Declare an event Hook in the eventMgr that we can fire using eventMgr.eventName()
    // eventMrg[onReady] = new function() {};
    // 可以表示为 {onReady : function() {}};
    // 因此可以这样调用 eventMgr.onReady();
    function addEventHook(eventName) {
        eventMgr[eventName] = createEventHook(eventName);
    }

    // Used by external modules (not extensions) to listen to events
    eventMgr.addListener = function (eventName, listener) {
        try {
            // 可能没有对应的 event listener
            eventListenerListMap[eventName].push(listener);
        } catch (e) {
            console.error('No event listener called' + eventName);
        }
    };

    // Call every onInit listeners (enabled extensions only)
    createEventHook("onInit()")();

    // Load/Save extension config from/to settings

    addEventHook("onMessage");
    addEventHook("onError");
    addEventHook("onOfflineChanged");
    addEventHook("onUserActive");
    addEventHook("onAsyncRunning");
    addEventHook("onPeriodicRun");

    // To access modules that are loaded after extensions
    addEventHook("onEditorCreated");
    addEventHook("onFileMgrCreated");
    addEventHook("onSynchronizerCreated");
    addEventHook("onPublisherCreated");
    addEventHook("onSharingCreated");
    addEventHook("onEventMgrCreated");

    // Operations on files
    addEventHook("onFileCreated");
    addEventHook("onFileDeleted");
    addEventHook("onFileSelected");
    addEventHook("onFileOpen");
    addEventHook("onFileClosed");
    addEventHook("onContentChanged");
    addEventHook("onTitleChanged");

    // Operations on folders
    addEventHook("onFoldersChanged");

    // Sync events
    addEventHook("onSyncRunning");
    addEventHook("onSyncSuccess");
    addEventHook("onSyncImportSuccess");
    addEventHook("onSyncExportSuccess");
    addEventHook("onSyncRemoved");

    // Publish events
    addEventHook("onPublishRunning");
    addEventHook("onPublishSuccess");
    addEventHook("onNewPublishSuccess");
    addEventHook("onPublishRemoved");

    // Operations on Layout
    addEventHook("onLayoutCreated");
    addEventHook("onLayoutResize");
    addEventHook("onExtensionButtonResize");

    // Operations on editor
    addEventHook("onPagedownConfigure");
    addEventHook("onSectionsCreated");
    addEventHook("onCursorCoordinates");
    addEventHook("onEditorPopover");

    // Operations on comments
    addEventHook("onDiscussionCreated");
    addEventHook("onDiscussionRemoved");
    addEventHook("onCommentsChanged");

    // Refresh twitter buttons
    addEventHook("onTweet");

    //todo: 省略 onPreviewFinished onAsyncPreview

    // 如果 eventMgr 声明了同名函数，则需要自己调用
    var onReady = createEventHook("onReady");
    eventMgr.onReady = function () {



        onReady();
    };

    // For extensions that need to call other extensions
    eventMgr.onEventMgrCreated(eventMgr);

    return eventMgr;
});