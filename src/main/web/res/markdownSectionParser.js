/**
 * Created by tan on 15-4-17.
 */
define(["underscore", "partialRendering"], function(_, partialRendering) {

    var markdownSectionParser = {};

    var sectionList = [];

    // Regexp to look for section delimiters
    var regexp = '^.+[ \\t]*\\n=+[ \\t]*\\n+|^.+[ \\t]*\\n-+[ \\t]*\\n+|^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'; // Title delimiters

    function onContentChanged(text) {
        text += "\n\n";

        // Strip link definitions
        var linkDefinition = "";
        text = text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?(?=\s|$)[ \t]*\n?[ \t]*((\n*)["(](.+?)[")][ \t]*)?(?:\n+)/gm, function(wholeMatch) {
            linkDefinition += wholeMatch;
            return "";
        });

        // Look for titles
        var newSectionList = [];
        var offset = 0;
        text.replace(/^```.*\n[\s\S]*?\n```|(^.+[ \t]*\n=+[ \t]*\n+|^.+[ \t]*\n-+[ \t]*\n+|^\#{1,6}[ \t]*.+?[ \t]*\#*\n+)/gm, function(match, title, matchOffset) {
            if(title) {
                // We just found a title which means end of the previous section
                if(matchOffset > offset) {
                    newSectionList.push(text.substring(offset, matchOffset) + "\n" + linkDefinition);
                    offset = matchOffset;
                }
            }
            return "";
        });
        // Last section
        newSectionList.push(text.substring(offset, text.length) + linkDefinition);

        sectionList = newSectionList;

        // todo: 通知其他的插件, sectionList 完成了
        partialRendering.onSectionsCreated(sectionList);
    }

    markdownSectionParser.init = function (editor) {
        var converter = editor.getConverter();
        converter.hooks.chain("preConversion", function(text) {
            console.log("markdownSectionParser: " + text);

            onContentChanged(text);
            return text;
        });
    };

    //markdownSectionParser.onContentChanged = onContentChanged;

    return markdownSectionParser;
});