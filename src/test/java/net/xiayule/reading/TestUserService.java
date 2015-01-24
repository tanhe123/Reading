package net.xiayule.reading;

import net.xiayule.reading.db.model.User;
import net.xiayule.reading.db.service.UserService;
import net.xiayule.reading.db.service.impl.UserServiceImpl;
import org.junit.*;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;

import javax.annotation.Resource;

/**
 * Created by tan on 15-1-24.
 */
@ContextConfiguration("file:src/main/web/WEB-INF/dispatcher-servlet.xml")
public class TestUserService {

    @Autowired
    private UserService userService;

    @Test
    public void handlerUserRegister() {
        User user = new User();
        user.setUsername("tanhe");
        user.setPassword("123");

        System.out.println(userService);


//        System.out.println(userService.register(user));
//        System.out.println("haha");
    }
}
