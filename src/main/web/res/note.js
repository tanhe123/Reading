/**
 * Created by tan on 15-2-1.
 */

define([], function() {
    var Note = {};

    Note.curNoteId = "";
    Note.cache = {};
    Note.notes = [];


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

    Note.moveCurNote = function (notebookId, callback) {
        this.moveNote(this.curNoteId, notebookId, callback);
    };

    Note.moveNote = function (noteId, notebookId, callback) {
        var self = this;

        var params = {
            noteId: noteId,
            notebookId: notebookId
        };

        console.log("params: " + params);

        $.post("/note/moveNote", params, function (rs) {
            console.log("moveNote:" + rs);

            //    更新当前note的 notebookId
            self.getCurNote().notebookId = notebookId;

            console.log("note.js: 当前笔记 notebookId: " + self.getCurNote().notebookId);

            if (callback) {
                callback();
            }
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



    // 显示笔记列表
    Note.renderNoteList = function (notes) {

        if (!notes || typeof notes != "object" || notes.length < 0) {
            notes = [];
        }

        this.notes = notes;

        //要存放的容器
        var noteList = $(".NoteListContainer .slidingPanel");

        //　加入之前先清空
        noteList.empty();

        for (var i in notes) {

            var note = notes[i];

            var noteItem = $("<li><div>" + note.updateTime +"</div><div>" + note.title + "</div><div>" + note.content + "</div></li>")
            noteItem.data("noteId", note.id);

            noteItem.appendTo(noteList);
        }
    };

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