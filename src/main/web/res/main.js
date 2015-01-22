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
        layout: 'libs/jquery.layout'
    },

    shim: {
        'jquery-ui': ['jquery'],
        'bootstrap': ['jquery'],
        'jgrowl': ['jquery'],
        'layout': ['jquery-ui'],
        pagedown: [
            'libs/Markdown.Converter', 'libs/Markdown.Sanitizer'
        ]
    }
});

require(["jquery", "core", "fileManager"], function ($, core, fileManager) {
    $(function() {
        core.init();

        fileManager.init();
    });
});

