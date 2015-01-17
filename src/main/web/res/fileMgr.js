/**
 * Created by tan on 15-1-3.
 */
define([
    "jquery",
    "underscore",
    "constants",
    "core",
    "eventMgr",
    "classes/FileDescriptor",
    "text!WELCOME.md"
], function($, _, constants, core, eventMgr, FileDescriptor, welcomeContent) {
    var fileMgr = {};

    // Defines the current file
    fileMgr.currentFile = undefined;

    // Set the current file and refresh the editor
    fileMgr.selectFile = function (fileDesc) {
        console.log("fileMgr: selectFile");

        fileDesc = fileDesc || fileMgr.currentFile;

        if (fileDesc === undefined) {
            //var fileSystemSize = _.size(fileSystem);
            //if(fileSystemSize === 0) {
                // If fileSystem empty create one file
                fileDesc = fileMgr.createFile(constants.WELCOME_DOCUMENT_TITLE, welcomeContent);
            //}
            //else {
                // Select the last selected file
                //fileDesc = _.max(fileSystem, function(fileDesc) {
                //    return fileDesc.selectTime || 0;
                //});
            //}
        }

        // 如果当前打开的文件不是要打开的文件
        if (fileMgr.currentFile !== fileDesc) {
            fileMgr.currentFile = fileDesc;
            fileDesc.selectTime = new Date().getTime();

            // Notify extensions
            // 这里通知了 markdownSectionParser，让其更新保持的文件
            eventMgr.onFileSelected(fileDesc);

            // Hide the viewer pencil button
            //$(".action-edit-document").toggleClass("hide", fileDesc.fileIndex != constants.TEMPORARY_FILE_INDEX);

            core.initEditor(fileDesc);
        }
    };

    fileMgr.createFile = function(title, content) {
        var fileDesc = new FileDescriptor(title, content);

        // todo: 这里会通知:
        // extensions/documentSelector.js
        // extensions/documentPanel.js
        // documentManager.js
        // buttonSync.js
        // synchronizer.js
        eventMgr.onFileCreated(fileDesc);

        return fileDesc;
    };

    eventMgr.addListener("onReady", function () {

        console.log("fileMgr: onReady");

        var $editorElt = $("#wmd-input");
        fileMgr.selectFile();

        //todo: 省略 ...


    });
    
    return fileMgr;
});