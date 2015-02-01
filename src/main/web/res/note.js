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
        var content = $("#wmd-input").val();
        var title = $("#file-title").text();

        var params = {
            noteId: note.id,
            title: title,
            content: content
        };

        $.post("/note/updateNoteTitleOrContent", params, function (rs) {
            if (rs !== true) {
                alert("获取文章内容失败");
            }
        });
    };

    return Note;
});