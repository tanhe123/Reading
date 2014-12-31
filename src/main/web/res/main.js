/**
 * Created by tan on 14-12-29.
 */


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
        pagedown: 'bower-libs/pagedown/Markdown.Editor',
        pagedownExtra: 'bower-libs/pagedown-extra/Markdown.Extra',
        text: 'bower-libs/requirejs-text/text',
        bootstrap: 'bower-libs/bootstrap/dist/js/bootstrap'
    },
    shim: {
        underscore: {
            exports: '_'
        },
        pagedown: [
            'bower-libs/pagedown/Markdown.Converter'
        ],
        pagedownExtra: [
            'bower-libs/pagedown/Markdown.Converter'
        ],
        bootstrap: [
            'jquery'
        ]
    }
});


var themeModule = "less!themes/default";

require([
    "jquery",
    'core',
    themeModule
], function($, core) {

});