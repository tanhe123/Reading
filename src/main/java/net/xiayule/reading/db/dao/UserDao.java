package net.xiayule.reading.db.dao;

import net.xiayule.reading.db.model.User;

/**
 * Created by tan on 15-1-24.
 */
public interface UserDao {
    public void save(User user);

    public Boolean exist(String username);
    public Boolean exist(String username, String password);
    /**
     * nick是否已经存在
     */
    public Boolean existNick(String nick);

    public User get(String username);

    public String findUserIdByUsername(String username);
    public String findUsernameByUserId(String userId);
}
