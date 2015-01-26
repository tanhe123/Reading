<%--
  Created by IntelliJ IDEA.
  User: tan
  Date: 14-12-21
  Time: 下午1:42
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
<%--    <title></title>
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <script data-main="/res/main.js" src="/res/require.js"></script>--%>

    <title><%--${note.title}--%>--edit</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="/res/css/main.css" rel="stylesheet">
<%--
    <script type="text/javascript" src="/res/bower-libs/jquery/dist/jquery.js"></script>
    <script type="text/javascript" src="/res/libs/jquery-ui.custom.js"></script>
    <script type="text/javascript" src="/res/libs/jquery.layout-latest.js"></script>
    <script type="text/javascript" src="/res/bower-libs/jgrowl/jquery.jgrowl.js"></script>

    <script type="text/javascript" src="/res/bower-libs/bootstrap/dist/js/bootstrap.js"></script>
    <script type="text/javascript" src="/res/libs/Markdown.Converter.js"></script>
    <script type="text/javascript" src="/res/libs/Markdown.Sanitizer.js"></script>
    <script type="text/javascript" src="/res/libs/Markdown.Editor.js"></script>
    <script type="text/javascript" src="/res/main.js"></script>--%>

    <script data-main="/res/main" src="/res/bower-libs/requirejs/require.js"></script>
    <script>
        var viewerMode = false;

        var note = {id : "${note.id}"};
    </script>
  </head>
  <body>

  <%-- 导航栏知识参见 http://www.w3cschool.cc/bootstrap/bootstrap-navbar.html --%>
  <div id="navbar" class="navbar navbar-defaul ui-layout-north">
      <div id="wmd-button-bar" class="pull-left"></div>

      <ul class="nav navbar-nav navbar-right" id="menu-bar">
          <li>
              <div class="navbar-form navbar-left">
                  <div class="form-group">
                      <input type="text" id="file-title-input" class="form-control col-xs-3" placeholder="File title"
                              value="<%--${note.title}--%>">
                  </div>
                  <%--<button type="submit" class="btn btn-default">提交按钮</button>--%>
              </div>
<%--              <button type="button" class="btn btn-default navbar-btn">
                  导航栏按钮
              </button>--%>
          </li>

          <li class="divider-vertical"></li>

          <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  Menu
                  <b class="caret"></b>
              </a>
              <ul class="dropdown-menu">
                  <li><a id="new-file" href="#"><i class="fa fa-file-o"></i> New file</a></li>

                  <li><a id="remove-file" data-toggle="modal"
                         data-target="#modal-remove-file-confirm" href="#"><i class="fa fa-trash"></i> Remove file</a></li>

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
          </li>

          <li><a id="file-title"><span class="file-title"><%--${note.title}--%></span></a></li>
          <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                  <b class="caret"></b>
              </a>
              <ul class="dropdown-menu" id="file-selector">
              </ul>
          </li>
      </ul>
  </div>

  <textarea id="wmd-input" class="ui-layout-center"><%--${note.content}--%></textarea>

  <div class="ui-layout-east"></div>
  <div class="ui-layout-south"></div>

  <%--删除确认模态框--%>
  <div class="modal fade" id="modal-remove-file-confirm" tabindex="-1" role="dialog"
       aria-labelledby="modal-remove-file-confirm-label" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close"
                          data-dismiss="modal" aria-hidden="true">
                      &times;
                  </button>
                  <h4 class="modal-title" id="modal-remove-file-confirm-label">
                      删除该笔记
                  </h4>
              </div>
              <div class="modal-body">
                  您确认要删除笔记 <span class="file-title" style="color: red"></span> ?
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-default"
                          data-dismiss="modal">返回
                  </button>
                  <button type="button" class="btn btn-primary"
                          data-dismiss="modal">
                      删除
                  </button>
              </div>
          </div><!-- /.modal-content -->
      </div><!-- /.modal -->
  </div>

  <%--设置模态框--%>
  <div class="modal fade" id="modal-settings" tabindex="-1" role="dialog"
       aria-labelledby="modal-settings-label" aria-hidden="true">
      <div class="modal-dialog">
          <div class="modal-content">
              <div class="modal-header">
                  <button type="button" class="close"
                          data-dismiss="modal" aria-hidden="true">
                      &times;
                  </button>
                  <h4 class="modal-title" id="modal-settings-label">
                      设置
                  </h4>
              </div>
              <div class="modal-body">
                  <h1>布局</h1><br/>

                  <label for="radio-layout-orientation-horizontal">水平</label>
                  <input type="radio" name="radio-layout-orientation"
                         id="radio-layout-orientation-horizontal"
                         value="horizontal">
                  &nbsp;&nbsp;&nbsp;
                  <label for="radio-layout-orientation-vertical">纵向</label>
                  <input type="radio" name="radio-layout-orientation"
                         id="radio-layout-orientation-vertical"
                         value="vertical">

              </div>

              <div class="modal-footer">
                  <button type="button" class="btn btn-default"
                          data-dismiss="modal">返回
                  </button>
                  <button type="button" class="btn btn-primary action-apply-settings"
                          data-dismiss="modal">
                      确认
                  </button>
              </div>
          </div><!-- /.modal-content -->
      </div><!-- /.modal -->
  </div>

  <textarea id="md-section-helper"></textarea>
  </body>
</html>
