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

  <link rel="stylesheet" href="/res/css/note.css"/>
</head>
<body>

<%--<a href="/note/new">新建笔记</a> <br/>--%>

<div class="leftHeader">

  <div class="headerContainer">
    <div class="blogOwner">
      <h1>Tan's Blog</h1>
    </div>

    <div class="separator">
    </div>
  </div>



</div>

<div class="postsContainer">
  <c:forEach var="note" items="${notes}">
    <div class="note">
      <div class="noteTitle">
        <a href="/note/${note.id}">${note.title}</a>
      </div>

      <div class="noteDesc">
          ${note.content}
      </div>

      <div class="noteInfo">
        posted @ ${note.createTime}
        <a href="/note/${note.id}/edit">编辑</a>
      </div>
    </div>
  </c:forEach>
</div>



<%--<table border="1">

  <tr>
    <th>笔记名称</th>
    <th>笔记内容</th>
    <th>是否公开</th>
    <th>版本号</th>
    <th>ownerId</th>
    <th>创建时间</th>
    <th>查看</th>
    <th>编辑</th>
  </tr>

<c:forEach var="note" items="${notes}">

  <tr>
    <td>${note.title}</td>
    <td>${note.content}</td>
    <td>${note.isBlog}</td>
    <td>${note.versionId}</td>
    <td>${note.ownerId}</td>
    <td>${note.createTime}</td>

    <td><a href="/note/${note.id}">查看</a></td>
    <td><a href="/note/${note.id}/edit">编辑</a></td>
  </tr>

</c:forEach>

</table>--%>

</body>
</html>
