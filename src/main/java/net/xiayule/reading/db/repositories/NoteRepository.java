package net.xiayule.reading.db.repositories;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;
import static org.springframework.data.mongodb.core.query.Update.update;


import net.xiayule.reading.db.model.Note;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;

import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by tan on 15-2-5.
 */
@Repository
public class NoteRepository {

    @Autowired
    MongoTemplate mongoTemplate;

    public void insert(Note note) {
        mongoTemplate.insert(note);
    }

    /**
     * 查找所有笔记，并按降序排序
     */
    public List<Note> findByOwner(String ownerId) {
        return mongoTemplate.find(query(where("userId").is(ownerId))
                .with(new Sort(new Sort.Order(Sort.Direction.DESC, "createTime"))), Note.class);
    }

    public Note find(String noteId) {
        return mongoTemplate.findById(noteId, Note.class);
    }

    /**
     * 更新note的title和content
     * @param note 更新的note
     */
    public void updateContentOrTitle(Note note) {
        mongoTemplate.updateFirst(query(where("_id").is(note.getId())),
                update("title", note.getTitle())
                        .set("content", note.getContent())
                        .inc("versionId", 1),
                Note.class);
    }

    /**
     * 更新 blog 状态
     * @param noteId
     * @param flag
     */
    public void updateBlog(String noteId, boolean flag) {
        mongoTemplate.updateFirst(query(where("_id").is(noteId)),
                update("isBlog", flag),
                Note.class);
    }

    /**
     * 删除笔记
     */
    public void delete(String noteId) {
        mongoTemplate.remove(query(where("_id").is(noteId)));
    }
}
