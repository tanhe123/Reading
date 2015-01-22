/**
 * Created by tan on 14-12-29.
 */

var synchronizer = (function () {
    var synchronizer = {};

    // A synchronization queue containing fileIndex that has to be synchronized
    var syncQueue = undefined;
    synchronizer.init = function() {
        syncQueue = ";";

        // Load the queue from localStorage in case a previous synchronization was aborted
        if(localStorage["sync.queue"]) {
            syncQueue = localStorage["sync.queue"];
        }

        if(localStorage["sync.current"]) {
            this.addFile(localStorage["sync.current"]);
        }
    };

    // Add a file to the synchronization queue
    synchronizer.addFile = function(fileIndex) {
        if(syncQueue.indexOf(";" + fileIndex + ";") === -1) {
            syncQueue += fileIndex + ";";
            localStorage["sync_queue"] = syncQueue;
        }
    };

/*
    // Recursive function to run synchronization of a single file on multiple locations
    function sync(fileSyncIndexList, content, title) {
        if (fileSyncIndexList.length === 0) {
            localStorage.removeItem("sync.current");
            //todo:
            //unsetWorkingIndicator(FLAG_SYNCHRONIZE);
            running = false;
            // run the next file synchronization
            synchronizer.run();
            return;
        }
        var fileSyncIndex = fileSyncIndexList.pop();
        // Try to find the provider
    }
*/

    var running = false;

    /*synchronizer.run = function() {
        // If synchronization is already running or nothing to synchronize
        if(running || syncQueue.length === 1) {
            return;
        }

        // Start synchronization of the next available in the queue
        //todo:
        //setWorkingIndicator(FLAG_SYNCHRONIZE);
        running = true;

        // Dequeue the fileIndex
        // 获得第二个;号的位置，第一个是开始的标志，第二个表示一个fileIndex的结束
        var separatorPos = syncQueue.indexOf(";", 1);
        // 截取到 fileIndex
        var fileIndex = syncQueue.substring(1, separatorPos);
        localStorage["sync.current"] = fileIndex;
        // 将取出的 fileIndex 从队列中删除
        syncQueue = syncQueue.substring(separatorPos);
        // 保存被修改的队列
        localStorage["sync.queue"] = syncQueue;

        var content = localStorage[fileIndex + ".content"];
        var title = localStorage[fileIndex + ".title"];

        // todo: Parse the list of synchronized locations associated to the file
        var fileSyncIndexList = localStorage[fileIndex + ".sync"].split(";");
        sync(fileSyncIndexList, content, title);
    };*/

    return synchronizer;
})(jQuery);

var fileManager = (function($) {
    var fileManager = {};

    // 内容是否有变化的标志, true 为有变化
    var save = false;

    fileManager.init = function() {
        synchronizer.init();

        fileManager.selectFile();

        // 自动调用保存
        window.setInterval(function() {
            fileManager.saveFile();

            //todo: 还未写同步功能
            //synchronizer.run();
        }, 3000);

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
            fileManager.updateFileDescList();
            fileManager.updateFileTitleUI();

            save = true;
        });

/*        $("#wmd-input").keyup(function() {
            save = true;
        });*/
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
        this.updateFileDescList();

        // 如果没有缓存文件
        if (this.fileDescList.length === 0) {
            this.createFile();
            this.updateFileDescList();
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

        core.createEditor(function () {
           save = true;
        });

        this.updateFileTitleUI();
    };

    // 更新持有的 文件描述，包括 title和index
    fileManager.updateFileDescList = function() {
        var fileCount = parseInt((localStorage["file.count"]));
        this.fileDescList = [];
        for (var i=0; i<fileCount; i++) {
            var fileIndex = "file." + i;
            var title = localStorage[fileIndex + ".title"];
            if (title) {
                this.fileDescList.push({"index": fileIndex, "title": title});
            }
            // 按字母序将文件排序
            this.fileDescList.sort(function (a, b) {
                if (a.title.toLowerCase() < b.title.toLowerCase()) {
                    return -1;
                }
                if (a.title.toLowerCase() > b.title.toLowerCase()) {
                    return 1;
                }
                return 0;
            })
        }
    };

    // 将持有的 titleList 显示
    fileManager.updateFileTitleUI = function () {
        var fileIndex = localStorage["file.current"];
        var title = localStorage[fileIndex + ".title"];

        document.title = "Reading - " + title;

        //可以更新所有 class 为 file-title 的内容
        $(".file-title").text(title);

        $("#file-title-input").val(title);
        $("#file-selector").empty();

        for (var i=0; i<this.fileDescList.length; i++) {
            var fileDesc = this.fileDescList[i];

            var a = $("<a>").text(fileDesc.title);
            var li = $("<li>").append(a);
            if (fileDesc.index == fileIndex) {
                li.addClass("disabled");
            } else {
                a.prop("href", "#")
                    .click((function (fileIndex) {
                        return function () {
                            localStorage["file.current"] = fileIndex;
                            fileManager.selectFile();
                        }
                    })(fileDesc.index));
            }
            $("#file-selector").append(li);
        }
    };

    // 保存文件
    fileManager.saveFile = function() {
        if (save) {
            var content = $("#wmd-input").val();
            var fileIndex = localStorage["file.current"];
            localStorage[fileIndex + ".content"] = content;
            //todo: 同步功能
            //synchronizer.addFile(fileIndex);
            save = false;
        }
    };

    return fileManager;
})(jQuery);


var core = (function ($) {
    var core = {};

    var settings = {
        layoutOrientation: "horizontal"
    };

    core.init = function() {

        this.loadSettings();
        this.saveSettings();

        this.createLayout();

        // 加载配置
        $(".action-load-settings").click(function() {
            core.loadSettings();
        });

        $(".action-apply-settings").click(function() {
            core.saveSettings();
            fileManager.saveFile();
            location.reload();
        });
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
})(jQuery);

(function($) {
    $(function() {
        core.init();

        if (typeof (Storage) !== "undefined") {
            fileManager.init();
        } else {
            showError("Web storage is not available");
        }


    });

    function showError(msg) {
        alert(msg);
    }
})(jQuery);