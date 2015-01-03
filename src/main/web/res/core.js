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

    core.initEditor = function() {
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


    // todo: 还没有解决 运行 时 value 为空的问题
    //core.initEditor();

    return core;
});