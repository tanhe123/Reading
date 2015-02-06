package net.xiayule.reading.db.repositories;

import net.xiayule.reading.db.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

/**
 * Created by tan on 15-2-5.
 */
@Repository
public class UserRepository {
    @Autowired
    MongoTemplate mongoTemplate;

    public void insert(User user) {
        mongoTemplate.insert(user);
    }

    public Boolean exist(String username) {
        return mongoTemplate.exists(query(where("username").is(username)),
                User.class);
    }

    public Boolean exist(String username, String password) {
        return mongoTemplate.exists(query(where("username").is(username)
                .and("password").is(password)),
                User.class);
    }

    public User get(String id) {
        return mongoTemplate.findById(id, User.class);
    }

    public User getByUsername(String username) {
        return mongoTemplate.findOne(query(where("username").is(username)),
                User.class);
    }


    public String findUserIdByUsername(String username) {
        // todo: 应当使用查询指定的列
        User user = mongoTemplate.findOne(query(where("username").is(username)),
                User.class);

        return user.getId();
    }

    public String findUsernameByUserId(String userId) {
        User user = mongoTemplate.findOne(query(where("_id").is(userId)),
                User.class);

        return user.getUsername();
    }

    /**
     * nick是否已经存在
     */
    public Boolean existNick(String nick) {
        return mongoTemplate.exists(query(where("nick").is(nick)),
                User.class);
    }
}
