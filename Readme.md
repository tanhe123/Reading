
## 库

1. 字体图标使用 [font-awesome](http://fontawesome.dashgame.com/)
2. Ztree 可以制作树形目录结构
3. 布局可以使用 jquery ui layout
4. 保存文件到本地使用 [FileSave](https://github.com/eligrey/FileSaver.js/)
5. 上传文件使用 [jQuery File Upload](https://github.com/blueimp/jQuery-File-Upload)

## mongodb 数据表:

user
note
noteHistory

## url path:

/{username} 用户相关
/note 笔记相关

post /note 创建笔记 返回类型 json
get /note 显示所有笔记列表 返回类型 html

## 待办

1. 拦截器
2. ~~同步功能~~
3. 添加按钮，class btn-group
4. ~~两个空格换行问题~~
5. 插入模板
6. offline mode
7. ~~字体及间距~~
8. 自动智能同步功能
9. showUserHome:favicon
10. ~~Markdown.getSanitizingConverter 经常出错~~
11. ~~最外成的滚动条~~
12. ~~发布博客~~
13. 显示笔记、博客
14. 博客、笔记分开存储
15. 编辑笔记时，左右滚动条不协调
16. 内容直接被解析为html, 如果放在网页正文，会被执行，应该转换html实体

    例如
    ```
    <!DOCTYPE HTML>
    <html>
    <body>
        <pre id="pid" contenteditable="true" style="padding-left: 35px; padding-right: 35px; padding-bottom: 251px;"><div>这是一行</div><div>这是另一行</div></pre>
    <script>
        var inputElt = document.getElementById("pid");
        alert(inputElt.textContent)
    </script>
    </body>
    </html>
    ```
17. ~~刷新editor显示指示器~~
18. ~~自动保存时提示~~
19. ~~使用spring data mongodb替代mongo driver~~
20. notebook title 不能重复
21. 导航
22. 不单独设置标题，在内容中进行设置标题
~~23. 自定义 wmd 中的 bar~~
