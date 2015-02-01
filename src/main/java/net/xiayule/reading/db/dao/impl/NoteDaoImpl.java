package net.xiayule.reading.db.dao.impl;

import com.mongodb.*;
import net.xiayule.reading.db.MongoDbManager;
import net.xiayule.reading.db.dao.NoteDao;
import net.xiayule.reading.db.model.Note;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;

import javax.swing.plaf.basic.BasicOptionPaneUI;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
@Repository
public class NoteDaoImpl implements NoteDao {

    private DBCollection getTable() {
        return MongoDbManager.getNoteDb();
    }

    public void create(Note note) {
        BasicDBObject document = new BasicDBObject()
                .append("title", note.getTitle())
                .append("content", note.getContent())
                .append("isBlog", note.getIsBlog())
                .append("createTime", note.getCreateTime())
                .append("versionId", note.getVersionId())
                .append("ownerId", note.getOwnerId());

        getTable().insert(document);

        // 更新note在mongo插入时生成的id
        note.setId((ObjectId) document.get("_id"));
    }

    /**
     * 返回owner所有的笔记
     */
    public List<Note> findByOwner(String ownerId) {
        DBCollection noteTable = getTable();

        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("ownerId", ownerId);

        DBCursor cursor = noteTable.find(searchQuery);

        ArrayList<Note> notes = new ArrayList<Note>();

        while (cursor.hasNext()) {
            DBObject dbObject = cursor.next();

            Note note = new Note();
            note.setId((ObjectId)dbObject.get("_id"));
            note.setOwnerId((String) dbObject.get("ownerId"));
            note.setVersionId((Integer)dbObject.get("versionId"));
            note.setContent((String)dbObject.get("content"));
            note.setCreateTime((Date)dbObject.get("createTime"));
            note.setIsBlog((Boolean) dbObject.get("isBlog"));
            note.setTitle((String)dbObject.get("title"));

            notes.add(note);
        }

        return notes;
    }

    //todo:这里只需要 noteid
    public Note find(String noteId) {
        DBCollection noteTable = getTable();

        BasicDBObject searchQuery = new BasicDBObject();
//        searchQuery.put("ownerId", ownerId);
        searchQuery.put("_id", new ObjectId(noteId));

        DBObject dbObject = noteTable.findOne(searchQuery);

        System.out.println("NoteDaoImpl find:" + dbObject);

        Note note = new Note();
        note.setId((ObjectId) dbObject.get("_id"));
        note.setOwnerId((String) dbObject.get("ownerId"));
        note.setVersionId((Integer)dbObject.get("versionId"));
        note.setContent((String)dbObject.get("content"));
        note.setCreateTime((Date)dbObject.get("createTime"));
        note.setIsBlog((Boolean) dbObject.get("isBlog"));
        note.setTitle((String)dbObject.get("title"));

        return note;
    }

    /**
     * 更新note的title和content
     * @param note 更新的note
     */
    public void updateContentOrTitle(Note note) {

//        db.note.update({"_id": ObjectId("54c49161c830e2fddcf8ecf6")}, {"$set":{"content":"content", "title":"title"}, "$inc":{"versionId":1}})

        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("_id", new ObjectId(note.getId()));

        DBObject updateQuery = new BasicDBObject()
                .append("$set", new BasicDBObject("title", note.getTitle())
                        .append("content", note.getContent())
                )
                .append("$inc", new BasicDBObject("versionId", 1));

        getTable().update(searchQuery, updateQuery);
    }

    /**
     * 更新 blog 状态
     * @param noteId
     * @param flag
     */
    public void updateBlog(String noteId, Boolean flag) {
        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("_id", new ObjectId(noteId));

        DBObject updateQuery = new BasicDBObject()
                .append("$set", new BasicDBObject("isBlog", flag));

        getTable().update(searchQuery, updateQuery);
    }

    /**
     * 删除笔记
     */
    public void delete(String noteId) {
        BasicDBObject deleteQuery = new BasicDBObject();
        deleteQuery.put("_id", new ObjectId(noteId));

        getTable().remove(deleteQuery);
    }
}
