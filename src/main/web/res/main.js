/**
 * Created by tan on 14-12-29.
 */
var fileManager = (function($) {
    var fileManager = {};

    fileManager.init = function() {
        fileManager.selectFile();

        // 自动调用保存
        window.setInterval(function() {
            fileManager.saveFile();
        }, 5000);

        $("#new-file").click(function() {
            fileManager.saveFile();
            fileManager.createFile();
            fileManager.selectFile();
        });

        $("#remove-file").click(function () {
            //todo:
        });

        $("#file-title").click(function () {
            $(this).hide();
            $("#file-title-input").show().focus();
        });

        $("#file-title-input").blur(function () {
            var title = $.trim($(this).val());
            if (title) {
                var fileIndex = localStorage["file.current"];
                localStorage[fileIndex + ".title"] = title;
            }
            $(this).hide();
            $("#file-title").show();
            // 更名后，需要更新title和ui
            fileManager.updateFileTitleList();
            fileManager.updateFileTitleUI();
        });
    };

    // 新建一个文件
    fileManager.createFile = function(title) {
        if (!title) {
            title = "New File";
        }

        var fileIndex = "file." + parseInt(localStorage["file.count"]);
        localStorage[fileIndex + ".title"] = title;
        localStorage[fileIndex + ".content"] = "";
        localStorage["file.count"] = parseInt(localStorage["file.count"]) + 1;
        localStorage["file.current"] = fileIndex;
    };

    // 读取 file.current 文件
    fileManager.selectFile = function() {
        // 如果文件不存在
        if (!localStorage["file.count"]) {
            localStorage.clear();
            localStorage["file.count"] = 0;
        }

        // 在view中更新文件列表
        this.updateFileTitleList();

        // 如果没有缓存文件
        if (this.fileTitleList.length === 0) {
            this.createFile();
            this.updateFileTitleList();
        }

        // 如果找不到默认的文件，就选择第一个
        if (!localStorage["file.current"]) {
            var fileCount = parseInt(localStorage["file.count"]);
            for (var i=0; i<fileCount; i++) {
                var fileIndex = "file." + i;
                if (localStorage[fileIndex + ".title"]) {
                    localStorage["file.current"] = fileIndex;
                    break;
                }
            }
        }

        // Update the editor and the file title
        var fileIndex = localStorage["file.current"];
        $("#wmd-input").val(localStorage[fileIndex + ".content"]);

        createEditor()
        this.updateFileTitleUI();
    };

    // 更新持有的 titleList
    fileManager.updateFileTitleList = function() {
        var fileCount = parseInt((localStorage["file.count"]));
        this.fileTitleList = [];
        $("#file-selector").empty();
        for (var i=0; i<fileCount; i++) {
            var fileIndex = "file." + i;
            var title = localStorage[fileIndex + ".title"];
            if (title) {
                this.fileTitleList[i] = title;
            }
        }
    };

    // 将持有的 titleList 显示
    fileManager.updateFileTitleUI = function () {
        var fileIndex = localStorage["file.current"];
        var title = localStorage[fileIndex + ".title"];
        $("#file-title").text(title);
        $("#file-title-input").val(title);
        $("#file-selector").empty();
        for (var i=0; i<this.fileTitleList.length; i++) {
            title = this.fileTitleList[i];

            if (title) {
                var fileIndex1 = "file." + i;
                var a = $("<a>").text(title);
                var li = $("<li>").append(a);
                if (fileIndex1 == fileIndex) {
                    li.addClass("disabled");
                } else {
                    a.attr("href", "javascript:void(0);")
                        .click((function (fileIndex) {
                            return function () {
                                localStorage["file.current"] = fileIndex;
                                fileManager.selectFile();
                            }
                        })(fileIndex1));
                }
                $("#file-selector").append(li);
            }
        }
    };

    // 保存文件
    fileManager.saveFile = function() {
        var content = $("#wmd-input").val();
        var fileIndex = localStorage["file.current"];
        localStorage[fileIndex + ".content"] = content;
    };

    return fileManager;
})(jQuery);


function createEditor() {
    $("#wmd-button-bar").empty();
    var converter = Markdown.getSanitizingConverter();
    var editor = new Markdown.Editor(converter);
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

}

var layoutOrientation = 0;
var layout;

function createLayout() {

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
        stateManagement__enabled : false};
    if (layoutOrientation === 0) {
        layout = $('body').layout(
            $.extend(layoutGlobalConfig,
                {east__resizable: true, east__size: .5, east__minSize: 200, south__closable: false}));
    }

    // 添加一个箭头指示
    $(".ui-layout-toggler-north").addClass("btn").append($("<b>").addClass("caret"));
    $(".ui-layout-toggler-east").addClass("btn").append($("<b>").addClass("caret"));
}

(function($) {
    $(function() {
        /*$(window).resize(resize);
        resize();*/

        createLayout();

        if (typeof (Storage) !== "undefined") {
            fileManager.init();
        } else {
            showError("Web storage is not available");
        }

        $("#navbar").click(function() {
            // 使得pop窗口菜单能够不被遮拦
            layout.allowOverflow('north');
        });
    });

    function showError(msg) {
        alert(msg);
    }
})(jQuery);