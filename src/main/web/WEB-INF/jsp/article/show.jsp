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
    <th>操作</th>
  </tr>

<c:forEach var="article" items="${articles}">

  <tr>
    <td>${article.id}</td>
    <td>${article.title}</td>
    <td>${article.content}</td>
    <td><a href="/article/delete?id=${article.id}">删除</a></td>
  </tr>

</c:forEach>

</table>

</body>
</html>
