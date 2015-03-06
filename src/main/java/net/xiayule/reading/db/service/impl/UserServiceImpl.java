package net.xiayule.reading.db.service.impl;

import net.xiayule.reading.db.model.User;
import net.xiayule.reading.db.repositories.UserRepository;
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
    private UserRepository userRepository;

    public User get(String username) {
        return userRepository.get(username);
    }

    @Override
    public void addNotebook(String userId, String notebookId) {
        userRepository.addNotebook(userId, notebookId);
    }

    public Boolean exist(String username) {
        return userRepository.exist(username);
    }

    public Boolean login(String username, String password) {
        if (StringUtils.isBlank(username.trim())
                || StringUtils.isBlank(password)) {
            return false;
        }

        username = username.trim();
        password = password.trim();

        if (!userRepository.exist(username, password)) {
            return false;
        }

        return true;
    }

    public Boolean register(User user) {

        // 检测用户名是否为空
        if (StringUtils.isBlank(user.getUsername())) return false;
        // 检测昵称是否为空
        if (StringUtils.isBlank(user.getNick())) return false;
        // 检测密码是否为空
        if (StringUtils.isBlank(user.getPassword())) return false;

        // 检测用户名是否存在
        if (userRepository.exist(user.getUsername())) {
            return false;
        }

        // 检查昵称是否存在
        if (userRepository.existNick(user.getNick())) {
            return false;
        }

        // 保存
        userRepository.insert(user);

        return true;
    }

    public String findUserIdByUsername(String username) {
        return userRepository.findUserIdByUsername(username);
    }

    public String findUsernameByUserId(String userId) {
        return userRepository.findUsernameByUserId(userId);
    }
}
