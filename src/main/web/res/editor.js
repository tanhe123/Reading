/**
 * Created by tan on 14-12-31.
 */
define([
    'jquery',
    'underscore',
    'eventMgr',
    'crel'
], function ($, _, eventMgr, crel) {

    var editor = {};

    var scrollTop = 0;
    var inputElt;
    var $inputElt;
    var contentElt;
    var $contentElt;
    var marginElt;
    var $marginElt;
    var previewElt;
    var pagedownEditor;
    var trailingLfNode;

    var fileChanged = true;
    var fileDesc;

    var refreshPreviewLater = (function() {
        var elapsedTime = 0;
        var timeoutId;
        var refreshPreview = function() {
            var startTime = Date.now();
            pagedownEditor.refreshPreview();
            elapsedTime = Date.now() - startTime;
        };
        //todo: if(settings.lazyRendering === true) {
        if(true === true) {
            return _.debounce(refreshPreview, 500);
        };
        return function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(refreshPreview, elapsedTime < 2000 ? elapsedTime : 2000);
        };
    })();


    eventMgr.addListener('onPagedownConfigure', function(pagedownEditorParam) {
        pagedownEditor = pagedownEditorParam;
    });

    var isComposing = 0;
    eventMgr.addListener('onSectionsCreated', function(newSectionList) {
        if(!isComposing) {
            //todo: 会自动补空格问题
            /*updateSectionList(newSectionList);
            highlightSections();*/
        }
        if(fileChanged === true) {
            // Refresh preview synchronously
            pagedownEditor.refreshPreview();
        }
        else {
            refreshPreviewLater();
        }
    });

    eventMgr.addListener('onFileSelected', function(selectedFileDesc) {
        fileChanged = true;
        fileDesc = selectedFileDesc;
    });

    // Used to detect editor changes
    function Watcher() {
        this.isWatching = false;
        var contentObserver;
        this.startWatching = function() {
            this.isWatching = true;
            contentObserver = contentObserver || new MutationObserver(checkContentChange);
            contentObserver.observe(contentElt, {
                childList: true,
                subtree: true,
                characterData: true
            });
        };
        this.stopWatching = function() {
            contentObserver.disconnect();
            this.isWatching = false;
        };
        this.noWatch = function(cb) {
            if(this.isWatching === true) {
                this.stopWatching();
                cb();
                this.startWatching();
            }
            else {
                cb();
            }
        };
    }

    var textContent;

    //todo:
    function checkContentChange() {
        console.log("editor: checkContentChange");

        var newTextContent = inputElt.textContent;
        if(contentElt.lastChild === trailingLfNode && trailingLfNode.textContent.slice(-1) == '\n') {
            newTextContent = newTextContent.slice(0, -1);
        }
        newTextContent = newTextContent.replace(/\r\n?/g, '\n'); // Mac/DOS to Unix

        if(fileChanged === false) {//todo: 内容改变
            if(newTextContent == textContent) {
                // User has removed the empty section
                if(contentElt.children.length === 0) {
                    contentElt.innerHTML = '';
                    sectionList.forEach(function(section) {
                        contentElt.appendChild(section.elt);
                    });
                    addTrailingLfNode();
                }
                return;
            }
            undoMgr.currentMode = undoMgr.currentMode || 'typing';
            var discussionList = _.values(fileDesc.discussionList);
            fileDesc.newDiscussion && discussionList.push(fileDesc.newDiscussion);
            //var updateDiscussionList = adjustCommentOffsets(textContent, newTextContent, discussionList);
            textContent = newTextContent;
            //if(updateDiscussionList === true) {
            //    fileDesc.discussionList = fileDesc.discussionList; // Write discussionList in localStorage
            //}
            fileDesc.content = textContent;
            //selectionMgr.saveSelectionState();
            eventMgr.onContentChanged(fileDesc, textContent);
            //updateDiscussionList && eventMgr.onCommentsChanged(fileDesc);
            //undoMgr.saveState();
            //triggerSpellCheck();
        }
        else {//todo: 文件改变
            textContent = newTextContent;
            fileDesc.content = textContent;
            //selectionMgr.setSelectionStartEnd(fileDesc.editorStart, fileDesc.editorEnd);
            //selectionMgr.updateSelectionRange();
            //selectionMgr.updateCursorCoordinates();
            //undoMgr.saveSelectionState();
            eventMgr.onFileOpen(fileDesc, textContent);
            previewElt.scrollTop = fileDesc.previewScrollTop;
            scrollTop = fileDesc.editorScrollTop;
            inputElt.scrollTop = scrollTop;
            fileChanged = false;
        }
    }


    function setValue(value) {
        var startOffset = diffMatchPatch.diff_commonPrefix(textContent, value);
        if(startOffset === textContent.length) {
            startOffset--;
        }
        var endOffset = Math.min(
            diffMatchPatch.diff_commonSuffix(textContent, value),
            textContent.length - startOffset,
            value.length - startOffset
        );
        var replacement = value.substring(startOffset, value.length - endOffset);
        var range = selectionMgr.createRange(startOffset, textContent.length - endOffset);
        range.deleteContents();
        range.insertNode(document.createTextNode(replacement));
        return {
            start: startOffset,
            end: value.length - endOffset
        };
    }

    editor.setValue = setValue;

    function getValue() {
        return textContent;
    }

    editor.getValue = getValue;

    var watcher = new Watcher();
    editor.watcher = watcher;



    function UndoMgr() {
        var undoStack = [];
        var redoStack = [];
        var lastTime;
        var lastMode;
        var currentState;
        var selectionStartBefore;
        var selectionEndBefore;
        this.setCommandMode = function() {
            this.currentMode = 'command';
        };
        this.setMode = function() {
        }; // For compatibility with PageDown
        this.onButtonStateChange = function() {
        }; // To be overridden by PageDown
        /*this.saveState = utils.debounce(function() {
            redoStack = [];
            var currentTime = Date.now();
            if(this.currentMode == 'comment' ||
                this.currentMode == 'replace' ||
                lastMode == 'newlines' ||
                this.currentMode != lastMode ||
                currentTime - lastTime > 1000) {
                undoStack.push(currentState);
                // Limit the size of the stack
                while(undoStack.length > 100) {
                    undoStack.shift();
                }
            }
            else {
                // Restore selectionBefore that has potentially been modified by saveSelectionState
                selectionStartBefore = currentState.selectionStartBefore;
                selectionEndBefore = currentState.selectionEndBefore;
            }
            currentState = {
                selectionStartBefore: selectionStartBefore,
                selectionEndBefore: selectionEndBefore,
                selectionStartAfter: selectionMgr.selectionStart,
                selectionEndAfter: selectionMgr.selectionEnd,
                content: textContent,
                discussionListJSON: fileDesc.discussionListJSON
            };
            lastTime = currentTime;
            lastMode = this.currentMode;
            this.currentMode = undefined;
            this.onButtonStateChange();
        }, this);
        this.saveSelectionState = _.debounce(function() {
            // Should happen just after saveState
            if(this.currentMode === undefined) {
                selectionStartBefore = selectionMgr.selectionStart;
                selectionEndBefore = selectionMgr.selectionEnd;
            }
        }, 50);*/
        this.canUndo = function() {
            return undoStack.length;
        };
        this.canRedo = function() {
            return redoStack.length;
        };
        /*function restoreState(state, selectionStart, selectionEnd) {
            // Update editor
            watcher.noWatch(function() {
                if(textContent != state.content) {
                    setValueNoWatch(state.content);
                    fileDesc.content = state.content;
                    eventMgr.onContentChanged(fileDesc, state.content);
                }
                selectionMgr.setSelectionStartEnd(selectionStart, selectionEnd);
                selectionMgr.updateSelectionRange();
                selectionMgr.updateCursorCoordinates(true);
                var discussionListJSON = fileDesc.discussionListJSON;
                if(discussionListJSON != state.discussionListJSON) {
                    var oldDiscussionList = fileDesc.discussionList;
                    fileDesc.discussionListJSON = state.discussionListJSON;
                    var newDiscussionList = fileDesc.discussionList;
                    var diff = jsonDiffPatch.diff(oldDiscussionList, newDiscussionList);
                    var commentsChanged = false;
                    _.each(diff, function(discussionDiff, discussionIndex) {
                        if(!_.isArray(discussionDiff)) {
                            commentsChanged = true;
                        }
                        else if(discussionDiff.length === 1) {
                            eventMgr.onDiscussionCreated(fileDesc, newDiscussionList[discussionIndex]);
                        }
                        else {
                            eventMgr.onDiscussionRemoved(fileDesc, oldDiscussionList[discussionIndex]);
                        }
                    });
                    commentsChanged && eventMgr.onCommentsChanged(fileDesc);
                }
            });

            selectionStartBefore = selectionStart;
            selectionEndBefore = selectionEnd;
            currentState = state;
            this.currentMode = undefined;
            lastMode = undefined;
            this.onButtonStateChange();
            adjustCursorPosition();
        }*/

        /*this.undo = function() {
            var state = undoStack.pop();
            if(!state) {
                return;
            }
            redoStack.push(currentState);
            restoreState.call(this, state, currentState.selectionStartBefore, currentState.selectionEndBefore);
        };
        this.redo = function() {
            var state = redoStack.pop();
            if(!state) {
                return;
            }
            undoStack.push(currentState);
            restoreState.call(this, state, state.selectionStartAfter, state.selectionEndAfter);
        };
        this.init = function() {
            var content = fileDesc.content;
            undoStack = [];
            redoStack = [];
            lastTime = 0;
            currentState = {
                selectionStartAfter: fileDesc.selectionStart,
                selectionEndAfter: fileDesc.selectionEnd,
                content: content,
                discussionListJSON: fileDesc.discussionListJSON
            };
            this.currentMode = undefined;
            lastMode = undefined;
            contentElt.textContent = content;
            // Force this since the content could be the same
            checkContentChange();
        };*/
    }


    var undoMgr = new UndoMgr();
    editor.undoMgr = undoMgr;

    editor.init = function() {
        //todo:
        console.log("editor.init");

        inputElt = document.getElementById('wmd-input');
        $inputElt = $(inputElt);
        contentElt = inputElt.querySelector('.editor-content');
        $contentElt = $(contentElt);

        previewElt = document.querySelector('.preview-container');

        watcher.startWatching();

        //todo: 监视滚动事件, 进行同步滚动

        Object.defineProperty(inputElt, 'value', {
            get: function() {
                return textContent;
            },
            set: setValue
        });

        var clearNewline = false;
        $contentElt
            .on('keydown', function(evt) {
                if(
                    evt.which === 17 || // Ctrl
                    evt.which === 91 || // Cmd
                    evt.which === 18 || // Alt
                    evt.which === 16 // Shift
                ) {
                    return;
                }

                //todo:
                //selectionMgr.saveSelectionState();
                //adjustCursorPosition();

                var cmdOrCtrl = evt.metaKey || evt.ctrlKey;

                switch(evt.which) {
                    //todo: 如果是tab
                    /*case 9: // Tab
                        if(!cmdOrCtrl) {
                            action('indent', {
                                inverse: evt.shiftKey
                            });
                            // 取消事件的默认动作
                            evt.preventDefault();
                        }
                        break;*/
                    case 13:
                        action('newline');
                        evt.preventDefault();
                        break;
                }
                if(evt.which !== 13) {
                    clearNewline = false;
                }
            }); //todo: 继续处理一些其他的事件

        //todo: 注释了一些东西, 需要弄懂 state
        var action = function(action, options) {
            var textContent = getValue();
            //var min = Math.min(selectionMgr.selectionStart, selectionMgr.selectionEnd);
            //var max = Math.max(selectionMgr.selectionStart, selectionMgr.selectionEnd);
            //todo: 自己加的
            var min = 1,max = 2;
            var state = {
                selectionStart: min,
                selectionEnd: max,
                before: textContent.slice(0, min),
                after: textContent.slice(max),
                selection: textContent.slice(min, max)
            };

            /*var state = {
                selectionStart: min,
                selectionEnd: max,
                before: textContent.slice(0, min),
                after: textContent.slice(max),
                selection: textContent.slice(min, max)
            };*/

            actions[action](state, options || {});
            //setValue(state.before + state.selection + state.after);
            //selectionMgr.setSelectionStartEnd(state.selectionStart, state.selectionEnd);
            //selectionMgr.updateSelectionRange();
        };

        var indentRegex = /^ {0,3}>[ ]*|^[ \t]*(?:[*+\-]|(\d+)\.)[ \t]|^\s+/;
        var actions = {
            indent: function(state, options) {
                function strSplice(str, i, remove, add) {
                    remove = +remove || 0;
                    add = add || '';
                    return str.slice(0, i) + add + str.slice(i + remove);
                }

                var lf = state.before.lastIndexOf('\n') + 1;
                if(options.inverse) {
                    if(/\s/.test(state.before.charAt(lf))) {
                        state.before = strSplice(state.before, lf, 1);

                        state.selectionStart--;
                        state.selectionEnd--;
                    }
                    state.selection = state.selection.replace(/^[ \t]/gm, '');
                } else {
                    var previousLine = state.before.slice(lf);
                    if(state.selection || previousLine.match(indentRegex)) {
                        state.before = strSplice(state.before, lf, 0, '\t');
                        state.selection = state.selection.replace(/\r?\n(?=[\s\S])/g, '\n\t');
                        state.selectionStart++;
                        state.selectionEnd++;
                    } else {
                        state.before += '\t';
                        state.selectionStart++;
                        state.selectionEnd++;
                        return;
                    }
                }

                state.selectionEnd = state.selectionStart + state.selection.length;
            },
            //todo: 需要弄懂state
            newline: function(state) {
                var lf = state.before.lastIndexOf('\n') + 1;
                if(clearNewline) {
                    state.before = state.before.substring(0, lf);
                    state.selection = '';
                    state.selectionStart = lf;
                    state.selectionEnd = lf;
                    clearNewline = false;
                    return;
                }
                clearNewline = false;
                var previousLine = state.before.slice(lf);
                var indentMatch = previousLine.match(indentRegex);
                var indent = (indentMatch || [''])[0];
                if(indentMatch && indentMatch[1]) {
                    var number = parseInt(indentMatch[1], 10);
                    indent = indent.replace(/\d+/, number + 1);
                }
                if(indent.length) {
                    clearNewline = true;
                }

                undoMgr.currentMode = 'newlines';

                state.before += '\n' + indent;
                state.selection = '';
                state.selectionStart += indent.length + 1;
                state.selectionEnd = state.selectionStart;
            }
        };
    };

    var sectionList = [];
    var sectionsToRemove = [];
    var modifiedSections = [];
    var insertBeforeSection;

    function updateSectionList(newSectionList) {

        modifiedSections = [];
        sectionsToRemove = [];
        insertBeforeSection = undefined;

        // Render everything if file changed
        if(fileChanged === true) {
            sectionsToRemove = sectionList;
            sectionList = newSectionList;
            modifiedSections = newSectionList;
            return;
        }

        // Find modified section starting from top
        var leftIndex = sectionList.length;
        _.some(sectionList, function(section, index) {
            var newSection = newSectionList[index];
            if(index >= newSectionList.length ||
                    // Check modified
                section.textWithFrontMatter != newSection.textWithFrontMatter ||
                    // Check that section has not been detached or moved
                section.elt.parentNode !== contentElt ||
                    // Check also the content since nodes can be injected in sections via copy/paste
                section.elt.textContent != newSection.textWithFrontMatter) {
                leftIndex = index;
                return true;
            }
        });

        // Find modified section starting from bottom
        var rightIndex = -sectionList.length;
        _.some(sectionList.slice().reverse(), function(section, index) {
            var newSection = newSectionList[newSectionList.length - index - 1];
            if(index >= newSectionList.length ||
                    // Check modified
                section.textWithFrontMatter != newSection.textWithFrontMatter ||
                    // Check that section has not been detached or moved
                section.elt.parentNode !== contentElt ||
                    // Check also the content since nodes can be injected in sections via copy/paste
                section.elt.textContent != newSection.textWithFrontMatter) {
                rightIndex = -index;
                return true;
            }
        });

        if(leftIndex - rightIndex > sectionList.length) {
            // Prevent overlap
            rightIndex = leftIndex - sectionList.length;
        }

        // Create an array composed of left unmodified, modified, right
        // unmodified sections
        var leftSections = sectionList.slice(0, leftIndex);
        modifiedSections = newSectionList.slice(leftIndex, newSectionList.length + rightIndex);
        var rightSections = sectionList.slice(sectionList.length + rightIndex, sectionList.length);
        insertBeforeSection = _.first(rightSections);
        sectionsToRemove = sectionList.slice(leftIndex, sectionList.length + rightIndex);
        sectionList = leftSections.concat(modifiedSections).concat(rightSections);
    }

    function highlightSections() {
        var newSectionEltList = document.createDocumentFragment();
        modifiedSections.forEach(function(section) {
            highlight(section);
            newSectionEltList.appendChild(section.elt);
        });
        watcher.noWatch(function() {
            if(fileChanged === true) {
                contentElt.innerHTML = '';
                contentElt.appendChild(newSectionEltList);
            }
            else {
                // Remove outdated sections
                sectionsToRemove.forEach(function(section) {
                    // section may be already removed
                    section.elt.parentNode === contentElt && contentElt.removeChild(section.elt);
                    // To detect sections that come back with built-in undo
                    section.elt.generated = false;
                });

                if(insertBeforeSection !== undefined) {
                    contentElt.insertBefore(newSectionEltList, insertBeforeSection.elt);
                }
                else {
                    contentElt.appendChild(newSectionEltList);
                }

                // Remove unauthorized nodes (text nodes outside of sections or duplicated sections via copy/paste)
                var childNode = contentElt.firstChild;
                while(childNode) {
                    var nextNode = childNode.nextSibling;
                    if(!childNode.generated) {
                        contentElt.removeChild(childNode);
                    }
                    childNode = nextNode;
                }
            }
            addTrailingLfNode();
            //selectionMgr.updateSelectionRange();
            //selectionMgr.updateCursorCoordinates();
        });
    }

    function addTrailingLfNode() {
        trailingLfNode = crel('span', {
            class: 'token lf'
        });
        trailingLfNode.textContent = '\n';
        contentElt.appendChild(trailingLfNode);
    }

    var escape = (function() {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            "\u00a0": ' '
        };
        return function(str) {
            return str.replace(/[&<\u00a0]/g, function(s) {
                return entityMap[s];
            });
        };
    })();

    /**
     * 高亮输入框中的内容
     */
    function highlight(section) {
        var text = escape(section.text);
        if(!window.viewerMode) {
            //todo: 不知道怎么下载 Prism
            //text = Prism.highlight(text, Prism.languages.md);
        }
        var frontMatter = section.textWithFrontMatter.substring(0, section.textWithFrontMatter.length - section.text.length);
        if(frontMatter.length) {
            // Front matter highlighting
            frontMatter = escape(frontMatter);
            frontMatter = frontMatter.replace(/\n/g, '<span class="token lf">\n</span>');
            text = '<span class="token md">' + frontMatter + '</span>' + text;
        }
        var sectionElt = crel('span', {
            id: 'wmd-input-section-' + section.id,
            class: 'wmd-input-section'
        });
        sectionElt.generated = true;
        sectionElt.innerHTML = text;
        section.elt = sectionElt;
    }


    eventMgr.onEditorCreated(editor);

    return editor;
});