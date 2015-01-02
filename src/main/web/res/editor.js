/**
 * Created by tan on 14-12-31.
 */
define([
    'jquery',
    'underscore',
    'eventMgr'
], function ($, _, eventMgr) {

    var editor = {};

    var inputElt;
    var $inputElt;
    var contentElt;
    var $contentElt;
    var marginElt;
    var $marginElt;
    var previewElt;
    var pagedownEditor;
    var trailingLfNode;


    editor.init = function() {
        //todo:
        console.log("editor.init");

        inputElt = document.getElementById('wmd-input');
        $inputElt = $(inputElt);
        contentElt = inputElt.querySelector('.editor-content');
        $contentElt = $(contentElt);

        previewElt = document.querySelector('.preview-container');


    };

    return editor;
});