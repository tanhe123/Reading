/**
 * Created by tan on 15-2-6.
 */

define(["note"], function(Note) {
    //todo: addnote 刷新显示

    var Notebook = {};

    Notebook.cache = {};  // notebookId => {};
    Notebook.notebooks = []; // 按次序

    //　这里只是显示条目
    //　而具体的细节，需要选定 note　时设置
    Notebook.renderNotebooks = function (notebooks) {
        var self = this;

        if (!notebooks || typeof notebooks != "object" || notebooks.length < 0) {
            notebooks = [];
        }

        Notebook.notebooks = notebooks; // 缓存
        this.cacheNotebooks(notebooks);

        Notebook.renderNav();
    };

    // 缓存 notebooks
    Notebook.cacheNotebooks = function (notebooks) {
        var self = this;
        for (var i in notebooks) {
            var notebook = notebooks[i];
            Notebook.cache[notebook.id] = notebook;
        }
    };

    //改为在 jsp　中获取
    Notebook.init = function () {
        var self = this;

        $.getJSON("/notebook", function (notebooks) {
            console.log("notebooks: " + JSON.stringify(notebooks));

            self.renderNotebooks(notebooks);
        });
    };

    //将 notebooks 显示在 页面
    Notebook.renderNav = function () {

        // 要添加的面板
        var slidingPanel = $(".noteBookSelect .slidingPanel");

        //　加入之前先清空
        slidingPanel.empty();

        //　以后可以去掉
        if (this.notebooks == null || this.notebooks.length <= 0) {
            slidingPanel.hide();
            return;
        } else {
            slidingPanel.show();
        }

        var notebooks = Notebook.notebooks;

        //表示当前选中的 notebook
        var index;

        for (var i in notebooks) {
            var note = Note.getCurNote();

            //console.log(note);

            var notebook = notebooks[i];

            var notebookItem = $("<li><div class=\"notebook\">" + notebook.title + "</div><div class=\"selectState\"><i class=\"fa fa-check\"></i></div></li>");
            notebookItem.data("notebookId", notebook.id);

            if (note.notebookId === notebook.id) {
                index = i;
                notebookItem.addClass("select");
            }

            notebookItem.appendTo(slidingPanel)
        }

        if (index !== null) { //todo: 可能为null
            var curNotebook = notebooks[index];
            $("#curNotebookTitle").text(curNotebook.title);
        }
    };

    // 得到notebook标题, 给note显示其notebook标题用
    Notebook.getNotebook = function(notebookId) {
        return Notebook.cache[notebookId];
    };


    Notebook.getNotebookTitle = function(notebookId) {
        var notebook = Notebook.cache[notebook];
        if (notebook) {
            return notebook.title;
        } else {
            return null;
        }
    };

    /**
     * 创建笔记本
     * @param notebookTitle
     */
    Notebook.createNotebook = function (notebookTitle) {
        $.post("/notebook", {"notebookTitle": notebookTitle}, function (rs) {
            console.log("createNotebook:" + rs);

        //    创建成功, 返回
            $(".createNotebookContainer").hide();
        });
    };

    return Notebook;
});