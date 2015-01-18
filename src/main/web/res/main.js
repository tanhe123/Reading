/**
 * Created by tan on 14-12-29.
 */
(function($) {
    $(function() {
        var converter = Markdown.getSanitizingConverter();
        var editor = new Markdown.Editor(converter);
        editor.run();
        $(window).resize(resize);
        resize();

        if (typeof (Storage) !== "undefined") {
            fileManager.init();
        } else {
            showError("Web storage is not available");
        }
    });

    var fileManager = (function($) {
        var fileManager = {};

        fileManager.init = function() {
            // 如果有缓存的文件
            if (localStorage.fileSystem) {
                this.fileSystem = JSON.parse(localStorage.fileSystem);
                if (localStorage.currentFile) // 如果保存了当前的文件
                    this.selectFile(localStorage.currentFile);
                else
                    // 获得 filesystem 中的第一个可枚举属性或方法
                    this.selectFile(Object.keys(this.fileSystem)[0]);
            } else {
                // 初始化
                this.fileSystem = {};
                this.createFile("New file");
            }

            // 自动调用保存
            window.setInterval(function() {
                fileManager.saveFile();
            }, 5000);
        };

        // 新建一个文件
        fileManager.createFile = function(filename) {
            this.fileSystem[filename] = "blah blah";
            this.selectFile(filename);
        };

        // 选择一个文件
        fileManager.selectFile = function(filename) {
            this.currentFile = filename;
            this.content = this.fileSystem[this.currentFile];
            $("#wmd-input").val(this.content);
            $("#info-filename").text(filename);
        };

        // 保存文件
        fileManager.saveFile = function() {
            this.content = $("#wmd-input").val();
            this.fileSystem[this.currentFile] = this.content;
            localStorage.fileSystem = JSON.stringify(this.fileSystem);
            localStorage.currentFile = this.currentFile;
        };

        return fileManager;
    })(jQuery);


    $()

    function resize() {
        $("#wmd-input").width($(window).width() / 2 - 60).height(
            $(window).height() - 70);
        $("#wmd-preview").width($(window).width() / 2 - 60).height(
            $(window).height() - 100);
    }

    function showError(msg) {
        alert(msg);
    }
})(jQuery);