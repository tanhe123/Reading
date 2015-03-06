/**
 * Created by tan on 15-2-1.
 */

define([], function() {
    var Note = {};

    Note.curNoteId = "";
    Note.cache = {};

    /**
     * 缓存笔记
     */
    Note.addNoteCache = function (note) {
        Note.cache[note.id] = note;
    };

    /**
     * 从缓存中获得 Note
     */
    Note.getNoteCache = function (noteId) {
        return this.cache[noteId];
    };

    Note.getCurNote = function () {
        return this.getNoteCache(this.curNoteId);
    };

    // 显示笔记
    Note.renderNote = function (note) {
        // 修改网站标题
        document.title = note.title;

        // 设置标题
        $("#note-title").val(note.title);

        // 设置笔记内容
        $("#wmd-input").val(note.content);

        if (note.blog == false) {
            console.log("笔记");
            //$("#action-publish-blog").show();
        } else {
            //$("#action-update-blog").show();
            console.log("博客");
        }
    };

    Note.queryNote = function (noteId, callback) {

        $.getJSON("/note/getNoteContent?noteId=" + noteId, function (note) {

            Note.curNoteId = noteId;
            Note.addNoteCache(note);

            if (callback) {
                callback(note);
            }
        });
    };

    Note.moveNote = function (noteId, notebookId) {
        var params = {
            noteId: noteId,
            notebookId: notebookId
        };

        console.log("params: " + params);

        $.post("/note/moveNote", params, function (rs) {
            console.log("moveNote:" + rs);
        });
    };

    Note.updateContentAndTitle = function () {
        updateNote();

        var note = this.getCurNote();

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

    /*Note.publish = function () {

        $.post("/note/" + note.id + "/publish", function (rs) {
            console.log(rs);

            if (rs === true) {
                $("#action-publish-blog").hide();
                $("#action-update-blog").show();
            }
        });
    };*/

    /**
     * 将最新的内容更新至全局变量 note
     */
    var updateNote = function () {
        var content = $("#wmd-input").val();
        var title = $("#note-title").val();

        var note = Note.getCurNote();

        note.title = title;
        note.content = content;
    };

    return Note;
});