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
    <title>书籍列表</title>
</head>
<body>

<table border="1">

  <tr>
    <th>id</th>
    <th>书名</th>
    <th>书籍描述</th>
    <th>操作</th>
  </tr>

<c:forEach var="book" items="${books}">

  <tr>
    <td>${book.id}</td>
    <td>${book.bookName}</td>
    <td>${book.bookDesc}</td>
    <td><a href="/book/delete?id=${book.id}">删除</a></td>
  </tr>

</c:forEach>

</table>

</body>
</html>
