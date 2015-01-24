package net.xiayule.reading.db;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

import java.net.UnknownHostException;

/**
 * Created by tan on 15-1-24.
 */
public class MongoDbManager {

    private static MongoClient mongoClient;
    private static DB db;

    static {
        try {
            mongoClient = new MongoClient("localhost", 27017);
            db = mongoClient.getDB("reading");
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }


    public static DBCollection getUserDb() {
        return db.getCollection("user");
    }
}
