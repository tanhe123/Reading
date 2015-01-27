/**
 * Created by tan on 15-1-22.
 */


define(["jquery", "underscore", "mathjax-editing", "bootstrap", "jgrowl", "layout", "pagedownExtra"], function ($, _, mathjaxEditing) {
    var core = {};

    core.settings = {
        layoutOrientation: "horizontal",
        editorFontSize : 14
    };

    core.init = function() {

        // 当网络状态发生改变时触发
        $(window).on("offline", core.setOffline);
        $(window).on("online", core.setOnline);

        // 网页刚打开时，检测在线状态
        if (navigator.onLine === false) {
            core.setOffline();
        }

        this.loadSettings();

        this.createLayout();

        $("#wmd-input, #md-section-helper").css({
            "font-size": core.settings.editorFontSize + "px",
            "line-height": Math.round(core.settings.editorFontSize * (20/14)) + "px"
        }).keydown(function (e) {
            // 定义 tab 键
            if (e.keyCode == 9) {
                var value = $(this).val();
                var start = this.selectionStart;
                var end = this.selectionEnd;

                // IE8 does not support selection attributes
                if(start === undefined || end === undefined) {
                    return;
                }
                $(this).val(value.substring(0, start) + "\t" + value.substring(end));
                this.selectionStart = this.selectionEnd = start + 1;

                // 阻止按键的默认处理
                e.preventDefault();
            }
        });

        // 加载配置
        $(".action-load-settings").click(function() {
            core.loadSettings();
        });

        $(".action-apply-settings").click(function() {
            core.saveSettings();
            location.reload();
        });
    };


    core.showMessage = function(msg, iconClass, options) {
        options = options || {};
        $.jGrowl("<i class='icon-white " + iconClass + "'></i> " + msg, options);
    };

    core.isOffline = false;

    core.setOffline = function() {
        if (this.isOffline) {
            this.isOffline = true;
            if ($(".msg-offline").length === 0) {
                core.showMessage("You are offline.", "fa-exclamation msg-offline");
            }
        }

    };

    core.showError = function(msg) {
        core.showMessage(msg, "fa fa-warning");
    };

    core.setOnline = function() {
        this.isOffline = false;

        // 关闭所有通知离线的消息
        $(".msg-offine").parents(".jGrow-notification").trigger('jGrowl.beforeClose');

        // 通知已在线消息
        if ($(".msg-offline").length === 0) {
            core.showMessage("ou are back online!", "fa fa-signal");
        }
    };

    core.loadSettings = function () {
        if (localStorage.settings) {
            $.extend(core.settings, JSON.parse(localStorage.settings));
        }

        // Layout orientation
        $("input:radio[name=radio-layout-orientation][value=" + core.settings.layoutOrientation + "]").prop("checked", true);
    };

    core.saveSettings = function() {
        // Layout orientation
        core.settings.layoutOrientation = $("input:radio[name=radio-layout-orientation]:checked").prop("value");
        localStorage.settings = JSON.stringify(core.settings);
    };

    // Used by Scroll Link feature
    var mdSectionList = [];
    var htmlSectionList = [];

    // 将字符型，转化为float
    function pxToFloat(px) {
        return parseFloat(px.substring(0, px.length-2));
    }

    var buildSections = _.debounce(function() {
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


        /*
        console.log("mdSectionList: " + _.map(mdSectionList, function(section) {
            return section.endOffset;
        }));
        */

        // apply Scroll Link
        lastEditorScrollTop = -99;
        lastPreviewScrollTop = -99;
        scrollLink();
    }, 800);

    var lastEditorScrollTop = -99;
    var lastPreviewScrollTop = -99;
    var scrollLink = _.debounce(function() {
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



    core.createLayout = function() {

        if (viewerMode === true) {
            return;
        }

        var layout;

        // layout 配置项
        var layoutGlobalConfig = {
            closable : true,
            resizable : false,
            slidable : false,
            livePaneResizing : true,
            spacing_open : 20,
            spacing_closed : 20,

            // 切换按钮的长度
            togglerLength_open : 90,
            togglerLength_closed : 90,
            center__minWidth : 300,
            center__minHeight : 100,
            stateManagement__enabled : false};

        if (core.settings.layoutOrientation == "horizontal") {
            $(".ui-layout-east").addClass("well").prop("id", "wmd-preview");
            layout = $('body').layout(
                $.extend(layoutGlobalConfig,
                    {east__resizable: true, east__size: .5, east__minSize: 200, south__closable: false}));
        } else if (core.settings.layoutOrientation === "vertical") {
            $(".ui-layout-east").remove();
            $(".ui-layout-south").addClass("well").prop("id", "wmd-preview");
            layout = $('body').layout(
                $.extend(layoutGlobalConfig, { south__resizable : true,
                    south__size : .5, south__minSize : 200}));
        };

        // 添加一个箭头指示
        $(".ui-layout-toggler-north").addClass("btn").append($("<b>").addClass("caret"));
        $(".ui-layout-toggler-east").addClass("btn").append($("<b>").addClass("caret"));
        $(".ui-layout-toggler-south").addClass("btn").append($("<b>").addClass("caret"));

        $("#navbar").click(function() {
            // 使得pop窗口菜单能够不被遮拦
            layout.allowOverflow('north');
        });

        // 同步滚动
        $("#wmd-input, #wmd-preview").scroll(scrollLink)
    };

    core.createEditor = function(textChangeCallback) {
        $("#wmd-button-bar").empty();
        var converter = Markdown.getSanitizingConverter();

        converter.hooks.chain("preConversion", function (text) {
            //todo 会导致第一次加载文档时，保存
            if (textChangeCallback) {
                textChangeCallback();
            }

            return text;
        });

        var editor = new Markdown.Editor(converter);

        // 启用 Markdown.Extra
        Markdown.Extra.init(converter, {highlighter: "prettify"});

        editor.hooks.chain("onPreviewRefresh", prettyPrint);

        /*editor.hooks.chain("onPreviewRefresh", function() {
            // MathJax may have change the scroll position. Restore it
            $("#wmd-preview").scrollTop(lastPreviewScrollTop);

            // Modify scroll position of the preview not the editor
            lastEditorScrollTop = -9;
            buildSections();
            // Preview may change if images are loading
            $("#wmd-preview img").load(function() {
                lastEditorScrollTop = -9;
                buildSections();
            });
        });*/

        // MathJax
        mathjaxEditing.prepareWmdForMathJax(editor, [["$", "$"], ["\\\\(", "\\\\)"]], previewFinished);

        function previewFinished() {
            // MathJax may have change the scroll position. Restore it
            $("#wmd-preview").scrollTop(lastPreviewScrollTop);

            // Modify scroll position of the preview not the editor
            lastEditorScrollTop = -9;
            buildSections();
            // Preview may change if images are loading
            $("#wmd-preview img").load(function() {
                lastEditorScrollTop = -9;
                buildSections();
            });
        };


        editor.run();

        $("#wmd-input").bind('input propertychange', _.throttle(editor.refreshPreview, 1000));

        $(".wmd-button-row").addClass("btn-group").find("li:not(.wmd-spacer)").addClass("btn").css({"left": 0}).find("span").hide();
        $("#wmd-bold-button").append($("<i>").addClass("fa fa-bold"));
        $("#wmd-italic-button").append($("<i>").addClass("fa fa-italic"));
        $("#wmd-link-button").append($("<i>").addClass("fa fa-link"));
        $("#wmd-quote-button").append($("<i>").addClass("fa fa-quote-left"));
        $("#wmd-code-button").append($("<i>").addClass("fa fa-code"));
        $("#wmd-image-button").append($("<i>").addClass("fa fa-picture-o"));
        $("#wmd-olist-button").append($("<i>").addClass("fa fa-list-ol"));
        $("#wmd-ulist-button").append($("<i>").addClass("fa fa-list-ul"));
        $("#wmd-heading-button").append($("<i>").addClass("fa fa-header"));
        $("#wmd-hr-button").append($("<i>").addClass("fa fa-ellipsis-h"));
        $("#wmd-undo-button").append($("<i>").addClass("fa fa-undo"));
        $("#wmd-redo-button").append($("<i>").addClass("fa fa-repeat"));

    };

    return core;
});