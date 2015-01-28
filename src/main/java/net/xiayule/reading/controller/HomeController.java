package net.xiayule.reading.controller;

import net.xiayule.reading.db.dao.UserDao;
import net.xiayule.reading.db.model.User;
import net.xiayule.reading.db.service.UserService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Created by tan on 14-12-21.
 */
@Controller
//@SessionAttributes("user")
// @RequestMapping("/mvc") // 根 url 路径
public class HomeController {

    @Autowired
    private UserService userService;

    @RequestMapping({"/", "/home"})
    public String showHomePage(@CookieValue(value = "userId", defaultValue = "") String userId,
                               Model model) {

        // 已登录
        if (StringUtils.isNotBlank(userId)) {
            String username = userService.findUsernameByUserId(userId);

            model.addAttribute("userId", userId);
            model.addAttribute("username", username);

            System.out.println("HomeController: ShowHomePage: userId:" + userId + " username:" + username);
        }

        return "/index";
    }

    // 显示注册页面
    @RequestMapping(value = {"/register"}, method = RequestMethod.GET)
    public String newUser() {

        return "/user/register";
    }

    // 注册用户
    @RequestMapping(value = {"/register"}, method = RequestMethod.POST)
    public String createUser(@RequestParam("username") String username,
                             @RequestParam("password") String password) {

        System.out.println("create user: " + username + " " + password);

        //todo: 表单验证

        User user = new User();
        user.setUsername(username);
        user.setPassword(password);


        if (!userService.register(user)) {// todo: 注册失败，返回继续编辑
            System.out.println("创建失败");
            return "user/register";
        }

        // 进入个人主页
        System.out.println("createUser: 创建成功");

        return "redirect:/" + username;
    }

    // 用户登录
    @RequestMapping(value = {"/login"}, method = RequestMethod.GET)
    public String login(@CookieValue(value = "userId", defaultValue = "") String userId) {



        // 如果用户已经登录了，则跳转到该用户首页
        if (StringUtils.isNotBlank(userId)) {
            System.out.println("HomeController: login: userid:" + userId + " 已登录");
//            return "redirect:/" + userId;
            return "redirect:/";

        }

        return "/user/login";
    }

    // 处理用户登录表单
    @RequestMapping(value = {"/login"}, method = RequestMethod.POST)
    public String loginDo(@RequestParam("username") String username,
                          @RequestParam("password") String password,
                          HttpServletResponse response) {

        System.out.println("username:" + username + " password:" + password);

        if (userService.login(username, password)) {
            // 登录成功
            System.out.println("loginDo: 登录成功");

/*            User user = userService.get(username);
            model.addAttribute("user", user.getEmail());*/

            // 写入 cookie
            //todo: cookie 加密
            String userId = userService.findUserIdByUsername(username);
            response.addCookie(new Cookie("userId", userId));

            return "redirect:/" + username;
        }

        // 登录失败
        System.out.println("loginDo: 登录失败");
        return "/user/login";
    }

    // 显示个人主页
    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public String showUserHome(@CookieValue(value = "cookie", defaultValue = "") String userId,
                               @PathVariable String username) {

        System.out.println("showUserHome:" + username);

        if (!userService.exist(username)) {
            // todo: 如果用户不存在，则404, 提示用户找不到
            return "/user/404";
        }

        // 用户没有登录
        if (StringUtils.isBlank(userId)) {

        }

        //todo 显示所有的博客文章

        return "/user/index";
    }

    @RequestMapping({"/viewer"})
    public String showViewerMode() {

        System.out.println("viewer");

        return "/viewer";
    }
}
