/**
 * Created by tan on 15-1-22.
 */


define(["jquery", "underscore", "mathjax-editing", 'scroll-link', "bootstrap", "jgrowl", "pagedownExtra"], function ($, _, mathjaxEditing, scrollLink) {
    var core = {};

    //todo: 自定义
    core.settings = {
        //editorFontSize : 14
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
            //"font-size": core.settings.editorFontSize + "px",
            //"line-height": Math.round(core.settings.editorFontSize * (20/14)) + "px"
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
        //$("input:radio[name=radio-layout-orientation][value=" + core.settings.layoutOrientation + "]").prop("checked", true);
    };

    core.saveSettings = function() {
        // Layout orientation
        //core.settings.layoutOrientation = $("input:radio[name=radio-layout-orientation]:checked").prop("value");
        localStorage.settings = JSON.stringify(core.settings);
    };

    core.createLayout = function() {

        if (viewerMode === true) {


            return;
        }

        // 同步滚动
        $("#wmd-input, #wmd-preview").scroll(scrollLink.scroll);
    };

    core.createEditor = function(textChangeCallback) {
        $("#wmd-button-bar").empty();
        var converter = Markdown.getSanitizingConverter();

        converter.hooks.chain("preConversion", function (text) {
            if (textChangeCallback) {
                textChangeCallback();
            }

            return text;
        });

        var editor = new Markdown.Editor(converter);

        // 启用 Markdown.Extra
        Markdown.Extra.init(converter, {highlighter: "prettify"});

        editor.hooks.chain("onPreviewRefresh", prettyPrint);

        // MathJax
        mathjaxEditing.prepareWmdForMathJax(editor, [["$", "$"], ["\\\\(", "\\\\)"]], scrollLink.previewFinished);


        editor.run();

        $("#wmd-input").bind('input propertychange', _.throttle(editor.refreshPreview, 1000));

        //$(".wmd-button-row").addClass("btn-group").find("li:not(.wmd-spacer)").addClass("btn").css({"left": 0}).find("span").hide();

        /*$("#wmd-bold-button").append($("<i>").addClass("fa fa-bold"));
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
        $("#wmd-redo-button").append($("<i>").addClass("fa fa-repeat"));*/

        // Hide default buttons
        //$(".wmd-button-row li").addClass("btn btn-success").css("left", 0).find("span").hide();
        $(".wmd-button-row li").addClass("btn").css("left", 0).find("span").hide();

        // Add customized buttons
        var $btnGroupElt = $('.wmd-button-group1');
        $("#wmd-bold-button").append($('<i class="fa fa-bold">')).appendTo($btnGroupElt);
        $("#wmd-italic-button").append($('<i class="fa fa-italic">')).appendTo($btnGroupElt);
        $btnGroupElt = $('.wmd-button-group2');
        $("#wmd-link-button").append($('<i class="fa fa-link">')).appendTo($btnGroupElt);
        $("#wmd-quote-button").append($('<i class="fa fa-quote-left">')).appendTo($btnGroupElt);
        $("#wmd-code-button").append($('<i class="fa fa-code">')).appendTo($btnGroupElt);
        $("#wmd-image-button").append($('<i class="fa fa-picture-o">')).appendTo($btnGroupElt);
        $btnGroupElt = $('.wmd-button-group3');
        $("#wmd-olist-button").append($('<i class="fa fa-list-ol">')).appendTo($btnGroupElt);
        $("#wmd-ulist-button").append($('<i class="fa fa-list-ul">')).appendTo($btnGroupElt);
        $("#wmd-heading-button").append($('<i class="fa fa-header">')).appendTo($btnGroupElt);
        $("#wmd-hr-button").append($('<i class="fa fa-ellipsis-h">')).appendTo($btnGroupElt);
        $btnGroupElt = $('.wmd-button-group5');
        $("#wmd-undo-button").append($('<i class="fa fa-undo">')).appendTo($btnGroupElt);
        $("#wmd-redo-button").append($('<i class="fa fa-repeat">')).appendTo($btnGroupElt);
    };

    return core;
});