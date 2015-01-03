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

    //todo: 假定为 true, 最终应该是从配置中读取2

    /*markdownSectionParser.enabled = true;

    // Regexp to look for section delimiters
    var regexp = '^.+[ \\t]*\\n=+[ \\t]*\\n+|^.+[ \\t]*\\n-+[ \\t]*\\n+|^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'; // Title delimiters

    markdownSectionParser.onPagedownConfigure = function (editor) {
        //     todo: markdownExtra.enabled

        //  todo:  mathjax.enabled

        regexp = new RegExp(regexp, 'gm');

        var converter = editor.getConverter();

        //todo: if(!partialRendering.enabled) {
        if (true) {
            converter.hooks.chain("preConversion", function () {
               return _.reduce(sectionList, function (result) {
                   return result + '\n<div class="se-preview-section-delimiter"></div>\n\n' + section.text + '\n\n';
               }, '');
            });
        }

        //todo: 直接copy 过来的
        editor.hooks.chain("onPreviewRefresh", function() {
            var wmdPreviewElt = document.getElementById("wmd-preview");
            var childNode = wmdPreviewElt.firstChild;
            function createSectionElt() {
                var sectionElt = crel('div', {
                    class: 'wmd-preview-section preview-content'
                });
                var isNextDelimiter = false;
                while (childNode) {
                    var nextNode = childNode.nextSibling;
                    var isDelimiter = childNode.className == 'se-preview-section-delimiter';
                    if(isNextDelimiter === true && childNode.tagName == 'DIV' && isDelimiter) {
                        // Stop when encountered the next delimiter
                        break;
                    }
                    isNextDelimiter = true;
                    isDelimiter || sectionElt.appendChild(childNode);
                    childNode = nextNode;
                }
                return sectionElt;
            }

            var newSectionEltList = document.createDocumentFragment();
            sectionList.forEach(function(section) {
                newSectionEltList.appendChild(createSectionElt(section));
            });
            previewContentsElt.innerHTML = '';
            previewContentsElt.appendChild(wmdPreviewElt);
            previewContentsElt.appendChild(newSectionEltList);
        });
    };
*/
    markdownSectionParser.onReady = function() {
        console.log("markdownSectionParser: onReady");

        //previewContentsElt = document.getElementById("preview-contents");
        //console.log(previewContentsElt);


    };

    return markdownSectionParser;
});