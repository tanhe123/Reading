/**
 * Created by tan on 15-1-2.
 */
define([
    "underscore",
    "classes/Extension",
    "crel"
], function(_, Extension, crel) {

    var markdownSectionParser = new Extension("markdownSectionParser", "Markdown section parser");

    var eventMgr;
    markdownSectionParser.onEventMgrCreated = function(eventMgrParameter) {
        console.log("markdownSectionParser: onEventMgrCreated  eventMgr:" + eventMgrParameter);
        eventMgr = eventMgrParameter;
    };

    var sectionList = [];
    var previewContentsElt;

    //todo: 假定为 true, 最终应该是从配置中读取2

    markdownSectionParser.enabled = true;

    // Regexp to look for section delimiters
    var regexp = '^.+[ \\t]*\\n=+[ \\t]*\\n+|^.+[ \\t]*\\n-+[ \\t]*\\n+|^\\#{1,6}[ \\t]*.+?[ \\t]*\\#*\\n+'; // Title delimiters

    markdownSectionParser.onPagedownConfigure = function (pagedownEditor) {
        //     todo: markdownExtra.enabled

        //  todo:  mathjax.enabled

        regexp = new RegExp(regexp, 'gm');

        var converter = pagedownEditor.getConverter();

        //todo: if(!partialRendering.enabled) {
        if (false) {//todo: 应该时 true?
            converter.hooks.chain("preConversion", function () {
               return _.reduce(sectionList, function (result) {
                   return result + '\n<div class="se-preview-section-delimiter"></div>\n\n' + section.text + '\n\n';
               }, '');
            });
        }

        //todo: 直接copy 过来的
        pagedownEditor.hooks.chain("onPreviewRefresh", function() {
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

    markdownSectionParser.onReady = function() {
        console.log("markdownSectionParser: onReady");
        previewContentsElt = document.getElementById("preview-contents");
    };

    var fileDesc;
    markdownSectionParser.onFileSelected = function(fileDescParam) {
        fileDesc = fileDescParam;
    };

    var sectionCounter = 0;
    function parseFileContent(fileDescParam, content) {
        if(fileDescParam !== fileDesc) {
            return;
        }
        var frontMatter = (fileDesc.frontMatter || {})._frontMatter || '';
        var text = content.substring(frontMatter.length);
        var tmpText = text + "\n\n";
        function addSection(startOffset, endOffset) {
            var sectionText = tmpText.substring(offset, endOffset);
            sectionList.push({
                id: ++sectionCounter,
                text: sectionText,
                textWithFrontMatter: frontMatter + sectionText
            });
            frontMatter = '';
        }
        sectionList = [];
        var offset = 0;
        // Look for delimiters
        tmpText.replace(regexp, function(match, matchOffset) {
            // Create a new section with the text preceding the delimiter
            addSection(offset, matchOffset);
            offset = matchOffset;
        });
        // Last section
        addSection(offset, text.length);
        eventMgr.onSectionsCreated(sectionList);

        console.log("sectionList:" + sectionList);
    }

    markdownSectionParser.onFileOpen = parseFileContent;
    markdownSectionParser.onContentChanged = parseFileContent;


    return markdownSectionParser;
});