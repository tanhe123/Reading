/**
 * Created by tan on 14-12-29.
 */

requirejs.config({
    baseUrl: '/res',

    map: {
        '*': {
            'less': 'bower-libs/require-less/less' // path to less
        }
    },

    paths: {
        jquery: 'bower-libs/jquery/dist/jquery',
        'jquery.ui.widget': 'bower-libs/jquery-file-upload/js/vendor/jquery.ui.widget',
        jgrowl: 'bower-libs/jgrowl/jquery.jgrowl',
        bootstrap: 'bower-libs/bootstrap/dist/js/bootstrap',
        //pagedown: 'libs/Markdown.Editor',
        //layout: 'libs/jquery.layout',
        pagedownExtra: 'bower-libs/pagedown-extra/Markdown.Extra',
        prettify: "bower-libs/google-code-prettify/bin/prettify.min",
        FileSaver: "bower-libs/file-saver/FileSaver",
        underscore: "bower-libs/underscore/underscore",
        MathJax: "bower-libs/MathJax/MathJax.js?config=TeX-AMS_HTML",
        fileupload: "bower-libs/jquery-file-upload/js/jquery.fileupload",
        'pagedown-ace': 'bower-libs/pagedown-ace/Markdown.Editor',
        ace: "bower-libs/ace-builds/src-noconflict/ace"
    },

    shim: {
        'jquery-ui': ['jquery'],
        'bootstrap': ['jquery'],
        'jgrowl': ['jquery'],
        'layout': ['jquery-ui'],
        'libs/Markdown.Sanitizer': [
            'libs/Markdown.Converter'
        ],
        //pagedown: [
        //    'libs/Markdown.Converter', 'libs/Markdown.Sanitizer'
        //],
        //pagedownExtra:[
        //    "pagedown", "prettify"
        //],
        underscore: {
            exports: '_',
            deps: ["jquery"]
        },
        fileupload: [
            "jquery", "jquery.ui.widget"
        ],
        'pagedown-ace': [
            'bower-libs/pagedown-ace/Markdown.Converter', 'ace'
        ],
        /*'libs/ace': {
            deps: ["underscore", "jquery"],
            exports: "ace"
        },*/
        'pagedownExtra': [
            'pagedown-ace', "prettify"
        ]
    }
});

require([
    "jquery",
    "core",
    "fileManager",
    "fileupload",
    "less!css/main"], function ($, core, fileManager) {

    $(function() {
        core.init();

        fileManager.init();
    });
});

