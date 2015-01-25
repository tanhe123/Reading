package net.xiayule.reading.db.service;

import net.xiayule.reading.db.model.User;

/**
 * Created by tan on 15-1-24.
 */
public interface UserService {

    public Boolean exist(String username);

    public Boolean register(User user);

    public Boolean login(String username, String password);

    public User get(String username);

    public String findUserIdByUsername(String username);

}
