/**
 * Created by tan on 15-1-22.
 */
define(['jquery', 'core', 'FileSaver'], function ($, core) {
    var fileManager = {};

    // 内容是否有变化的标志, true 为有变化
    var save = false;

    fileManager.init = function () {

        fileManager.queryFile();

        // 自动调用保存
        window.setInterval(function () {
            fileManager.saveFile();

            //todo: 还未写同步功能
            //synchronizer.run();
        }, 6000);

        $("#new-file").click(function () {
            location.href = "/"
        });


        $("#remove-file").click(function () {
            //todo:
        });

        $("#file-title").click(function () {
            if (viewerMode === true) {
                return ;
            }

            $(this).hide();

            // 显示修改标题的输入框，并选中输入框内的文本
            $("#file-title-input").show().focus();
            $("#file-title-input").select();
        });

        // 输入标题时，失去焦点保存文件名
        $("#file-title-input").blur(function () {
            var title = $.trim($(this).val());

            if (title && title != "") {
                $("#file-title").text(title);
                save = true;
            }

            $(this).hide();
            $("#file-title").show();
        });


        // 修改标题时，回车保存文件名
        $("#file-title-input").keydown(function (event) {
            if (event.keyCode == "13") {
                this.blur();
            }
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

                // 同步内容到服务器
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
            var uriContent = "data:application/octet-stream;base64,"
                + content;
            window.open(uriContent, 'file');
        }
    };

    // 获取文件内容
    fileManager.queryFile = function (noteId) {
        noteId = noteId || note.id;

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
    };

    // 保存文件
    //todo: 增加本地缓存功能
    //todo: 通过比对版本号，来选择是否使用缓存
    fileManager.saveFile = function () {
        if (save && viewerMode === false) {

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
        }
    };

    return fileManager;
});