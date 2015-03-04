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

        var note = {};

    </script>
  </head>

  <body>

  <%--<nav>--%>
      <!-- 菜单栏-->
     <%-- <div id="header" class="navbar navbar-default">

          <!--mdEditor 按钮组-->
          <div class="pull-left">
              <div id="wmd-button-bar"></div>
          </div>

--%>
          <%--菜单按钮--%>
          <%--<div class="pull-right" style="margin-right: 140px">
              <div class="dropdown">
                  <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                      <span>Menu</span>
                      <i class="fa fa-angle-down"></i>
                  </a>
                  <ul class="dropdown-menu li-a">
                      <li><a id="new-file" href="#"><i class="fa fa-file-o"></i> 新建笔记</a></li>

                      <li><a id="remove-file" data-toggle="modal"
                             data-target="#modal-remove-file-confirm" href="#"><i class="fa fa-trash"></i> 删除笔记</a></li>

                      <li id="action-publish-blog"><a href="#"><i class="fa fa-share-square-o"></i> 发布</a></li>

                      <li id="action-update-blog"><a href="#"><i class="fa fa-share-square-o"></i> 更新</a></li>

                      <li><a href="/note"><i class="fa fa-home"> 返回主页</i></a></li>

                      <li class="divider"></li>

                      <li><a id="action-download-md" href="#" title="下载当前mrkdown文档">
                          <i class="fa fa-download"></i>
                          下载Markdown文档
                      </a></li>

                      <li><a id="action-download-html" href="#" title="下载当前Html文档">
                          <i class="fa fa-download"></i>
                          下载HTML文档
                      </a></li>

                      <li class="divider"></li>

                      <li><a href="viewer"><i class="fa fa-desktop"></i> Open in viewer</a></li>

                      <li class="divider"></li>

                      <li><a href="#" title="Modify your preferences"
                             data-toggle="modal" data-target="#modal-settings"
                             class="action-load-settings">
                          <i class="fa fa-cog"></i>
                          设置</a>
                      </li>
                  </ul>
              </div>
          </div>--%>

          <!--title输入框-->
          <%--<div class="pull-right" style="margin-right: 20px">
              <div class="navbar-form form-inline col-lg-2">
                  <input type="text" id="file-title-input" class="form-control col-xs-3" placeholder="File title">
              </div>
          </div>--%>

          <!--title显示-->
<%--
          <div class="pull-right" style="margin-right: 20px">
              &lt;%&ndash;line-height为了让其居中&ndash;%&gt;
              &lt;%&ndash;todo: 使用这里保存的数据&ndash;%&gt;
              <a id="file-title"><span class="file-title" data-note-id="${note.id}">&lt;%&ndash;${note.title}&ndash;%&gt;</span></a>
          </div>
--%>

<%--          <div id="action-has-saving" class="pull-right hideme" style="margin-right: 20px">
              <div><i class="fa fa-save"></i> 已保存</div>
          </div>--%>

<%--

      </div>
  </nav>
--%>

  <%--css 加载太慢，写入style--%>
  <div id="loading" style="text-align: center">
      <i class="fa fa-spinner fa-pulse fa-5x"></i>
  </div>

  <div class="slideMenu" style="display: none">
      <ul class="navigationMenu">
          <li>
              <a id="action-exit" class="menuItem" href="/">
                  <i class="fa fa-reply"></i><!--
		       --><span>保存并返回</span>
              </a>
          </li>

          <li>
              <a class="menuItem" href="#">
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
                              <span>笔记分类</span>
                              <span class="caret"></span>
                          </div>

                          <div class="dropdown-menu selectPanel">
                              <div class="filterPanel">
                                  <i class="fa fa-search"></i>
                                  <input type="text" name="filter" id="filter" placeholder="搜索笔记本" data-stopPropagation="true">
                              </div>

                              <div class="noItem createNotebook hideme" data-stopPropagation="true">
                                  <div class="tip">
                                      没有找到, 创建一个吧
                                      <i class="fa fa-plus"></i>
                                  </div>
                              </div>

                              <div class="slidingPanel hideme"><!--
                                  <%--<div class="notebookItem select">
                                      <div class="notebook">
                                          默认记事本
                                      </div><!--

					--><div class="selectState">
                                      <i class="fa fa-check"></i>
                                  </div>
                                  </div>

                                  <div class="notebookItem">
                                      <div class="notebook">
                                          默认记事本
                                      </div><!--

					--><div class="selectState">
                                      <i class="fa fa-check"></i>
                                  </div>
                                  </div>--%>-->
                              </div>
                          </div>
                      </div><!-- 笔记本选择菜单 end -->


              </ul>

              <ul class="nav navbar-nav navbar-right">
                  <%--文章标题--%>
                  <li>
                      <div class="noteTitle">
                          <input type="text" class="form-control" id="note-title" data-note-id="${note.id}" placeholder="笔记标题">
                      </div>
                  </li><%--文章标题 end--%>
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

                  <ul class="nav pull-right right-buttons">

                      <%--// 添加其他的组件--%>
                      <%--<li id='action-exit' class='wmd-button btn pull-right' style='line-height: 15px; font-size: 12px; font-weight: normal'><i class='fa fa-save'></i>保存并离开</li>--%>

                      <%--<li class="wmd-button btn">
                          <select id="notebook">
                              &lt;%&ndash;将notebooks放入select, 并选择默认&ndash;%&gt;
                              <c:forEach var="notebook" items="${notebooks}">
                                  <c:choose>
                                      <c:when test="${notebook.id eq note.notebookId}">
                                          <option value="${notebook.id}" selected>${notebook.title}</option>
                                      </c:when>

                                      <c:otherwise>
                                          <option value="${notebook.id}">${notebook.title}</option>
                                      </c:otherwise>

                                  </c:choose>

                              </c:forEach>
                          </select>
                      </li>--%>

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

  <div class="createNotebookContainer" style="display: none">
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
          <button class="btn btn-default cancel">取消</button>
          <button class="btn btn-default confirm">创建</button>
      </div>
  </div>

  <textarea id="md-section-helper" style="visibility: hidden"></textarea>

  <script>
      var notebooks = ${notebooks};
  </script>

  </body>
</html>
