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
</head>
<body>

<table border="1">
  <tr>
    <td>${note.id}</td>
    <td>${note.title}</td>
    <td>${note.content}</td>
    <td>${note.isBlog}</td>
    <td>${note.versionId}</td>
    <td>${note.ownerId}</td>
    <td>${note.createTime}</td>
  </tr>
</table>

</body>
</html>
