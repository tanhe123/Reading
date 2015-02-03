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
        core.init();

        fileManager.init();
    });
});

