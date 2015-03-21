/**
 * Created by tan on 14-12-29.
 */

/*
requirejs.config({
    baseUrl: '/res',

    map: {
        '*': {
            'less': 'bower-libs/require-less/less' // path to less
        }
    },

    paths: {
        jquery: 'bower-libs/jquery/dist/jquery',
        //'jquery-ui': 'libs/jquery-ui',
        jgrowl: 'bower-libs/jgrowl/jquery.jgrowl',
        bootstrap: 'bower-libs/bootstrap/dist/js/bootstrap',
        pagedown: 'libs/Markdown.Editor',
        //layout: 'libs/jquery.layout',
        pagedownExtra: 'bower-libs/pagedown-extra/Markdown.Extra',
        prettify: "bower-libs/google-code-prettify/bin/prettify.min",
        FileSaver: "bower-libs/file-saver/FileSaver",
        underscore: "bower-libs/underscore/underscore",
        MathJax: "bower-libs/MathJax/MathJax.js?config=TeX-AMS_HTML"
    },

    shim: {
        'jquery-ui': ['jquery'],
        'bootstrap': ['jquery'],
        'jgrowl': ['jquery'],
        'layout': ['jquery-ui'],
        'libs/Markdown.Sanitizer': [
            'libs/Markdown.Converter'
        ],
        pagedown: [
            'libs/Markdown.Converter', 'libs/Markdown.Sanitizer'
        ],
        pagedownExtra:[
            "pagedown", "prettify"
        ],
        underscore: {
            exports: '_'
        }
    }
});

require([
    "jquery",
    "core",
    "fileManager",
    "less!css/main"], function ($, core, fileManager) {

    $(function() {
        //$("#loading").show();

        core.init();

        fileManager.init();
    });
});

*/


// editor.md

requirejs.config({
    baseUrl: "/res/bower-libs/editor.md/lib",
    paths: {
        jquery          : "../examples/js/jquery.min",
        marked          : "marked.min",
        prettify        : "prettify.min",
        raphael         : "raphael.min",
        underscore      : "underscore.min",
        flowchart       : "flowchart.min",
        jqueryflowchart : "jquery.flowchart.min",
        sequenceDiagram : "sequence-diagram.min",
        katex           : "http://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min",
        editormd        : "../editormd.amd" // Using Editor.md amd version for Require.js
    },
    shim: {
        jqueryflowchart: ["flowchart"]
    },
    waitSeconds: 30
});

var deps = [
    "editormd",
    "../languages/en",
    "../plugins/link-dialog/link-dialog",
    "../plugins/anchor-link-dialog/anchor-link-dialog",
    "../plugins/image-dialog/image-dialog",
    "../plugins/code-block-dialog/code-block-dialog",
    "../plugins/table-dialog/table-dialog",
    "../plugins/emoji-dialog/emoji-dialog",
    "../plugins/help-dialog/help-dialog",
    "../plugins/html-entities-dialog/html-entities-dialog",
    "../plugins/preformatted-text-dialog/preformatted-text-dialog"
];

var testEditor;

require(deps, function(editormd) {

    // if enable codeFold
    // or <link rel="stylesheet" href="../lib/codemirror/addon/fold/foldgutter.css" />
    editormd.loadCSS("res/bower-libs/editor.md/lib/codemirror/addon/fold/foldgutter");

    $.get('test.md', function(md) {
        testEditor = editormd("test-editormd", {
            path: "",
            width: "90%",
            height: 640,
            path : '/res/bower-libs/editor.md/lib/',
            markdown : md,
            codeFold : true,
            searchReplace : true,
            saveHTMLToTextarea : true,    // 保存HTML到Textarea
            htmlDecode : true,            // 开启HTML标签解析，为了安全性，默认不开启
            emoji : true,
            taskList : true,
            tex : true,
            autoLoadModules : false,
            previewCodeHighlight : true,
            flowChart : true,
            sequenceDiagram : true,
            //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
            //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
            //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
            //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
            //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
            imageUpload : true,
            imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
            imageUploadURL : "./php/upload.php",
            onload : function() {
                console.log('onload', this);
                //this.fullscreen();
                //this.unwatch();
                //this.watch().fullscreen();

                //this.setMarkdown("#PHP");
                //this.width("100%");
                //this.height(480);
                //this.resize("100%", 640);
            }
        });
    });

    $("#show-btn").bind('click', function(){
        testEditor.show();
    });

    $("#hide-btn").bind('click', function(){
        testEditor.hide();
    });

    $("#get-md-btn").bind('click', function(){
        alert(testEditor.getMarkdown());
    });

    $("#get-html-btn").bind('click', function() {
        alert(testEditor.getHTML());
    });

    $("#watch-btn").bind('click', function() {
        testEditor.watch();
    });

    $("#unwatch-btn").bind('click', function() {
        testEditor.unwatch();
    });

    $("#preview-btn").bind('click', function() {
        testEditor.previewing();
    });

    $("#fullscreen-btn").bind('click', function() {
        testEditor.fullscreen();
    });

    $("#show-toolbar-btn").bind('click', function() {
        testEditor.showToolbar();
    });

    $("#close-toolbar-btn").bind('click', function() {
        testEditor.hideToolbar();
    });
});
