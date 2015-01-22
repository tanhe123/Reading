/**
 * Created by tan on 15-1-22.
 */


define(["jquery", "bootstrap", "jgrowl", "layout", "pagedownExtra"], function ($) {
    var core = {};

    var settings = {
        layoutOrientation: "horizontal"
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
            $.extend(settings, JSON.parse(localStorage.settings));
        }

        // Layout orientation
        $("input:radio[name=radio-layout-orientation][value=" + settings.layoutOrientation + "]").prop("checked", true);
    };

    core.saveSettings = function() {
        // Layout orientation
        settings.layoutOrientation = $("input:radio[name=radio-layout-orientation]:checked").prop("value");
        localStorage.settings = JSON.stringify(settings);

        /*settings.layoutOrientation = "horizontal";
         if($("#radio-layout-orientation-vertical").is(":checked")) {
         settings.layoutOrientation = "vertical";
         }

         localStorage.settings = JSON.stringify(settings);*/
    };

    core.createLayout = function() {
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

        if (settings.layoutOrientation == "horizontal") {
            $(".ui-layout-east").addClass("well").prop("id", "wmd-preview");
            layout = $('body').layout(
                $.extend(layoutGlobalConfig,
                    {east__resizable: true, east__size: .5, east__minSize: 200, south__closable: false}));
        } else if (settings.layoutOrientation === "vertical") {
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
    };

    core.createEditor = function(textChangeCallback) {
        $("#wmd-button-bar").empty();
        var converter = Markdown.getSanitizingConverter();

        converter.hooks.chain("preConversion", function (text) {
            //todo 会导致第一次加载文档时，保存
            textChangeCallback();
            return text;
        });

        var editor = new Markdown.Editor(converter);
        // 启用 Markdown.Extra
        Markdown.Extra.init(converter, {highlighter: "prettify"});

        editor.hooks.chain("onPreviewRefresh", prettyPrint);

        editor.run();


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