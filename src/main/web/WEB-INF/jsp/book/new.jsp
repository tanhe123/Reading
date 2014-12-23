<%--
  Created by IntelliJ IDEA.
  User: tan
  Date: 14-12-23
  Time: 下午5:03
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
      <td><label>书名:</label></td>
      <td><input type="text" size="20" name="bookName"></td>


    </tr>

    <tr>
      <td><label>上传者:</label></td>
      <td><input type="text" size="20" name="poster"></td>
    </tr>

    <tr>
      <td><label>描述:</label></td>
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
