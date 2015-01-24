package net.xiayule.reading.db;

import com.mongodb.DB;
import com.mongodb.MongoClient;

import java.net.UnknownHostException;

/**
 * Created by tan on 15-1-24.
 */
public class MongoDbManager {

    private static MongoClient mongoClient;

    static {
        try {
            mongoClient = new MongoClient("localhost", 27017);
        } catch (UnknownHostException e) {
            e.printStackTrace();
        }
    }


    public static DB getUserDb() {
        DB db = mongoClient.getDB("user");
        return db;
    }
}
