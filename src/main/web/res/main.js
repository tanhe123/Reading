/**
 * Created by tan on 14-12-29.
 */
(function($) {
    $(function() {
        var converter = Markdown.getSanitizingConverter();
        var editor = new Markdown.Editor(converter);
        editor.run();
        $(window).resize(resize);
        resize();

        if (typeof (Storage) !== "undefined") {
            fileManager.init();
        } else {
            showError("Web storage is not available");
        }
    });

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
                fileManager.selectFile();
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
            if (this.fileTitleList.length == 0) {
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
            var title = localStorage[fileIndex + ".title"];
            $("#file-title").text(title);
            $("#file-title-input").val(title);

        };

        fileManager.updateFileTitleList = function() {
            var fileCount = parseInt((localStorage["file.count"]));
            this.fileTitleList = [];
            $("#file-selector").empty();
            for (var i=0; i<fileCount; i++) {
                var fileIndex = "file." + i;
                var title = localStorage[fileIndex + ".title"];
                if (title) {
                    this.fileTitleList[i] = title;
                    var a = $("<a>").text(title);
                    var li = $("<li>").append(a);
                    if (fileIndex == localStorage['file.count']) {
                        li.addClass("disabled");
                    } else {
                        a.click((function (fileIndex) {
                            return function () {
                                localStorage["file.current"] = fileIndex;
                                fileManager.selectFile();
                            }
                        })(fileIndex));
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




    function resize() {
        $("#wmd-input").width($(window).width() / 2 - 60).height(
            $(window).height() - 70);
        $("#wmd-preview").width($(window).width() / 2 - 60).height(
            $(window).height() - 100);
    }

    function showError(msg) {
        alert(msg);
    }
})(jQuery);