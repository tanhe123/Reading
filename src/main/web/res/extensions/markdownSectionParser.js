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

    //todo: 假定为 true, 最终应该是从配置中读取

    markdownSectionParser.enabled = true;

    // Regexp to look for section delimiters
    // 小节的分隔符正则, 比如 #标题 等
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

        //todo: 直接copy 过来的, 不知道干啥的，感觉像是把转换好的内容放入 preivew
        //todo: 貌似 wmd-preview 并没有用
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
        // 如果要解析的不是其保持的文件实例，则返回, 不解析
        if(fileDescParam !== fileDesc) {
            return;
        }
        var frontMatter = (fileDesc.frontMatter || {})._frontMatter || '';
        var text = content.substring(frontMatter.length);
        //todo: tmpText 通过在最后添加两个空行，来解决Uncaught IndexSizeError: Failed to execute 'setStart' on 'Range': The offset -1 is larger than or equal to the node's length (0).editor.js:210 createRangeeditor.js:442 getCoordinateseditor.js:225 (anonymous function)utils.js:32 laterutils.js:16 (anonymous function)报错问题
        // todo: 详情参见 readme
        var tmpText = text + "\n\n";

        /**
         * 创建一个section
         * @param startOffset section开始的位置
         * @param endOffset section 结束的位置
         */
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
        // 剩下的部分作为一个section
        // 真正的长度为添加两个空行之前的长度, 即text.length
        addSection(offset, text.length);

        // 通知section创建完毕
        eventMgr.onSectionsCreated(sectionList);

        console.log("sectionList:" + sectionList);
    }

    //todo: parseFileContent
    markdownSectionParser.onFileOpen = parseFileContent;
    markdownSectionParser.onContentChanged = parseFileContent;


    return markdownSectionParser;
});