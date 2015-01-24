package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.User;
import net.xiayule.reading.db.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by tan on 14-12-21.
 */
@Controller
// @RequestMapping("/mvc") // 根 url 路径
public class HomeController {

    @Autowired
    private UserService userService;

    @RequestMapping({"/", "/home"})
    public String showHomePage() {

        return "index";
    }

    // 显示注册页面
    @RequestMapping(value = {"/register"}, method = RequestMethod.GET)
    public String newUser() {

        return "user/register";
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

        //todo: 进入个人主页
        System.out.println("创建成功");

        return "redirect:/" + username;
    }


    // 显示个人主页
    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public String showUserHome(@PathVariable String username) {

        System.out.println("showUserHome:" + username);

        if (!userService.exist(username)) {
            // todo: 如果用户不存在，则404, 提示用户找不到
        }

        //todo: 如果用户存在，则显示个人的主页

        return "index";
    }

    @RequestMapping({"/viewer"})
    public String showViewerMode() {

        System.out.println("viewer");

        return "viewer";
    }
}
