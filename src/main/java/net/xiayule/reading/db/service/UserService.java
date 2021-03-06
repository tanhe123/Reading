package net.xiayule.reading.db.service;

import net.xiayule.reading.db.model.User;

/**
 * Created by tan on 15-1-24.
 */
public interface UserService {

    public Boolean exist(String username);

    public Boolean register(User user);

    public Boolean login(String username, String password);

    public User get(String id);

    public String findUserIdByUsername(String username);

    public String findUsernameByUserId(String userId);

    /**
     * 添加记事本
     */
    public void addNotebook(String userId, String notebookId);
}
