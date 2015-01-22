/**
 * Created by tan on 14-12-29.
 */

requirejs.config({
    baseUrl: 'res',

    paths: {
        jquery: 'bower-libs/jquery/dist/jquery',
        'jquery-ui': 'libs/jquery-ui',
        jgrowl: 'bower-libs/jgrowl/jquery.jgrowl',
        bootstrap: 'bower-libs/bootstrap/dist/js/bootstrap',
        pagedown: 'libs/Markdown.Editor',
        layout: 'libs/jquery.layout',
        pagedownExtra: 'bower-libs/pagedown-extra/Markdown.Extra',
        prettify: "bower-libs/google-code-prettify/bin/prettify.min"
    },

    shim: {
        'jquery-ui': ['jquery'],
        'bootstrap': ['jquery'],
        'jgrowl': ['jquery'],
        'layout': ['jquery-ui'],
        pagedown: [
            'libs/Markdown.Converter', 'libs/Markdown.Sanitizer'
        ],
        pagedownExtra:[
            "pagedown", "prettify"
        ]
    }
});

require(["jquery", "core", "fileManager"], function ($, core, fileManager) {
    $(function() {
        core.init();

        fileManager.init();
    });
});

