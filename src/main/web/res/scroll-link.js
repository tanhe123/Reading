/**
 * Created by tan on 15-1-31.
 */


define(['jquery', 'underscore'], function ($, _) {

    var scrollLink = {};

// Used by Scroll Link feature
    var mdSectionList = [];
    var htmlSectionList = [];

// 将字符型，转化为float
    function pxToFloat(px) {
        return parseFloat(px.substring(0, px.length-2));
    }

    /**
     * buildSections 就是将wmd-input和wmd-preview中的内容按照标题分成小节。
     * wmd-input 中的小节分隔符就是 # ## 这样的， 对应于 wmd-preview 中的 h1, h2 这样的
     * 将分号的小节开始位置、结束位置、高度，分别放在各自的数组中。
     * 小节与小节要一一对应
     */
    scrollLink.buildSections = _.debounce(function() {
        // 如果是viewer模式，则不用同步滚动条
        if (viewerMode === true) return;

        // Try to find Markdown sections by looking for titles
        var editorElt = $("#wmd-input");
        mdSectionList = [];
        // This textarea is used to measure sections height
        var textareaElt = $("#md-section-helper");
        // It has to be the same width than wmd-input
        textareaElt.width(editorElt.width());
        // Consider wmd-input top padding
        var padding = pxToFloat(editorElt.css('padding-top'));
        var offset = 0, mdSectionOffset = 0;
        function addMdSection(sectionText) {
            var sectionHeight = padding;
            if(sectionText) {
                textareaElt.val(sectionText);
                sectionHeight += textareaElt.prop('scrollHeight');
            }
            var newSectionOffset = mdSectionOffset + sectionHeight;
            mdSectionList.push({
                startOffset: mdSectionOffset,
                endOffset: newSectionOffset,
                height: sectionHeight
            });
            mdSectionOffset = newSectionOffset;
            padding = 0;
        }
        // Create MD sections by finding title patterns (excluding gfm blocs)
        // makrdown sections 的正则分隔符
        var text = editorElt.val() + "\n\n";
        text.replace(/^```.*\n[\s\S]*?\n```|(^.+[ \t]*\n=+[ \t]*\n+|^.+[ \t]*\n-+[ \t]*\n+|^\#{1,6}[ \t]*.+?[ \t]*\#*\n+)/gm,
            function(match, title, matchOffset) {
                if(title) {
                    // We just found a title which means end of the previous section
                    // Exclude last \n of the section
                    // offset 为上一 section 开始的位置
                    addMdSection(text.substring(offset, matchOffset-1));

                    offset = matchOffset;
                }

                return "";
            }
        );

        // Last section
        // 将剩下的部分作为一个section, 要考虑 bottom padding 和 自己加入先前加入的 "\n\n"
        // Consider wmd-input bottom padding and exclude \n\n previously added
        padding += pxToFloat(editorElt.css('padding-bottom'));
        addMdSection(text.substring(offset, text.length-2));

        // Try to find corresponding sections in the preview
        var previewElt = $("#wmd-preview");
        htmlSectionList = [];
        var htmlSectionOffset = 0;
        var previewScrollTop = previewElt.scrollTop();
        // Each title element is a section separator
        previewElt.children("h1,h2,h3,h4,h5,h6").each(function() {
            // Consider div scroll position and header element top margin
            // position() 方法返回匹配元素相对于父元素的位置（偏移）。
            // 该方法返回的对象包含两个整型属性：top 和 left，以像素计。
            // 此方法只对可见元素有效。
            //todo: 这里previewScrollTop不太明白
            var newSectionOffset = $(this).position().top + previewScrollTop + pxToFloat($(this).css('margin-top'));
            htmlSectionList.push({
                startOffset: htmlSectionOffset,
                endOffset: newSectionOffset,
                height: newSectionOffset - htmlSectionOffset
            });
            htmlSectionOffset = newSectionOffset;
        });
        // Last section
        var scrollHeight = previewElt.prop('scrollHeight');
        htmlSectionList.push({
            startOffset: htmlSectionOffset,
            endOffset: scrollHeight,
            height: scrollHeight - htmlSectionOffset
        });

        // apply Scroll Link
        lastEditorScrollTop = -99;
        lastPreviewScrollTop = -99;

        scrollLink.scroll();
    }, 800);

    var lastEditorScrollTop = -99;
    var lastPreviewScrollTop = -99;

    scrollLink.scroll = _.debounce(function() {
        // 两个小节的长度相等且都不为0
        if(mdSectionList.length === 0 || mdSectionList.length !== htmlSectionList.length) {
            console.log("mdSectionList.length:" + mdSectionList + " htmlSectionList.length:" + htmlSectionList);
            return;
        }

        var editorElt = $("#wmd-input");
        var editorScrollTop = editorElt.scrollTop();
        var previewElt = $("#wmd-preview");
        var previewScrollTop = previewElt.scrollTop();

        /**
         *
         * @param srcScrollTop 当前的位置
         * @param srcSectionList 当前的列表, 要么是 mdSectionList, 要么是 htmlSectionList
         * @param destElt 要同步的元素 要么是 wmd-input, 要么是 wmd-preview
         * @param destSectionList 要同步元素中的 SectionList, 同 srcSectionList
         * @returns 返回要同步元素，同步后的位置
         */
        function animate(srcScrollTop, srcSectionList, destElt, destSectionList) {

            // Find the section corresponding to the offset
            // 寻找 srcScrollTop 所在srcSectionList中的小节
            var sectionIndex = undefined;
            var srcSection = _.find(srcSectionList, function(section, index) {
                sectionIndex = index;
                return srcScrollTop < section.endOffset;
            });

            if(srcSection === undefined) {
                // Something wrong in the algorithm...
                return 0;
            }

            // 在小节中的位置(百分比)
            var posInSection = (srcScrollTop - srcSection.startOffset) / srcSection.height;
            // 求在dest中scrollTop值
            var destSection = destSectionList[sectionIndex];
            var destScrollTop = destSection.startOffset + destSection.height * posInSection;

            // 这个 animate 是 jquery 效果
            destElt.animate({scrollTop: destScrollTop}, 800, function() {
                // lastEditorScrollTop 和 lastPreviewScrollTop 用来判断是否需要进行同步
                lastEditorScrollTop = editorElt.scrollTop();
                lastPreviewScrollTop = previewElt.scrollTop();
            });
            return destScrollTop;
        }

        // 如果移动的是wmd-input的滚动条, 则同步wmd-preview的位置
        if(Math.abs(editorScrollTop - lastEditorScrollTop) > 5) {
            previewScrollTop = animate(editorScrollTop, mdSectionList, previewElt, htmlSectionList);
        }
        // 如果移动的是wmd-preview的滚动条, 则同步wmd-input的位置
        else if(Math.abs(previewScrollTop - lastPreviewScrollTop) > 5) {
            editorScrollTop = animate(previewScrollTop, htmlSectionList, editorElt, mdSectionList);
        }

    }, 1000);

    scrollLink.previewFinished = function() {
        // MathJax may have change the scroll position. Restore it
        $("#wmd-preview").scrollTop(lastPreviewScrollTop);

        // Modify scroll position of the preview not the editor
        lastEditorScrollTop = -9;
        scrollLink.buildSections();
        // Preview may chang
        // e if images are loading
        $("#wmd-preview img").load(function() {
            lastEditorScrollTop = -9;
            scrollLink.buildSections();
        });
    };

    return scrollLink;
});
