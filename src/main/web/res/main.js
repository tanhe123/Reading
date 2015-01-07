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
        pagedown: 'libs/Markdown.Editor',
        pagedownExtra: 'bower-libs/pagedown-extra/Markdown.Extra',
        crel: 'bower-libs/crel/crel',
        rangy: 'bower-libs/rangy/rangy-core',
        'rangy-cssclassapplier': 'bower-libs/rangy/rangy-cssclassapplier',
        text: 'bower-libs/requirejs-text/text',
        bootstrap: 'bower-libs/bootstrap/dist/js/bootstrap'
    },
    shim: {
        underscore: {
            exports: '_'
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
});