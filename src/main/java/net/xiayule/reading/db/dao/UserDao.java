package net.xiayule.reading.db.dao;

import net.xiayule.reading.db.model.User;

/**
 * Created by tan on 15-1-24.
 */
public interface UserDao {
    public void save(User user);

    public Boolean exist(String username);
}
