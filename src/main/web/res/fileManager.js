/**
 * Created by tan on 15-1-22.
 */
define(['jquery', 'core', 'note', 'notebook', 'FileSaver'], function ($, core, Note, Notebook) {
    var fileManager = {};

    // 内容是否有变化的标志, true 为有变化
    var save = false;

    fileManager.init = function () {

        fileManager.queryFile();

        // 自动调用保存
        window.setInterval(function () {
            //todo: 修改为智能同步，而不是定时检查
            fileManager.saveNote();
        }, 4000);

        // 删除笔记
        /*$(".action-remove-file").click(function () {
            $.ajax({
                url: '/note/' + note.id,
                type: 'DELETE',
                success: function (rs) {
                    if (rs === true) {
                        location.href = "/note";
                    } else {
                        alert("删除文章失败");
                    }
                }
            });

        });*/

        // 输入标题时，失去焦点保存文件名
        $("#note-title").blur(function () {
            var title = $.trim($(this).val());

            // 修改网页标题
            document.title = title;

            save = true;

            //todo: 检测文件名是否为空

        });

        // 修改标题输入回车，wmd-input聚焦
        $("#note-title").keydown(function (event) {
            if (event.keyCode == "13") {
                //todo: 聚焦后出现问题
                $('#wmd-input').focus();
            }
        });

        $("#action-exit").click(function () {
            console.log("haha");
            fileManager.saveNote();
            location.href = "/note";
        });

        // 保存文件参见 http://stackoverflow.com/questions/7717851/save-file-javascript-with-file-name
        /*$("#action-download-md").click(function () {
            var content = $("#wmd-input").val();
            var filename = $("#note-title").val() + ".md";

            fileManager.downloadFile(filename, content);
        });

        $("#action-download-html").click(function () {
            var content = $("#wmd-preview").html();
            var filename = $("#note-title").val() + ".html";

            fileManager.downloadFile(filename, content);
        });*/

        // 自定义处理 Ctrl+S 保存
        $(window).keydown(function(e) {
            if (e.keyCode == 83 && e.ctrlKey) {

                // 同步内容到服务器
                fileManager.saveNote();

                e.preventDefault();
            }
        });
    };

    /*fileManager.downloadFile = function(filename, content) {
        if (saveAs !== undefined) {
            var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
            saveAs(blob, filename);
        } else {
            var uriContent = "data:application/octet-stream;base64,"
                + content;
            window.open(uriContent, 'file');
        }
    };*/

    // 获取文件内容
    fileManager.queryFile = function () {
        var noteId = $("#note-title").data("noteId");

        console.log("noteid:" + noteId);


        //todo: 浏览模式时id的存储位置
        if (!noteId) {
            console.error("error noteid null");

            noteId = note.id;
        }

        Note.queryNote(noteId, function (rsNote) {
            note = rsNote;

            // 显示笔记
            Note.renderNote(note);

            // 重新初始化 markdown 编辑器
            core.createEditor(function () {
                save = false;
            });

            // todo: 缓存

            // todo: 显示
            $("#loading").hide();
            $(".editorContainer").show();
        });

    };

    // 移动笔记到指定的笔记本
    $("#notebook").change(function () {
        var noteId = $("#note-title").data("noteId");
        var notebookId = $("#notebook").val();

        Note.moveNote(noteId, notebookId);
    });

    // 保存文件
    //todo: 增加本地缓存功能
    //todo: 通过比对版本号，来选择是否使用缓存
    fileManager.saveNote = function () {
        if (save === true && viewerMode === false) {

            Note.updateContentAndTitle();

            // 显示
            $("#saving-notice").show().fadeTo(500, 1).fadeTo(1500, 0);

            save = false;
        }
    };

    return fileManager;
});