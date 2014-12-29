/**
 * Created by tan on 14-12-29.
 */


requirejs.config({
    baseUrl: 'res',

    paths: {
        jquery: 'bower-libs/jquery/dist/jquery',
        pagedown: 'bower-libs/pagedown/Markdown.Editor',
        pagedownExtra: 'bower-libs/pagedown-extra/Markdown.Extra',
        text: 'bower-libs/requirejs-text/text'

    },
    shim: {
        pagedown: [
            'bower-libs/pagedown/Markdown.Converter'
        ],
        pagedownExtra: [
            'bower-libs/pagedown/Markdown.Converter'
        ]
    }
});

require(["jquery", 'core'], function($) {
   alert("main.js");
});