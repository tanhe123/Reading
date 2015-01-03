/**
 * Created by tan on 14-12-29.
 */

define([
    "jquery",
    'editor',
    "eventMgr",
    'layout',
    "text!html/bodyEditor.html",
    "pagedown"
], function($, editor, eventMgr, layout, bodyEditorHTML) {

    var core = {};

    document.body.innerHTML = bodyEditorHTML;

    // Create the PageDown editor
    var pagedownEditor;
    var fileDesc;
    core.initEditor = function(fileDescParam) {
        console.log("core: initEditor");

/*
        if(fileDesc !== undefined) {
            eventMgr.onFileClosed(fileDesc);
        }
*/

        fileDesc = fileDescParam;

        // Create the converter and the editor
        var converter = new Markdown.Converter();
        //var converter = Markdown.getSanitizingConverter();
        pagedownEditor = new Markdown.Editor(converter);

        eventMgr.onPagedownConfigure(pagedownEditor);

        pagedownEditor.run();
    };

    // Initialize multiple things and then fire eventMgr.onReady
    core.onReady = function() {

        layout.init();
        editor.init();

        eventMgr.onReady();
    };

    return core;
});