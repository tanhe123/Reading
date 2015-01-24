package net.xiayule.reading.db.service.impl;

import com.sun.org.apache.xpath.internal.operations.Bool;
import net.xiayule.reading.db.dao.UserDao;
import net.xiayule.reading.db.model.User;
import net.xiayule.reading.db.service.UserService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by tan on 15-1-24.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserDao userDao;

    public User get(String username) {
        return userDao.get(username);
    }

    public Boolean exist(String username) {
        return userDao.exist(username);
    }

    public Boolean login(String username, String password) {
        if (StringUtils.isBlank(username.trim())
                || StringUtils.isBlank(password)) {
            return false;
        }

        username = username.trim();
        password = password.trim();

        if (!userDao.exist(username, password)) {
            return false;
        }

        return true;
    }

    public Boolean register(User user) {

        // 检测用户名、密码是否为空
        if (StringUtils.isBlank(user.getUsername())) return false;
        if (StringUtils.isBlank(user.getPassword())) return false;

        // 检测用户名是否存在
        if (userDao.exist(user.getUsername())) {
            return false;
        }

        // 保存
        userDao.save(user);

        return true;
    }
}
