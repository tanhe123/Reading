package net.xiayule.reading.db.repositories;

import net.xiayule.reading.db.model.NoteBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

/**
 * Created by tan on 15-2-6.
 */
@Repository
public class NoteBookRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void insert(NoteBook noteBook) {
        mongoTemplate.insert(noteBook);
    }

    public List<NoteBook> findAll(String userId) {
        List<NoteBook> noteBooks = mongoTemplate.find(query(where("userId").is(userId)),
                NoteBook.class);
        return noteBooks;
    }
}
