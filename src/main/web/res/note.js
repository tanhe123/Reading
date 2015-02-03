/**
 * Created by tan on 15-2-1.
 */

define([], function() {
    var Note = {};

    Note.renderNote = function (note) {
        // 修改网站标题
        document.title = note.title;

        // 设置标题
        $("#note-title").val(note.title);

        // 设置笔记内容
        $("#wmd-input").val(note.content);

        if (note.isBlog == false) {
            console.log("笔记");
            //$("#action-publish-blog").show();
        } else {
            //$("#action-update-blog").show();
            console.log("博客");
        }
    };

    Note.updateContentAndTitle = function () {
        updateNote();

        var params = {
            noteId: note.id,
            title: note.title,
            content: note.content
        };

        $.post("/note/updateNoteTitleOrContent", params, function (rs) {
            if (rs !== true) {
                alert("获取文章内容失败");
            }
        });
    };

    Note.publish = function () {

        $.post("/note/" + note.id + "/publish", function (rs) {
            console.log(rs);

            if (rs === true) {
                $("#action-publish-blog").hide();
                $("#action-update-blog").show();
            }
        });

        //var jsonObj = JSON.stringify(note);

        //todo: post json报415错误
        /*$.ajax({
                url: "/note/publish",
                type: "post",
                data: jsonObj,
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                success: function (rs) {
                    console.log(rs);
                }
            }
        );*/
    };

    /**
     * 将最新的内容更新至全局变量 note
     */
    var updateNote = function () {
        var content = $("#wmd-input").val();
        var title = $("#note-title").val();

        note.title = title;
        note.content = content;
    };

    return Note;
});