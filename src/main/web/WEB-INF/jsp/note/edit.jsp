<%--
  Created by IntelliJ IDEA.
  User: tan
  Date: 14-12-21
  Time: 下午1:42
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>Reading</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="/res/css/main.css" rel="stylesheet">

    <script data-main="/res/main" src="/res/bower-libs/requirejs/require.js"></script>
    <script>
        var viewerMode = false;

    </script>
  </head>

  <body>

  <%--css 加载太慢，写入style--%>
  <div id="loading" style="text-align: center">
      <i class="fa fa-spinner fa-pulse fa-5x"></i>
  </div>

  <div class="slideMenu" style="display: none">
      <ul class="navigationMenu">
          <li>
              <a id="action-exit" href="/">
                  <i class="fa fa-reply"></i><!--
		       --><span>保存并返回</span>
              </a>
          </li>

          <li>
              <a id="action-new-note" href="#">
                  <i class="fa fa-plus"></i><!--
               --><span>新建笔记</span>
              </a>
          </li>

          <li>
              <a id="action-all-note" href="#">
                  <i class="fa fa-file"></i><!--
               --><span>笔记</span>
              </a>
          </li>

          <li>
              <a href="#">
                  <i class="fa fa-search"></i><!--
		       --><span>搜索</span>
              </a>
          </li>
      </ul>
  </div>

  <%--在css中设置不可见，但是css加载的过程会导致元素可见, style可以解决这个小问题--%>
  <div class="editorContainer" style="display: none;">
      <div class="headerMenu">
          <div class="navbar navbar-default" style="height: 48px">
              <ul class="nav navbar-nav">
                  <li>
                      <!-- 笔记本选择菜单 -->
                      <div class="dropdown noteBookSelect">
                          <!-- data-toggle 可以是的点击不自动隐藏弹出菜单 -->
                          <div class="dropdown-toggle" data-toggle="dropdown">
                              <i class="fa fa-book"></i>
                              <span id="curNotebookTitle">笔记分类</span>
                              <span class="caret"></span>
                          </div>

                          <div class="dropdown-menu selectPanel">
                              <div class="filterPanel">
                                  <i class="fa fa-search"></i>
                                  <input type="text" name="notebookFilter" id="notebookFilter" placeholder="搜索或创建笔记本" data-stopPropagation="true"><!--
                               --><button class="btn btn-confirm createNotebookButton">创建</button>
                              </div>

                              <ul class="slidingPanel hideme"></ul>
                          </div>
                      </div><!-- 笔记本选择菜单 end -->
                  </li>

                  <%--文章标题--%>
                  <li>
                      <div class="noteTitle">
                          <input type="text" class="form-control" id="note-title" placeholder="笔记标题">
                      </div>
                  </li><%--文章标题 end--%>

              </ul>

              <ul class="nav navbar-nav navbar-right">

              </ul>
          </div>

          <div class="editorTools">
              <div class="navbar navbar-default">
                  <ul class="nav left-buttons">
                      <li class="wmd-button-group1 btn-group"></li>
                  </ul>
                  <ul class="nav left-buttons">
                      <li class="wmd-button-group2 btn-group"></li>
                  </ul>
                  <ul class="nav left-buttons">
                      <li class="wmd-button-group3 btn-group"></li>
                  </ul>
                  <ul class="nav left-buttons">
                      <li class="wmd-button-group5 btn-group"></li>
                  </ul>

                  <ul class="nav left-buttons">
                      <li class="wmd-button-group6 btn-group">
                          <li class="wmd-button btn" id="imgupload" style="overflow: hidden">
                              <i class="fa fa-image"></i>
                              <input id="fileupload" type="file" name="img">
                          </li>
                      </li>
                  </ul>


                  <ul class="nav pull-right right-buttons">
                      <li id='saving-notice' class='label hideme'>已保存</li>
                  </ul>

                  <!--清除浮动的导致的父容器塌陷-->
                  <div class="clearfix"></div>
              </div>

              <div id="wmd-button-bar" class="hide"></div>
          </div>
      </div>

      <div class="editor">
          <%--编辑器--%>
          <div id="left-column" class="pull-left">
              <div id="wmd-panel-editor" class="wmd-panel-editor">
                  <textarea class="wmd-input" id="wmd-input" spellcheck="false"></textarea>
              </div>
          </div>

          <%--well带padding属性, 所以不使用--%>
          <div id="right-column" class="pull-right">
              <div id="wmd-panel-preview" class="wmd-panel-preview">
                  <div id="wmd-preview" class="wmd-preview"></div>
              </div>
          </div>

          <%--清除浮动效果--%>
          <div class="clearfix"></div>
      </div>
  </div>

  <div class="mask createNotebookContainer" style="display: none">
      <div class="containerIcon">
          <span class="fa fa-book fa-4x"></span>
      </div>

      <div class="containerLabel">
          创建笔记本
      </div>

      <div class="containerSeprator">

      </div>

      <div class="containerInput">
          <input type="text" name="createNotebookTitle" id="createNotebookTitle" placeholder="给笔记本起个名字吧">
      </div>

      <div class="containerButtons">
          <button class="btn btn-cancel">取消</button>
          <button class="btn btn-confirm">创建</button>
      </div>
  </div>

  <div class="mask noteListContainer" style="display: none">
      <ul class="slidingPanel"></ul>
  </div>

  <textarea id="md-section-helper" style="visibility: hidden"></textarea>

  <script>
      var notebooks = ${notebooks};
      var notes = ${notes};
      var noteId="${note.id}";
  </script>

  </body>
</html>
