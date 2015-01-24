package net.xiayule.reading;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.Mongo;
import com.mongodb.MongoClient;
import net.xiayule.reading.db.model.Book;
import net.xiayule.reading.db.service.BookService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.net.UnknownHostException;
import java.util.Date;
import java.util.List;

/**
 * Created by tan on 14-12-23.
 */
public class Test {
    public static void main(String[] args) throws UnknownHostException {

        // Old version, uses Mongo
//        Mongo mongo = new Mongo("localhost", 27017);

        // new version
        MongoClient mongoClient = new MongoClient("localhost", 27017);

        DB db = mongoClient.getDB("test");

//        boolean auth = db.authenticate()

        // Display all databases
        /*List<String> dbs = mongoClient.getDatabaseNames();
        for (String d : dbs) {
            System.out.println(d);
        }*/

        // Display all collections from selected database.
        for (String collectionName : db.getCollectionNames()) {
            System.out.println(collectionName);
        }

        // Get collection / table.
        DBCollection dbCollection = db.getCollection("test");

        // Save example
    }
}
