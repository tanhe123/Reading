/**
 * Created by tan on 15-2-1.
 */

define([], function() {
    var Note = {};

    Note.renderNote = function (note) {
        $("#wmd-input").val(note.content);

        document.title = "Reading - " + note.title;

        //可以更新所有 class 为 file-title 的内容
        $(".file-title").text(note.title);

        $("#file-title-input").val(note.title);

        if (note.isBlog == false) {
            console.log("笔记");
            $("#action-publish-blog").show();
        } else {
            $("#action-update-blog").show();
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
        var title = $("#file-title").text();

        note.title = title;
        note.content = content;
    };

    return Note;
});