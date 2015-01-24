package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.User;
import net.xiayule.reading.db.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

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

        User user = new User();
        user.setUsername("tanhe");
        user.setPassword("123");


        System.out.println(userService.exist(user.getUsername()));
        userService.register(user);

        return "index";
    }

    @RequestMapping({"/viewer"})
    public String showViewerMode() {

        System.out.println("viewer");

        return "viewer";
    }

    // 显示个人主页
    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public String showUserHome(@PathVariable String username) {

        if (!userService.exist(username)) {
            // todo: 如果用户不存在，则404, 提示用户找不到
        }

        //todo: 如果用户存在，则显示个人的主页

        return "index";
    }
}
