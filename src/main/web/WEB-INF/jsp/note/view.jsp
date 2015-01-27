<%--
  Created by IntelliJ IDEA.
  User: tan
  Date: 15-1-25
  Time: 下午5:15
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
  <title></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link href="/res/css/main.css" rel="stylesheet">

  <script data-main="/res/main" src="/res/bower-libs/requirejs/require.js"></script>

  <script>
    var viewerMode = true;
    var note = {id : "${note.id}"};
  </script>
</head>
<body class="viewer">
<div id="wmd-button-bar" class="hide"></div>
<textarea id="wmd-input" class="hide"></textarea>
<div id="wmd-preview" class="well"></div>
</body>
</html>