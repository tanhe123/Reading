/**
 * Created by tan on 15-1-2.
 */
define([
    "underscore",
    "classes/Extension"
], function(_, Extension) {

    var markdownSectionParser = new Extension("markdownSectionParser", "Markdown section parser");

    var sectionList = [];
    var previewContentsElt;

    //todo: 假定为 true, 最终应该是从配置中读取
    markdownSectionParser.enabled = true;

    // Regexp to look for section delimiters
    var regexp = '^.+[ \\t]*\\n=+[ \\t]*\\n+|^.+[ \\t]*\\n-+[ \\t]*\\n+|^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'; // Title delimiters

    markdownSectionParser.onReady = function() {
        previewContentsElt = document.getElementById("preview-contents");
        console.log(previewContentsElt);
    };

    return markdownSectionParser;
});