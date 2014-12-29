/**
 * Created by tan on 14-12-29.
 */

define([
    "jquery",
    "eventMgr",
    "text!html/bodyEditor.html"
], function($, eventMgr, bodyEditorHTML) {
    document.body.innerHTML = bodyEditorHTML;
    alert(bodyEditorHTML)
});