/**
 * Created by tan on 14-12-31.
 */
define([
    'jquery',
    'underscore',
    'utils',
    "diff_match_patch_uncompressed",
    'eventMgr',
    'crel'
], function ($, _, utils, diff_match_patch, eventMgr, crel) {

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

    var fileChanged = true;
    var fileDesc;
    eventMgr.addListener('onFileSelected', function(selectedFileDesc) {
        fileChanged = true;
        fileDesc = selectedFileDesc;
    });

    // Used to detect editor changes
    function Watcher() {
        this.isWatching = false;
        var contentObserver;
        // 开始监视内容变化
        this.startWatching = function() {
            this.isWatching = true;
            contentObserver = contentObserver || new MutationObserver(checkContentChange);
            contentObserver.observe(contentElt, {
                childList: true,
                subtree: true,
                characterData: true
            });
        };
        // 停止监视
        this.stopWatching = function() {
            contentObserver.disconnect();
            this.isWatching = false;
        };
        // 调用cb而不监视
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

    var watcher = new Watcher();
    editor.watcher = watcher;

    var diffMatchPatch = new diff_match_patch();
    // todo: jsonDiffPatch

    function SelectionMgr() {
        var self = this;
        var lastSelectionStart = 0, lastSelectionEnd = 0;
        // 选中的文本的开始
        this.selectionStart = 0;
        // 选中的文本的结束
        this.selectionEnd = 0;
        this.cursorY = 0;
        this.adjustTop = 0;
        this.adjustBottom = 0;

        /**
         * 给定 offset，判定他们所属的 node 与在 node 中的相对 offset
         */
        this.findOffsets = function(offsetList) {

            var result = [];
            if(!offsetList.length) {
                return result;
            }

            var offset = offsetList.shift();
            /**
             * document.createTreeWalker(root, whatToShow, filter, entityReferenceExpansion);
             * root: The root node to begin searching the document tree using.
             * nodesToShow: The type of nodes that should be visited by TreeWalker.
             * filter (or null): Reference to custom function (NodeFilter object) to filter the nodes returned. Enter null for none.
             * entityExpandBol: Boolean parameter specifying whether entity references should be expanded.
             *
             * 4 的意思是 NodeFilter.SHOW_TEXT
             */
            var walker = document.createTreeWalker(contentElt, 4, null, false);

            var text = '';

            var walkerOffset = 0;

            // 循环遍历.editor-content的结点的孩子
            while(walker.nextNode()) {
                text = walker.currentNode.nodeValue || '';
                var newWalkerOffset = walkerOffset + text.length;

                // 如果当前的 offset 属于currentNode范围
                while(newWalkerOffset > offset) {
                    // 记录当前的offset所属的节点, 在节点中的相对offset, 和绝对的offset
                    result.push({
                        container: walker.currentNode,
                        offsetInContainer: offset - walkerOffset,
                        offset: offset
                    });
                    if(!offsetList.length) {
                        return result;
                    }
                    // 判断下一个offset
                    offset = offsetList.shift();
                }
                // 更新 walkerOffset
                walkerOffset = newWalkerOffset;
            }

            // 处理到这里，就证明剩下的offset都在最后一个node中
            do {
                result.push({
                    container: walker.currentNode,
                    offsetInContainer: text.length,
                    offset: offset
                });
                offset = offsetList.shift();
            }while(offset);

            return result;
        };

        this.createRange = function(start, end) {
            // start 和 end 都有可能时对象, 就是findOffset中的对象
            start = start < 0 ? 0 : start;
            end = end < 0 ? 0 : end;
            var range = document.createRange();

            // 这一句话是定义三个变量，一开始竟然以为是定义了一个数组变量。。。
            // startIndex 表示 start 存放在 offsetList 中的索引值, endIndex 同理
            var offsetList = [], startIndex, endIndex;

            if(_.isNumber(start)) {
                offsetList.push(start);
                // 记录索引值
                startIndex = offsetList.length - 1;
            }
            if(_.isNumber(end)) {
                offsetList.push(end);
                // 记录索引值
                endIndex = offsetList.length - 1;
            }

            // 找到他们的容器以及相对offset
            offsetList = this.findOffsets(offsetList);
            // 获得 startOffset 对象
            var startOffset = _.isObject(start) ? start : offsetList[startIndex];
            // 设置range开始范围
            range.setStart(startOffset.container, startOffset.offsetInContainer);
            // 获得 endOffset 对象, 初始化为 startOffset
            var endOffset = startOffset;
            // 如果没有传来 end，则endOffset为开始位置, 如果传来了, 则设置为结束位置
            if(end && end != start) {
                endOffset = _.isObject(end) ? end : offsetList[endIndex];
            }
            // 设置 range结束范围
            range.setEnd(endOffset.container, endOffset.offsetInContainer);

            return range;
        };
        var adjustScroll;
        var debouncedUpdateCursorCoordinates = utils.debounce(function() {
            $inputElt.toggleClass('has-selection', this.selectionStart !== this.selectionEnd);
            var coordinates = this.getCoordinates(this.selectionEnd, this.selectionEndContainer, this.selectionEndOffset);
            if(this.cursorY !== coordinates.y) {
                this.cursorY = coordinates.y;
                eventMgr.onCursorCoordinates(coordinates.x, coordinates.y);
            }
            if(adjustScroll) {
                var adjustTop, adjustBottom;

                //todo: 要从settings 中读
                //adjustTop = adjustBottom = inputElt.offsetHeight / 2 * settings.cursorFocusRatio;
                adjustTop = adjustBottom = inputElt.offsetHeight / 2 * 0.5;

                adjustTop = this.adjustTop || adjustTop;
                adjustBottom = this.adjustBottom || adjustTop;
                if(adjustTop && adjustBottom) {
                    var cursorMinY = inputElt.scrollTop + adjustTop;
                    var cursorMaxY = inputElt.scrollTop + inputElt.offsetHeight - adjustBottom;
                    if(selectionMgr.cursorY < cursorMinY) {
                        inputElt.scrollTop += selectionMgr.cursorY - cursorMinY;
                    }
                    else if(selectionMgr.cursorY > cursorMaxY) {
                        inputElt.scrollTop += selectionMgr.cursorY - cursorMaxY;
                    }
                }
            }
            adjustScroll = false;
        }, this);
        this.updateCursorCoordinates = function(adjustScrollParam) {
            adjustScroll = adjustScroll || adjustScrollParam;
            debouncedUpdateCursorCoordinates();
        };
        this.updateSelectionRange = function() {
            var min = Math.min(this.selectionStart, this.selectionEnd);
            var max = Math.max(this.selectionStart, this.selectionEnd);
            var range = this.createRange(min, max);
            var selection = rangy.getSelection();
            selection.removeAllRanges();
            selection.addRange(range, this.selectionStart > this.selectionEnd);
        };
        // 保存当前的选择范围
        var saveLastSelection = _.debounce(function() {
            lastSelectionStart = self.selectionStart;
            lastSelectionEnd = self.selectionEnd;
        }, 50);
        // 设置范围
        this.setSelectionStartEnd = function(start, end) {
            if(start === undefined) {
                start = this.selectionStart;
            }
            if(start < 0) {
                start = 0;
            }
            if(end === undefined) {
                end = this.selectionEnd;
            }
            if(end < 0) {
                end = 0;
            }
            this.selectionStart = start;
            this.selectionEnd = end;
            fileDesc.editorStart = start;
            fileDesc.editorEnd = end;
            saveLastSelection();
        };

        // todo: 绑定后，不知道为什么，没有发生
        // 会在 keydown 和  checkContent 时调用
        this.saveSelectionState = (function() {
            function save() {
                if(fileChanged === false) {
                    var selectionStart = self.selectionStart;
                    var selectionEnd = self.selectionEnd;
                    var selection = rangy.getSelection();
                    if(selection.rangeCount > 0) {
                        var selectionRange = selection.getRangeAt(0);
                        // startContainer 返回start所在的node
                        var node = selectionRange.startContainer;

                        // 方法可根据文档顺序使用指定的节点比较当前节点的文档位置
                        // 可以查看 http://help.dottoro.com/ljgoeost.php
                        // 下面这句话貌似 当node被包含在contentElt结点中，或node就是contentElt时
                        if((contentElt.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY) || contentElt === node) {
                            var offset = selectionRange.startOffset;
                            if(node.hasChildNodes() && offset > 0) {
                                node = node.childNodes[offset - 1];
                                offset = node.textContent.length;
                            }
                            // 求selecttRange的startOffset距离contentElt的绝对offset
                            var container = node;
                            while(node != contentElt) {
                                while(node = node.previousSibling) {
                                    if(node.textContent) {
                                        offset += node.textContent.length;
                                    }
                                }
                                node = container = container.parentNode;
                            }

                            // 如果是反向选中的
                            if(selection.isBackwards()) {
                                selectionStart = offset + selectionRange.toString().length;
                                selectionEnd = offset;
                            }
                            else { // 如果是正向选中的
                                selectionStart = offset;
                                selectionEnd = offset + selectionRange.toString().length;
                            }

                            if(selectionStart === selectionEnd && selectionRange.startContainer.textContent == '\n' && selectionRange.startOffset == 1) {
                                // In IE if end of line is selected, offset is wrong
                                // Also, in Firefox cursor can be after the trailingLfNode
                                selectionStart = --selectionEnd;
                                self.setSelectionStartEnd(selectionStart, selectionEnd);
                                self.updateSelectionRange();
                            }
                        }
                    }
                    self.setSelectionStartEnd(selectionStart, selectionEnd);
                }
                undoMgr.saveSelectionState();
            }

            var nextTickAdjustScroll = false;
            var debouncedSave = utils.debounce(function() {
                save();
                self.updateCursorCoordinates(nextTickAdjustScroll);
                // In some cases we have to wait a little bit more to see the selection change (Cmd+A on Chrome/OSX)
                longerDebouncedSave();
            });
            var longerDebouncedSave = utils.debounce(function() {
                save();
                if(lastSelectionStart === self.selectionStart && lastSelectionEnd === self.selectionEnd) {
                    nextTickAdjustScroll = false;
                }
                self.updateCursorCoordinates(nextTickAdjustScroll);
                nextTickAdjustScroll = false;
            }, 10);

            return function(debounced, adjustScroll, forceAdjustScroll) {

                console.log("saveSelectionState");

                if(forceAdjustScroll) {
                    lastSelectionStart = undefined;
                    lastSelectionEnd = undefined;
                }
                if(debounced) {
                    nextTickAdjustScroll = nextTickAdjustScroll || adjustScroll;
                    return debouncedSave();
                }
                else {
                    save();
                }
            };
        })();

        /**
         * 获取区间的文本
         * @returns {string}
         */
        this.getSelectedText = function() {
            var min = Math.min(this.selectionStart, this.selectionEnd);
            var max = Math.max(this.selectionStart, this.selectionEnd);
            return textContent.substring(min, max);
        };

        /**
         * 根据 绝对offset和容器结点和相对容器偏移量，算出坐标{x,y}
         * @param inputOffset 绝对 offset
         * @param container 容器结点
         * @param offsetInContainer 相对于容器的偏移量
         * @returns {{x: number, y: number}}
         */
        this.getCoordinates = function(inputOffset, container, offsetInContainer) {

            // 如果 没有传值 container，需要自己计算出来
            if(!container) {
                var offset = this.findOffsets([inputOffset])[0];
                container = offset.container;
                offsetInContainer = offset.offsetInContainer;
            }

            var x = 0;
            var y = 0;
            if(container.textContent == '\n') {
                y = container.parentNode.offsetTop + container.parentNode.offsetHeight / 2;
            }
            else {
                var selectedChar = textContent[inputOffset];
                var startOffset = {
                    container: container,
                    offsetInContainer: offsetInContainer,
                    offset: inputOffset
                };
                var endOffset = {
                    container: container,
                    offsetInContainer: offsetInContainer,
                    offset: inputOffset
                };
                if(inputOffset > 0 && (selectedChar === undefined || selectedChar == '\n')) {
                    if(startOffset.offset === 0) {
                        // Need to calculate offset-1
                        startOffset = inputOffset - 1;
                    }
                    else {
                        startOffset.offsetInContainer -= 1;
                    }
                }
                else {
                    if(endOffset.offset === container.textContent.length) {
                        // Need to calculate offset+1
                        endOffset = inputOffset + 1;
                    }
                    else {
                        endOffset.offsetInContainer += 1;
                    }
                }
                var selectionRange = this.createRange(startOffset, endOffset);
                var selectionRect = selectionRange.getBoundingClientRect();
                y = selectionRect.top + selectionRect.height / 2 - inputElt.getBoundingClientRect().top + inputElt.scrollTop;
            }
            return {
                x: x,
                y: y
            };
        };
        this.getClosestWordOffset = function(offset) {
            var offsetStart = 0;
            var offsetEnd = 0;
            var nextOffset = 0;
            textContent.split(/\s/).some(function(word) {
                if(word) {
                    offsetStart = nextOffset;
                    offsetEnd = nextOffset + word.length;
                    if(offsetEnd > offset) {
                        return true;
                    }
                }
                nextOffset += word.length + 1;
            });
            return {
                start: offsetStart,
                end: offsetEnd
            };
        };
    }

    var selectionMgr = new SelectionMgr();
    editor.selectionMgr = selectionMgr;

    /**
     * 绑定函数 function 到对象 object 上, 也就是无论何时调用函数, 函数里的 this 都指向这个 object. 任意可选参数 arguments 可以传递给函数 function , 可以填充函数所需要的参数, 这也被称为 partial application。
     * 一个例子:
     * var func = function(greeting){ return greeting + ': ' + this.name };
     * func = _.bind(func, {name: 'moe'}, 'hi');
     * func();
     * => 'hi: moe'
     *
     * todo: 这里不明白，和直接调用 selectionMgr(true, false) 有什么区别
     * 目前有些明白了，bind可以绑定参数，也就是说比如原来有三个参数，bind可以绑定两个，生成新的函数后，生成一个新的函数，该函数只需要一个参数
     */
    $(document).on('selectionchange', '.editor-content', _.bind(selectionMgr.saveSelectionState, selectionMgr, true, false));

    function adjustCursorPosition(force) {
        if(inputElt === undefined) {
            return;
        }
        selectionMgr.saveSelectionState(true, true, force);
    }


    var textContent;

    // 将value高效的写入html中
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

    //todo: replace

    //todo: replacePreviousText

    function setValueNoWatch(value) {
        setValue(value);
        textContent = value;
    }

    editor.setValueNoWatch = setValueNoWatch;

    function getValue() {
        return textContent;
    }

    editor.getValue = getValue;

    function focus() {
        $contentElt.focus();
        selectionMgr.updateSelectionRange();
        inputElt.scrollTop = scrollTop;
    }

    editor.focus = focus;

    function UndoMgr() {
        var undoStack = [];
        var redoStack = [];
        var lastTime;
        var lastMode;
        /**
         * 表示当前的状态，在 editor.js 中的 init 中有以下初始化代码
         * currentState = {
         *       selectionStartAfter: fileDesc.selectionStart,
         *       selectionEndAfter: fileDesc.selectionEnd,
         *       content: content,
         *       discussionListJSON: fileDesc.discussionListJSON
         *  };
         */
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

        this.saveState = utils.debounce(function() {
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
            // 只能在saveState调用后调用
            if(this.currentMode === undefined) {
                selectionStartBefore = selectionMgr.selectionStart;
                selectionEndBefore = selectionMgr.selectionEnd;
            }
        }, 50);
        this.canUndo = function() {
            return undoStack.length;
        };
        this.canRedo = function() {
            return redoStack.length;
        };
        function restoreState(state, selectionStart, selectionEnd) {
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
        }

        this.undo = function() {
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
        };
    }

    var undoMgr = new UndoMgr();
    editor.undoMgr = undoMgr;

    //todo: onComment

    var triggerSpellCheck = _.debounce(function() {
        var selection = window.getSelection();
        if(!selectionMgr.hasFocus || isComposing || selectionMgr.selectionStart !== selectionMgr.selectionEnd || !selection.modify) {
            return;
        }
        // Hack for Chrome to trigger the spell checker
        if(selectionMgr.selectionStart) {
            selection.modify("move", "backward", "character");
            selection.modify("move", "forward", "character");
        }
        else {
            selection.modify("move", "forward", "character");
            selection.modify("move", "backward", "character");
        }
    }, 10);

    function checkContentChange() {
        console.log("editor: checkContentChange");

        // 获得最新的文本内容
        var newTextContent = inputElt.textContent;

        // todo: trailingLfNode 不知道干啥的，不过是这样的形式 <span class="token lf">
        if(contentElt.lastChild === trailingLfNode && trailingLfNode.textContent.slice(-1) == '\n') {
            // 去掉最后的换行
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
            //fileDesc.newDiscussion && discussionList.push(fileDesc.newDiscussion);
            //var updateDiscussionList = adjustCommentOffsets(textContent, newTextContent, discussionList);
            textContent = newTextContent;
            //if(updateDiscussionList === true) {
            //    fileDesc.discussionList = fileDesc.discussionList; // Write discussionList in localStorage
            //}
            fileDesc.content = textContent;
            selectionMgr.saveSelectionState();

            // 调用 markdownSectionParser.onContentChanged
            eventMgr.onContentChanged(fileDesc, textContent);
            //updateDiscussionList && eventMgr.onCommentsChanged(fileDesc);
            undoMgr.saveState();
            //triggerSpellCheck();
        }
        else {//todo: 文件改变
            textContent = newTextContent;
            fileDesc.content = textContent;

            //selectionMgr.setSelectionStartEnd(fileDesc.editorStart, fileDesc.editorEnd);
            //todo: 自己加的
            selectionMgr.setSelectionStartEnd(0, 0);

            //todo: 自己弄的上一句
            selectionMgr.setSelectionStartEnd(0, 0);
            selectionMgr.updateSelectionRange();
            selectionMgr.updateCursorCoordinates();
            undoMgr.saveSelectionState();
            // 调用 markdownSectionParser.onFileOpen
            eventMgr.onFileOpen(fileDesc, textContent);
            //previewElt.scrollTop = fileDesc.previewScrollTop;
            //scrollTop = fileDesc.editorScrollTop;
            inputElt.scrollTop = scrollTop;
            fileChanged = false;
        }
    }

    // todo: adjustCommentOffsets

    editor.init = function() {
        //todo:
        console.log("editor.init");

        inputElt = document.getElementById('wmd-input');
        $inputElt = $(inputElt);
        contentElt = inputElt.querySelector('.editor-content');
        $contentElt = $(contentElt);

        previewElt = document.querySelector('.preview-container');

        watcher.startWatching();

        inputElt.adjustCursorPosition = adjustCursorPosition;

        //todo:

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
                    alert("selectionMgr:" + selectionMgr.selectionStart + " " + selectionMgr.selectionEnd);
                    return;
                }

                //todo:
                selectionMgr.saveSelectionState();
                console.log("contentElt keydown saveSelectionState");
                adjustCursorPosition();

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
                    case 13://todo: 如果是 换行
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

            var min = Math.min(selectionMgr.selectionStart, selectionMgr.selectionEnd);
            var max = Math.max(selectionMgr.selectionStart, selectionMgr.selectionEnd);

            console.log("min:" + min + " max:" + max);

            var state = {
                selectionStart: min,
                selectionEnd: max,
                before: textContent.slice(0, min),
                after: textContent.slice(max),
                selection: textContent.slice(min, max)
            };

            actions[action](state, options || {});
            setValue(state.before + state.selection + state.after);
            selectionMgr.setSelectionStartEnd(state.selectionStart, state.selectionEnd);
            selectionMgr.updateSelectionRange();
        };

        // 符合缩进的正则, 比如引用符号>或编号1.等
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
                // 如果clearNewline为true，则会清空当前行，而不会插入新行
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
                // 上一行符合缩进的规则
                var indentMatch = previousLine.match(indentRegex);
                var indent = (indentMatch || [''])[0];
                // 如果是编号类型的缩进
                if(indentMatch && indentMatch[1]) {
                    // 分析出上一行的编号
                    var number = parseInt(indentMatch[1], 10);
                    // 编号+1
                    indent = indent.replace(/\d+/, number + 1);
                }
                // 这时就会出现编号，但是如果什么都没有输入，再次按下回车，则会清除编号（即清空当前行），而不会再插入新的空行
                // 这就是 clearNewline 的作用
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
            selectionMgr.updateSelectionRange();
            selectionMgr.updateCursorCoordinates();
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