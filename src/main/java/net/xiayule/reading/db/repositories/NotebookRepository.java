package net.xiayule.reading.db.repositories;

import net.xiayule.reading.db.model.Notebook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

/**
 * Created by tan on 15-2-6.
 */
@Repository
public class NotebookRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public void insert(Notebook notebook) {
        mongoTemplate.insert(notebook);
    }

    public List<Notebook> findAll(String userId) {
        List<Notebook> notebooks = mongoTemplate.find(query(where("userId").is(userId)),
                Notebook.class);
        return notebooks;
    }
}
