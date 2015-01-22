/**
 * Created by tan on 15-1-22.
 */
var synchronizer = (function () {
    var synchronizer = {};

    // A synchronization queue containing fileIndex that has to be synchronized
    var syncQueue = undefined;
    synchronizer.init = function() {
        syncQueue = ";";

        // Load the queue from localStorage in case a previous synchronization was aborted
        if(localStorage["sync.queue"]) {
            syncQueue = localStorage["sync.queue"];
        }

        if(localStorage["sync.current"]) {
            this.addFile(localStorage["sync.current"]);
        }
    };

    // Add a file to the synchronization queue
    synchronizer.addFile = function(fileIndex) {
        if(syncQueue.indexOf(";" + fileIndex + ";") === -1) {
            syncQueue += fileIndex + ";";
            localStorage["sync_queue"] = syncQueue;
        }
    };

    /*
     // Recursive function to run synchronization of a single file on multiple locations
     function sync(fileSyncIndexList, content, title) {
     if (fileSyncIndexList.length === 0) {
     localStorage.removeItem("sync.current");
     //todo:
     //unsetWorkingIndicator(FLAG_SYNCHRONIZE);
     running = false;
     // run the next file synchronization
     synchronizer.run();
     return;
     }
     var fileSyncIndex = fileSyncIndexList.pop();
     // Try to find the provider
     }
     */

    var running = false;

    /*synchronizer.run = function() {
     // If synchronization is already running or nothing to synchronize
     if(running || syncQueue.length === 1) {
     return;
     }

     // Start synchronization of the next available in the queue
     //todo:
     //setWorkingIndicator(FLAG_SYNCHRONIZE);
     running = true;

     // Dequeue the fileIndex
     // 获得第二个;号的位置，第一个是开始的标志，第二个表示一个fileIndex的结束
     var separatorPos = syncQueue.indexOf(";", 1);
     // 截取到 fileIndex
     var fileIndex = syncQueue.substring(1, separatorPos);
     localStorage["sync.current"] = fileIndex;
     // 将取出的 fileIndex 从队列中删除
     syncQueue = syncQueue.substring(separatorPos);
     // 保存被修改的队列
     localStorage["sync.queue"] = syncQueue;

     var content = localStorage[fileIndex + ".content"];
     var title = localStorage[fileIndex + ".title"];

     // todo: Parse the list of synchronized locations associated to the file
     var fileSyncIndexList = localStorage[fileIndex + ".sync"].split(";");
     sync(fileSyncIndexList, content, title);
     };*/

    return synchronizer;
})(jQuery);