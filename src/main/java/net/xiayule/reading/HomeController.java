package net.xiayule.reading;

import com.sun.glass.ui.mac.MacPasteboard;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by tan on 14-12-21.
 */
@Controller
// @RequestMapping("/mvc") // 根 url 路径
public class HomeController {

    @RequestMapping({"/", "/home"})
    public String showHomePage() {



        return "home";
    }

}
