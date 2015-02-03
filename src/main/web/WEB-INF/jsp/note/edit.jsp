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

        var note = {id : "${note.id}"};
    </script>
  </head>

  <body>

  <nav>
      <!-- 菜单栏-->
      <div id="header" class="navbar navbar-default">

          <!--mdEditor 按钮组-->
          <div class="pull-left">
              <div id="wmd-button-bar"></div>
          </div>


          <%--菜单按钮--%>
          <div class="pull-right" style="margin-right: 140px">
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
          </div>

          <!--title输入框-->
          <div class="pull-right" style="margin-right: 20px">
              <div class="navbar-form form-inline col-lg-2">
                  <input type="text" id="file-title-input" class="form-control col-xs-3" placeholder="File title">
              </div>
          </div>

          <!--title显示-->
          <div class="pull-right" style="margin-right: 20px">
              <%--line-height为了让其居中--%>
              <%--todo: 使用这里保存的数据--%>
              <a id="file-title"><span class="file-title" data-note-id="${note.id}"><%--${note.title}--%></span></a>
          </div>

          <div id="action-has-saving" class="pull-right hideme" style="margin-right: 20px">
              <div><i class="fa fa-save"></i> 已保存</div>
          </div>


      </div>
  </nav>

  <div class="mainContainer">
      <%--编辑器--%>
      <div id="left-column" class="pull-left">
          <div id="wmd-panel-editor" class="wmd-panel-editor">
              <textarea class="wmd-input" id="wmd-input" spellcheck="false"></textarea>
          </div>
      </div>

          <%--well带padding属性, 所以不使用--%>
      <div id="right-column" class="<%--well --%>pull-right">
          <div id="wmd-panel-preview" class="wmd-panel-preview">
              <div id="wmd-preview" class="wmd-preview"></div>
          </div>
      </div>

      <%--清除浮动效果--%>
      <div class="clearfix"></div>
  </div>

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
                  <button type="button" class="btn btn-primary action-remove-file"
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
                  <%--<h1>布局</h1><br/>

                  <label for="radio-layout-orientation-horizontal">水平</label>
                  <input type="radio" name="radio-layout-orientation"
                         id="radio-layout-orientation-horizontal"
                         value="horizontal">
                  &nbsp;&nbsp;&nbsp;
                  <label for="radio-layout-orientation-vertical">纵向</label>
                  <input type="radio" name="radio-layout-orientation"
                         id="radio-layout-orientation-vertical"
                         value="vertical">--%>

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
