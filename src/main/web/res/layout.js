/**
 * Created by tan on 15-1-2.
 */
define([
    'jquery',
    'underscore',
    'constants',
    'eventMgr',
    'crel'
], function ($, _, constants, eventMgr, crel) {
    var layout = {};


    var wrapperL1, wrapperL2, wrapperL3;
    var editor, previewPanel, previewContainer, previewPanel, previewContainer;

    var resizerSize = 32;

    var editorMinSize = {
        width: 250,
        height: 140
    };

    var previewMinSize = {
        width: 330,
        height: 160
    };

    //var menuPanelWidth = 280;
    //var navbarHeight = 50;

    function DomObject(selector) {
        this.selector = selector;
        this.elt = document.querySelector(selector);
        this.$elt = $(this.elt);
    }

    DomObject.prototype.applyCss = function() {
        // Top/left/Bottom/Right
        this.top !== undefined && (this.elt.style.top = this.top + 'px');
        this.left !== undefined && (this.elt.style.left = this.left + 'px');
        this.bottom !== undefined && (this.elt.style.bottom = this.bottom + 'px');
        this.right !== undefined && (this.elt.style.right = this.right + 'px');

        // Translate
        if(this.x !== undefined || this.y !== undefined) {
            this.x = this.x || 0;
            this.y = this.y || 0;
            this.elt.style['-webkit-transform'] = 'translate(' + this.x + 'px, ' + this.y + 'px)';
            this.elt.style['-ms-transform'] = 'translate(' + this.x + 'px, ' + this.y + 'px)';
            this.elt.style.transform = 'translate(' + this.x + 'px, ' + this.y + 'px)';
        }

        // Width (deferred when animate if new width is smaller)
        //if(animate && this.width < this.oldWidth) {
        //    transitionEndCallbacks.push(_.bind(function() {
        //        this.elt.style.width = this.width + 'px';
        //    }, this));
        //}
        //else {
            this.width !== undefined && (this.elt.style.width = this.width + 'px');
        //}
        this.oldWidth = this.width;

        // Height (deferred when animate if new height is smaller)
        //if(animate && this.height < this.oldHeight) {
        //    transitionEndCallbacks.push(_.bind(function() {
        //        this.elt.style.height = this.height + 'px';
        //    }, this));
        //}
        //else {
            this.height !== undefined && (this.elt.style.height = this.height + 'px');
        //}
        this.oldHeight = this.height;

        // Just in case transitionEnd event doesn't happen
        //clearTimeout(transitionEndTimeoutId);
        //animate && (transitionEndTimeoutId = setTimeout(onTransitionEnd, 800));

        // todo: 未完


    };

    // todo: 这个是自己添加的，应该是从从配置中读取的
    var settings = {maxWidthRatio: 1};

    var maxWidthMap = [
        { screenWidth: 0, maxWidth: 600 * settings.maxWidthRatio },
        { screenWidth: 1000, maxWidth: 700 * settings.maxWidthRatio },
        { screenWidth: 1200, maxWidth: 800 * settings.maxWidthRatio },
        { screenWidth: 1400, maxWidth: 900 * settings.maxWidthRatio }
    ];
    var maxWidthMapReversed = maxWidthMap.slice(0).reverse();

    function getMaxWidth() {
        return _.find(maxWidthMapReversed, function(value) {
            return windowSize.width > value.screenWidth;
        }).maxWidth;
    }

    function onResize() {
        var paddingBottom = wrapperL3.height - 60;

        var editorPadding = (editor.elt.offsetWidth - getMaxWidth()) / 2;
        console.log(editor.elt.offsetWidth);
        console.log(editorPadding);

        if(editorPadding < constants.EDITOR_DEFAULT_PADDING) {
            editorPadding = constants.EDITOR_DEFAULT_PADDING;
        }

        editorContentElt.style.paddingLeft = editorPadding + 'px';
        editorContentElt.style.paddingRight = editorPadding + 'px';
        editorContentElt.style.paddingBottom = paddingBottom + 'px';
        //editorMarginElt.style.width = editorPadding + 'px';

        var previewPadding = (previewContainer.elt.offsetWidth - getMaxWidth()) / 2;
        if(previewPadding < constants.EDITOR_DEFAULT_PADDING) {
            previewPadding = constants.EDITOR_DEFAULT_PADDING;
        }
        previewContentElt.style.paddingLeft = previewPadding + 'px';
        previewContentElt.style.paddingRight = previewPadding + 'px';
        previewContentElt.style.paddingBottom = paddingBottom + 'px';

        //todo: 省略一些

        eventMgr.onLayoutResize();
    }

    layout.init = function () {

        console.log("layout.init");

        // Tweak the body element
        (function(bodyStyle) {
            bodyStyle.position = 'absolute';
            bodyStyle.top = 0;
            bodyStyle.left = 0;
            bodyStyle.bottom = 0;
            bodyStyle.right = 0;
            bodyStyle.overflow = 'hidden';
        })(document.body.style);
        document.documentElement.style.overflow = 'hidden';

        wrapperL1 = new DomObject('.layout-wrapper-l1');
        wrapperL2 = new DomObject('.layout-wrapper-l2');
        wrapperL3 = new DomObject('.layout-wrapper-l3');
        editor = new DomObject('#wmd-input');
        previewPanel = new DomObject('.preview-panel');
        previewContainer = new DomObject('.preview-container');

        editorContentElt = editor.elt.querySelector('.editor-content');
        previewContentElt = document.getElementById('preview-contents');


        previewPanel.isOpen = true;
        //previewPanel.createToggler();
        previewPanel.halfSize = true;
        //previewToggler.$elt.click(_.bind(previewPanel.toggle, previewPanel));

        var styleContent = '';

        // Apply font
        function applyFont(size, screenWidth) {
            screenWidth = screenWidth || 0;
            styleContent += [
                '@media (min-width: ' + screenWidth + 'px) {',
                '#wmd-input {',
                '   font-size: ' + size + 'px;',
                '}',
                '#preview-contents {',
                '   font-size: ' + size + 'px;',
                '}',
                '}'
            ].join('\n');
        }

        /*
        todo: fontSizeRatio 查到为1
        applyFont(16 * settings.fontSizeRatio);
        applyFont(17 * settings.fontSizeRatio, 600);
        applyFont(18 * settings.fontSizeRatio, 1200);
        */
        applyFont(16 * 1);
        applyFont(16 * 1, 600);
        applyFont(16*1, 1200);

        // Apply dynamic stylesheet
        var style = crel('style', {
            type: 'text/css'
        });
        style.innerHTML = styleContent;
        document.head.appendChild(style);

        reSizeAll();
    };

    function fixViewportScrolling() {
        // Fix a weird viewport behavior using pageup/pagedown in Webkit
        //wrapperL1.width = windowSize.width + menuPanelWidth + (documentPanel.isShown ? documentPanelWidth : 0);
        wrapperL1.width = windowSize.width + 0 +  0;
        wrapperL1.elt.style.width = wrapperL1.width + 'px';
        //documentPanel.right = documentPSanel.isShown ? 0 : -documentPanelWidth;
        //documentPanel.elt.style.right = documentPanel.right + 'px';
    }

    //todo: var isVertical = ettings.layoutOrientation == "vertical， 默认是水平分割的
    var isVertical = false;

    function reSizeAll() {
        windowSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        while(true) {

            // Layout wrapper level 1
            //todo: navbar.isOpen?
            wrapperL1.x = 0;
            wrapperL1.y = 0;
            //wrapperL1.width = windowSize.width + menuPanelWidth;
            wrapperL1.width = windowSize.width + 0;
            wrapperL1.height = windowSize.height - wrapperL1.y;


            // Layout wrapper level 2
            //wrapperL2.left = menuPanelWidth;
            wrapperL2.left = 0;
            wrapperL2.width = windowSize.width;
            wrapperL2.height = wrapperL1.height;

            // Layout wrapper level 3
            //wrapperL3.top = navbarHeight;
            wrapperL3.top = 0;
            wrapperL3.width = windowSize.width;
            //wrapperL3.height = wrapperL1.height - navbarHeight;
            wrapperL3.height = wrapperL1.height - 0;

            wrapperL1.applyCss();
            wrapperL2.applyCss();
            wrapperL3.applyCss();

            if(isVertical) {
                //if(!previewPanel.isOpen) {
                //    previewPanel.y = wrapperL3.height - resizerSize;
                //}
                //else {
                    if(previewPanel.halfSize) {
                        previewPanel.height = (wrapperL3.height + resizerSize) / 2;
                    }
                    if(previewPanel.height < previewMinSize.height) {
                        previewPanel.height = previewMinSize.height;
                    }
                    previewPanel.y = wrapperL3.height - previewPanel.height;
                    if(previewPanel.y < editorMinSize.height) {
                        var previewPanelHeight = wrapperL3.height - editorMinSize.height;
                        if(previewPanelHeight < previewMinSize.height) {
                            previewPanel.isOpen = false;
                            previewPanel.$elt.trigger('hide.layout.toggle').trigger('hidden.layout.toggle');
                            continue;
                        }
                        previewPanel.height = previewPanelHeight;
                        previewPanel.y = wrapperL3.height - previewPanel.height;
                    }
                //}

                previewPanel.width = wrapperL3.width;
                editor.height = previewPanel.y;
                editor.width = wrapperL3.width;
                previewContainer.top = resizerSize;
                previewContainer.height = previewPanel.height - resizerSize;
                previewContainer.width = previewPanel.width;
                //navbarToggler.width = togglerSize;
                //previewToggler.width = togglerSize;
                //previewToggler.x = (previewPanel.width - togglerSize) / 2;
                //previewResizer.width = previewContainer.width;
            } else {
                //if(!previewPanel.isOpen) {
                //    previewPanel.x = wrapperL3.width - resizerSize;
                //}
                //else {
                    if(previewPanel.halfSize) {
                        previewPanel.width = (wrapperL3.width + resizerSize) / 2;
                    }
                    if(previewPanel.width < previewMinSize.width) {
                        previewPanel.width = previewMinSize.width;
                    }
                    previewPanel.x = wrapperL3.width - previewPanel.width;
                console.log("previewPanel.x:" + previewPanel.x + " wrapperL3.width:" + wrapperL3.width + " previewPanel.width:" + previewPanel.width);
                    if(previewPanel.x < editorMinSize.width) {
                        var previewPanelWidth = wrapperL3.width - editorMinSize.width;
                        if(previewPanelWidth < previewMinSize.width) {
                            previewPanel.isOpen = false;
                            previewPanel.$elt.trigger('hide.layout.toggle').trigger('hidden.layout.toggle');
                            continue;
                        }
                        previewPanel.width = previewPanelWidth;
                        previewPanel.x = wrapperL3.width - previewPanel.width;
                    }
                //}
                previewPanel.height = wrapperL3.height;
                editor.width = previewPanel.x;
                editor.height = wrapperL3.height;
                previewContainer.left = resizerSize;
                previewContainer.width = previewPanel.width - resizerSize;
                previewContainer.height = previewPanel.height;
                //navbarToggler.height = togglerSize;
                //previewToggler.height = togglerSize;
                //previewToggler.y = (previewPanel.height - togglerSize) / 2;
                //previewResizer.height = previewContainer.height;
            }



            //todo: 不明白为什么要用 while
            break;
        }

        editor.applyCss();
        previewPanel.applyCss();
        previewContainer.applyCss();
        //previewToggler.applyCss();
        //previewResizer.applyCss();
        //navbarToggler.applyCss();

        fixViewportScrolling();
        //previewButtons.adjustPosition();

        onResize();
    }

    return layout;
});

