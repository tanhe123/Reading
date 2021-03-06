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
  
  <link rel="stylesheet" href="/res/bower-libs/bootstrap/dist/css/bootstrap.css"/>
  <link rel="stylesheet" href="/res/css/note.css"/>

</head>
<body>

<%--<a href="/note/new">新建笔记</a> <br/>--%>

<div class="leftHeader">

  <div class="headerContainer">
    <div class="blogOwner">
      <h1>${user.nick}'s Blog</h1>
    </div>

    <div class="separator"></div>

    <ul class="nav nav-pills nav-stacked">
      <!--todo: 如果用户登录了，则可以创建笔记-->
      <li><a href="/note/new">新建笔记</a></li>
      <li><a href="/note">主页</a></li>

      <%--笔记分类列表--%>
      <c:forEach var="notebook" items="${notebooks}">
        <li><a href="/note?category=${notebook.title}">${notebook.title}</a></li>
      </c:forEach>
    </ul>
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

<script src="/res/bower-libs/jquery/dist/jquery.min.js"></script>
<script src="/res/bower-libs/bootstrap/dist/js/bootstrap.js"></script>

</body>
</html>
