/**
 * Created by tan on 14-12-29.
 */

define([
    "jquery",
    "text!html/bodyEditor.html"
], function($, bodyEditorHTML) {
    document.body.innerHTML = bodyEditorHTML;
});