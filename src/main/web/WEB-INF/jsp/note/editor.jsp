<!DOCTYPE html>

<%--
  Created by IntelliJ IDEA.
  User: tan
  Date: 15-3-21
  Time: 下午9:17
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html lang="zh">
<head>
    <meta charset="utf-8" />
    <title>Use require.js - Editor.md examples</title>
    <link rel="stylesheet" href="http://pandao.github.io/editor.md/examples/css/style.css" />
    <link rel="stylesheet" href="http://pandao.github.io/editor.md/lib/codemirror/codemirror.min.css" />
    <!-- <link rel="stylesheet" href="../lib/codemirror/addon/fold/foldgutter.css" /> -->
    <link rel="stylesheet" href="http://pandao.github.io/editor.md/css/editormd.min.css" />
    <link rel="shortcut icon" href="https://pandao.github.io/editor.md/favicon.ico" type="image/x-icon" />
</head>
<body>
<div id="layout">
    <header>
        <h1>Use require.js</h1>
        <ul style="margin: 10px 0 0 18px;">
            <li>Enable HTML tags decode</li>
            <li>Enable TeX, Flowchart, Sequence Diagram, Emoji, FontAwesome, Task lists</li>
            <li>Enable Image upload</li>
        </ul>
    </header>
    <div class="btns">
        <button id="show-btn">Show editor</button>
        <button id="hide-btn">Hide editor</button>
        <button id="get-md-btn">Get Markdown</button>
        <button id="get-html-btn">Get HTML</button>
        <button id="watch-btn">Watch</button>
        <button id="unwatch-btn">Unwatch</button>
        <button id="preview-btn">Preview HTML(Press ESC cancel)</button>
        <button id="fullscreen-btn">Fullscreen (Press ESC cancel)</button>
        <button id="show-toolbar-btn">Show toolbar</button>
        <button id="close-toolbar-btn">Hide toolbar</button>
    </div>
    <div id="test-editormd"></div>
</div>
<script src="http://pandao.github.io/editor.md/examples/js/require.min.js"></script>
<script type="text/javascript">
    requirejs.config({
        baseUrl: "/res/bower-libs/editor.md/lib/",
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
        editormd.loadCSS("/res/bower-libs/editor.md/lib/codemirror/addon/fold/foldgutter");

        $.get('test.md', function(md) {
            testEditor = editormd("test-editormd", {
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
                imageUploadURL : "/image",
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
</script>
</body>
</html>