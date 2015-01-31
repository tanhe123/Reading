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
        if(mdSectionList.length === 0 || mdSectionList.length !== htmlSectionList.length) {
            return;
        }
        var editorElt = $("#wmd-input");
        var editorScrollTop = editorElt.scrollTop();
        var previewElt = $("#wmd-preview");
        var previewScrollTop = previewElt.scrollTop();
        function animate(srcScrollTop, srcSectionList, destElt, destSectionList) {
            // Find the section corresponding to the offset
            var sectionIndex = undefined;
            var srcSection = _.find(srcSectionList, function(section, index) {
                sectionIndex = index;
                return srcScrollTop < section.endOffset;
            });

            if(srcSection === undefined) {
                // Something wrong in the algorithm...
                return 0;
            }

            var posInSection = (srcScrollTop - srcSection.startOffset) / srcSection.height;
            var destSection = destSectionList[sectionIndex];
            var destScrollTop = destSection.startOffset + destSection.height * posInSection;
            destElt.animate({scrollTop: destScrollTop}, 800, function() {
                lastEditorScrollTop = editorElt.scrollTop();
                lastPreviewScrollTop = previewElt.scrollTop();
            });
            return destScrollTop;
        }
        if(Math.abs(editorScrollTop - lastEditorScrollTop) > 5) {
            previewScrollTop = animate(editorScrollTop, mdSectionList, previewElt, htmlSectionList);
        }
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
