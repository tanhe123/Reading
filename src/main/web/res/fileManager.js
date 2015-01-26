/**
 * Created by tan on 15-1-22.
 */
define(['jquery', 'core', 'FileSaver'], function ($, core) {
    var fileManager = {};

    // 内容是否有变化的标志, true 为有变化
    var save = false;

    fileManager.init = function () {
        //synchronizer.init();

        //todo: 获取note和note列表
        //console.log(note.id);

        fileManager.queryFile();

        // 自动调用保存
        window.setInterval(function () {
            fileManager.saveFile();

            //todo: 还未写同步功能
            //synchronizer.run();
        }, 6000);

        /*$("#new-file").click(function () {
            fileManager.saveFile();
            fileManager.createFile();
            fileManager.queryFile();
        });
*/
        $("#remove-file").click(function () {
            //todo:
        });

        $("#file-title").click(function () {
            if (viewerMode === true) {
                return ;
            }

            $(this).hide();
            $("#file-title-input").show().focus();
        });

        $("#file-title-input").blur(function () {
            var title = $.trim($(this).val());

            if (title) {
                //var fileIndex = localStorage["file.current"];
                //localStorage[fileIndex + ".title"] = title;
                //fileManager.saveFile();
                $("#file-title").text(title);
                save = true;
            }

            $(this).hide();
            $("#file-title").show();

            // 更名后，需要更新title和ui
            //fileManager.updateFileDescList();
            //fileManager.updateFileTitleUI();

        });

        //保存文件参见 http://stackoverflow.com/questions/7717851/save-file-javascript-with-file-name
        $("#action-download-md").click(function () {
            var content = $("#wmd-input").val();
            var filename = $("#file-title").text() + ".md";

            fileManager.downloadFile(filename, content);
        });

        $("#action-download-html").click(function () {
            var content = $("#wmd-preview").html();
            var filename = $("#file-title").text() + ".html";

            fileManager.downloadFile(filename, content);
        });


        // 自定义处理 Ctrl+S 保存
        $(window).keydown(function(e) {
            if (e.keyCode == 83 && e.ctrlKey) {

                //todo: 保存
                console.log("Ctrl+S");

                fileManager.saveFile();

                e.preventDefault();
            }
        });
    };

    fileManager.downloadFile = function(filename, content) {
        if (saveAs !== undefined) {
            var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            saveAs(blob, filename);
        } else {
            /*$(this).prop("href", "data:application/octet-stream," + encodeURIComponent(content))
                .prop("download", filename);*/
            var uriContent = "data:application/octet-stream;base64,"
                + content;
            window.open(uriContent, 'file');
        }
    };

    // 新建一个文件
/*
    fileManager.createFile = function (title) {
        if (!title) {
            title = "New File";
        }

        var fileIndex = "file." + parseInt(localStorage["file.count"]);
        localStorage[fileIndex + ".title"] = title;
        localStorage[fileIndex + ".content"] = "";
        localStorage["file.count"] = parseInt(localStorage["file.count"]) + 1;
        localStorage["file.current"] = fileIndex;
    };
*/

    // 读取 file.current 文件
    fileManager.queryFile = function (noteId) {
        noteId = noteId || note.id;

        // 如果文件不存在
       /* if (!localStorage["file.count"]) {
            localStorage.clear();
            localStorage["file.count"] = 0;
        }*/

        // 在view中更新文件列表
        //this.updateFileDescList();

        // 如果没有缓存文件
/*
        if (this.fileDescList.length === 0) {
            this.createFile();
            this.updateFileDescList();
        }
*/

        // 如果找不到默认的文件，就选择第一个
/*        if (!localStorage["file.current"]) {
            var fileCount = parseInt(localStorage["file.count"]);
            for (var i = 0; i < fileCount; i++) {
                var fileIndex = "file." + i;
                if (localStorage[fileIndex + ".title"]) {
                    localStorage["file.current"] = fileIndex;
                    break;
                }
            }
        }*/

        $.getJSON("/note/getNoteContent?noteId=" + noteId, function (rsNote) {
            note = rsNote;

            $("#wmd-input").val(note.content);

            document.title = "Reading - " + note.title;

            //可以更新所有 class 为 file-title 的内容
            $(".file-title").text(note.title);

            $("#file-title-input").val(note.title);

            core.createEditor(function () {
                save = true;
            });

            // 缓存
        });

        // Update the editor and the file title
        //var fileIndex = localStorage["file.current"];
        //$("#wmd-input").val(localStorage[fileIndex + ".content"]);


        //this.updateFileTitleUI();
    };

    // 更新持有的 文件描述，包括 title和index
/*    fileManager.updateFileDescList = function () {
        var fileCount = parseInt((localStorage["file.count"]));
        this.fileDescList = [];
        for (var i = 0; i < fileCount; i++) {
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
    };*/

    // 将持有的 titleList 显示
    /*fileManager.updateFileTitleUI = function () {
        var fileIndex = localStorage["file.current"];
        var title = localStorage[fileIndex + ".title"];

        document.title = "Reading - " + title;

        //可以更新所有 class 为 file-title 的内容
        $(".file-title").text(title);

        $("#file-title-input").val(title);
        $("#file-selector").empty();

        for (var i = 0; i < this.fileDescList.length; i++) {
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
                            fileManager.queryFile();
                        }
                    })(fileDesc.index));
            }
            $("#file-selector").append(li);
        }
    };*/

    // 保存文件
    //todo: 增加本地缓存功能
    //todo: 通过比对版本号，来选择是否使用缓存
    fileManager.saveFile = function () {
        if (save) {

            var content = $("#wmd-input").val();
            var title = $("#file-title").text();

            var params = {
                noteId: note.id,
                title: title,
                content: content
            };

            console.log("params:" + params);

            $.post("/note/updateNoteTitleOrContent", params, function (rs) {
                console.log("rs:" + rs);
            });
            save = false;

            //todo: 更新

            //var fileIndex = localStorage["file.current"];
            //localStorage[fileIndex + ".content"] = content;
            //todo: 同步功能
            //synchronizer.addFile(fileIndex);
            //save = false;
        }
    };

    return fileManager;
});