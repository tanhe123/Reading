/**
 * Created by tan on 14-12-29.
 */


/*
requirejs.config({
    baseUrl: 'res',

    map: { // To allow the direct css! usage, 请参考 https://github.com/guybedford/require-css
        '*': {
            'css': 'bower-libs/require-css/css'
        },
        '*': {
            'less': 'bower-libs/require-less/less' // path to less
        }
    },

    paths: {
        jquery: 'bower-libs/jquery/dist/jquery',
        underscore: 'bower-libs/underscore/underscore',
        pagedown: 'libs/Markdown.Editor',
        pagedownExtra: 'bower-libs/pagedown-extra/Markdown.Extra',
        crel: 'bower-libs/crel/crel',
        rangy: 'bower-libs/rangy/rangy-core',
        'rangy-cssclassapplier': 'bower-libs/rangy/rangy-cssclassapplier',
        text: 'bower-libs/requirejs-text/text',
        bootstrap: 'bower-libs/bootstrap/dist/js/bootstrap',
        diff_match_patch: 'bower-libs/google-diff-match-patch-js/diff_match_patch',
        diff_match_patch_uncompressed: 'bower-libs/google-diff-match-patch-js/diff_match_patch_uncompressed'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        diff_match_patch_uncompressed: {
            exports: 'diff_match_patch'
        },
        pagedown: [
            'libs/Markdown.Converter'
        ],
        pagedownExtra: [
            'libs/Markdown.Converter'
        ],
        rangy: {
            exports: 'rangy'
        },
        'rangy-cssclassapplier': [
            'rangy'
        ],
        bootstrap: [
            'jquery'
        ]
    }
});


var themeModule = "less!themes/default";

require([
    "jquery",
    "rangy",
    'core',
    //todo: fileMgr 暂时放在这里，因为不能产生循环依赖
    "fileMgr",
    "eventMgr",
    themeModule
], function($, rangy, core, fileMgr, eventMgr) {

    // 文档加载完成后执行
    $(function () {

        rangy.init();

        // Here, all the modules are loaded and the DOM is ready
        core.onReady();


    });
});*/

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
            if (localStorage.fileSystem) {
                this.fileSystem = JSON.parse(localStorage.fileSystem);
                if (localStorage.currentFile)
                    this.selectFile(localStorage.currentFile);
                else
                    this.selectFile(Object.keys(this.fileSystem)[0]);
            } else {
                this.fileSystem = {};
                this.createFile("New file");
            }
            window.setInterval(function() {
                fileManager.saveFile();
            }, 5000);
        };

        fileManager.createFile = function(filename) {
            this.fileSystem[filename] = "blah blah";
            this.selectFile(filename);
        };

        fileManager.selectFile = function(filename) {
            this.currentFile = filename;
            this.content = this.fileSystem[this.currentFile];
            $("#wmd-input").val(this.content);
            $("#info-filename").text(filename);
        };

        fileManager.saveFile = function() {
            this.content = $("#wmd-input").val();
            this.fileSystem[this.currentFile] = this.content;
            localStorage.fileSystem = JSON.stringify(this.fileSystem);
            localStorage.currentFile = this.currentFile;
        };

        return fileManager;
    })(jQuery);



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