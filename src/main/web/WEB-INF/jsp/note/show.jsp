<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  User: tan
  Date: 14-12-25
  Time: 上午11:30
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>笔记列表</title>
</head>
<body>

<table border="1">

  <tr>
    <th>id</th>
    <th>笔记名称</th>
    <th>笔记内容</th>
    <th>是否公开</th>
    <th>版本号</th>
    <th>ownerId</th>
    <th>创建时间</th>
  </tr>

<c:forEach var="note" items="${notes}">

  <tr>
    <td>${note.id}</td>
    <td>${note.title}</td>
    <td>${note.content}</td>
    <td>${note.isBlog}</td>
    <td>${note.versionId}</td>
    <td>${note.ownerId}</td>
    <td>${note.createTime}</td>

    <%--<td><a href="/article/delete?id=${note.id}">删除</a></td>--%>
  </tr>

</c:forEach>

</table>

</body>
</html>
