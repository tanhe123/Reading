package net.xiayule.reading.db.dao.impl;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.WriteResult;
import net.xiayule.reading.db.MongoDbManager;
import net.xiayule.reading.db.dao.UserDao;
import net.xiayule.reading.db.model.User;
import org.apache.commons.lang.StringUtils;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;

/**
 * Created by tan on 15-1-24.
 */
@Repository
public class UserDaoImpl implements UserDao {

    private DBCollection getTable() {
        return MongoDbManager.getUserDb();
    }

    public void save(User user) {
        BasicDBObject document = new BasicDBObject();

        document.put("username", user.getUsername());
        document.put("password", user.getPassword());

        getTable().insert(document);
    }

    public Boolean exist(String username) {
        BasicDBObject query = new BasicDBObject("username", username);

        return getTable().find(query).count() > 0;
    }

    public Boolean exist(String username, String password) {
        BasicDBObject query = new BasicDBObject("username", username)
                .append("password", password);
        return getTable().find(query).count() > 0;
    }

    public User get(String username) {
        BasicDBObject query = new BasicDBObject("username", username);

        DBObject dbObject = getTable().findOne(query);

        User user = new User();

        user.setUsername((String)dbObject.get("username"));
        user.setPassword((String)dbObject.get("password"));

        return user;
    }


    public String findUserIdByUsername(String username) {
        BasicDBObject query = new BasicDBObject("username", username);

        BasicDBObject queryFilter = new BasicDBObject("_id", 1);

        DBObject dbObject = getTable().findOne(query, queryFilter);

        String userId = ((ObjectId) dbObject.get("_id")).toHexString();

        return userId;
    }

    public String findUsernameByUserId(String userId) {
        BasicDBObject query = new BasicDBObject("_id", new ObjectId(userId));

        BasicDBObject queryFilter = new BasicDBObject("username", 1);

        DBObject dbObject = getTable().findOne(query, queryFilter);

        String username = (String) dbObject.get("username");

        return username;
    }
}
