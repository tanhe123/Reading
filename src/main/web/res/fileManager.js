/**
 * Created by tan on 15-1-22.
 */
define(['jquery', 'core', 'note', 'notebook', 'FileSaver'], function ($, core, Note, Notebook) {
    var fileManager = {};

    // 内容是否有变化的标志, true 为有变化
    var save = false;

    fileManager.init = function () {

        // 自动调用保存
        window.setInterval(function () {
            //todo: 修改为智能同步，而不是定时检查
            fileManager.saveNote();
        }, 4000);



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


        // 自定义处理 Ctrl+S 保存
        $(window).keydown(function(e) {
            if (e.keyCode == 83 && e.ctrlKey) {

                // 同步内容到服务器
                fileManager.saveNote();

                e.preventDefault();
            }
        });

        // 笔记列表项点击事件

        // 动态绑定事件, http://www.cnblogs.com/rabbit2012/archive/2013/03/15/2961881.html
        $(".noteListContainer .slidingPanel").delegate("li", "click", function () {

            var noteId = $(this).data("noteId");

            fileManager.queryFile(noteId);
        });
    };

    // 获取文件内容
    fileManager.queryFile = function (noteId) {

        //todo: 浏览模式时id的存储位置
        if (!noteId) {
            console.error("error noteid null");
        }

        Note.queryNote(noteId, function (note) {
            // 显示笔记
            Note.renderNote(note);
            Notebook.renderNotebooks(notebooks);

            // 重新初始化 markdown 编辑器
            core.createEditor(function () {
                save = true;
            });

            // todo: 显示
            $("#loading").hide();
            $(".editorContainer").show();
            $(".slideMenu").show();
            $(".createNotebookContainer").hide();
            $(".noteListContainer").hide();
        });
    };


    // 保存文件
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