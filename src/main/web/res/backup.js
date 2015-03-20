/**
 * Created by tan on 15-3-20.
 */

//todo: 存放一些暂时永不到的代码

// 删除笔记
/*$(".action-remove-file").click(function () {
 $.ajax({
 url: '/note/' + note.id,
 type: 'DELETE',
 success: function (rs) {
 if (rs === true) {
 location.href = "/note";
 } else {
 alert("删除文章失败");
 }
 }
 });

 });*/

// 保存文件参见 http://stackoverflow.com/questions/7717851/save-file-javascript-with-file-name
/*$("#action-download-md").click(function () {
 var content = $("#wmd-input").val();
 var filename = $("#note-title").val() + ".md";

 fileManager.downloadFile(filename, content);
 });

 $("#action-download-html").click(function () {
 var content = $("#wmd-preview").html();
 var filename = $("#note-title").val() + ".html";

 fileManager.downloadFile(filename, content);
 });*/

/*fileManager.downloadFile = function(filename, content) {
 if (saveAs !== undefined) {
 var blob = new Blob([content], {type: "text/plain;charset=utf-8"});
 saveAs(blob, filename);
 } else {
 var uriContent = "data:application/octet-stream;base64,"
 + content;
 window.open(uriContent, 'file');
 }
 };*/


/*Note.publish = function () {

 $.post("/note/" + note.id + "/publish", function (rs) {
 console.log(rs);

 if (rs === true) {
 $("#action-publish-blog").hide();
 $("#action-update-blog").show();
 }
 });
 };*/


/*    Notebook.queryNotebooks = function (callback) {
 $.getJSON("/notebook", function (rsNotebooks) {
 if (callback) {
 callback(rsNotebooks);
 }
 });
 };*/

// 设置缓存
/*Notebook.setCache = function(notebook) {
 var notebookId = notebook.id;
 if(!notebookId) {
 return;
 }
 if(!Notebook.cache[notebookId]) {
 Notebook.cache[notebookId] = {};
 }
 $.extend(Notebook.cache[notebookId], notebook);
 };
 */