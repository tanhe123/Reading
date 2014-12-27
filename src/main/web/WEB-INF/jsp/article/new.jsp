<%--
  Created by IntelliJ IDEA.
  User: tan
  Date: 14-12-27
  Time: 上午10:49
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>

<form action="/book/create" method="post">
  <table>
    <tr>
      <td><label>笔记名:</label></td>
      <td><input type="text" size="20" name="bookName"></td>


    </tr>

    <tr>
      <td><label>内容:</label></td>
      <td><textarea name="bookDesc" rows="20" cols="80"></textarea></td>
    </tr>

    <tr>
      <td></td>
      <td><input class="btn btn-primary" type="submit" value="提交"/></td>
    </tr>
  </table>

</form>
</body>
</html>
