/**
 * Created by tan on 15-3-20.
 */
define(["jquery", "underscore"], function ($, _) {

    // todo markdown.editor.js中的渲染就没有意义了

    var partialRendering = {};

    var convert = undefined;

    var sectionList = [];
    var convertedSectionsList = [];

    //var hasFootnotes = false;

    function extractSections(text) {
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
    }

    var isRendering = false;
    function renderSections() {
        // Renders sections
        isRendering = true;
        //调用 convert 将 markdown转换成 html
        convertedSectionsList = _.map(sectionList, converter.makeHtml);
        isRendering = false;

        $("#wmd-preview").html(convertedSectionsList.join(""));

        // todo: Move footnotes in the footer...
        /*if(hasFootnotes === true) {
            // Recreate a footnote list
            var footnoteElts = $("<ol>");
            $("#wmd-preview > div.footnotes > ol > li").each(function(index) {
                hasFootnotes = true;
                var elt = $(this);
                footnoteElts.append(elt);
                // Restore footnotes numbers
                var refId = "#fnref\\:" + elt.attr("id").substring(3);
                $(refId).text(index + 1);
            });
            // Append the whole footnotes at the end of the document
            $("#wmd-preview > div.footnotes").remove();
            $("#wmd-preview").append($('<div class="footnotes">').append("<hr>").append(footnoteElts));
        }*/
    }

    partialRendering.init = function (editor) {
        converter = editor.getConverter();
        converter.hooks.chain("preConversion", function(text) {
            if(isRendering === true) {
                return text;
            }
            extractSections(text);
            return "";
        });
        editor.hooks.chain("onPreviewRefresh", function() {
            $("#wmd-preview").html(renderSections());
        });
    };

    return partialRendering;
});