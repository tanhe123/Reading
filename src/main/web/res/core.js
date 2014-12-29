/**
 * Created by tan on 14-12-29.
 */

define([
    "jquery",
    "eventMgr",
    "text!html/bodyEditor.html",
    "pagedown"
], function($, eventMgr, bodyEditorHTML) {

    var core = {};

    document.body.innerHTML = bodyEditorHTML;

    // Create the PageDown editor
    var pagedownEditor;

    core.initEditor = function() {
        // Create the converter and the editor
        var converter = new Markdown.Converter();
        //var converter = Markdown.getSanitizingConverter();
        pagedownEditor = new Markdown.Editor(converter);

        pagedownEditor.run();
    };

    core.initEditor();

    return core;
});