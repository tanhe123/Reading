/**
 * Created by tan on 15-3-20.
 */
define(["jquery", "underscore"], function ($, _) {

    // todo 应该在 markdownSectionParser 中解析成 sectionList, 然后在这里可以使用

    // todo 这个文件是用来绘制 preview 的
    // todo markdown.editor.js中的渲染就没有意义了

    var partialRendering = {};

    var convert = undefined;

    var currentSectionList = [];
    var convertedSectionsList = [];

    //var hasFootnotes = false;

    var isRendering = false;
    function renderSections() {
        // Renders sections
        isRendering = true;
        //调用 convert 将 markdown转换成 html
        // makeHtml 会产生 prepreConversion 事件
        convertedSectionsList = _.map(currentSectionList, converter.makeHtml);
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
            console.log("partialRendering: " + text);

            if(isRendering === true) {
                return text;
            }
            //extractSections(text);
            //return "";
            return text;
        });
        editor.hooks.chain("onPreviewRefresh", function() {
            //$("#wmd-preview").html(renderSections());

            renderSections();
        });
    };

    partialRendering.onSectionsCreated = function (sectionListParam) {
        currentSectionList = sectionListParam;
    };

    return partialRendering;
});