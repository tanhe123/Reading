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

    <title>Pagedown editor</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap -->
    <link href="/res/bower-libs/bootstrap/dist/css/bootstrap.css" rel="stylesheet" media="screen">
    <link href="/res/css/main.css" rel="stylesheet" media="screen">
    <script type="text/javascript" src="/res/bower-libs/jquery/dist/jquery.js"></script>
    <script type="text/javascript" src="/res/libs/Markdown.Converter.js"></script>
    <script type="text/javascript" src="/res/libs/Markdown.Sanitizer.js"></script>
    <script type="text/javascript" src="/res/libs/Markdown.Editor.js"></script>
    <script type="text/javascript" src="/res/main.js"></script>
  </head>
  <body>

  <div id="wmd-button-bar"></div>
  <h4 id="info-filename"></h4>
  <textarea id="wmd-input"></textarea>
  <div id="wmd-preview" class="well"></div>

  </body>
</html>
