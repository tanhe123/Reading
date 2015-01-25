package net.xiayule.reading.db.dao.impl;

import com.mongodb.*;
import net.xiayule.reading.db.MongoDbManager;
import net.xiayule.reading.db.dao.NoteDao;
import net.xiayule.reading.db.model.Note;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Repository;

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

    public void save(Note note) {
        BasicDBObject document = new BasicDBObject()
                .append("title", note.getTitle())
                .append("content", note.getContent())
                .append("isBlog", note.getIsBlog())
                .append("createTime", note.getCreateTime())
                .append("versionId", note.getVersionId())
                .append("ownerId", note.getOwnerId());

        getTable().insert(document);
    }

    /**
     * 返回owner所有的笔记
     */
    public List<Note> find(String ownerId) {
        DBCollection userTable = MongoDbManager.getNoteDb();

        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("ownerId", ownerId);

        DBCursor cursor = userTable.find(searchQuery);

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

    public Note find(String ownerId, String noteId) {
        DBCollection userTable = MongoDbManager.getNoteDb();

        BasicDBObject searchQuery = new BasicDBObject();
        searchQuery.put("ownerId", ownerId);
        searchQuery.put("_id", new ObjectId(noteId));

        DBObject dbObject = userTable.findOne(searchQuery);

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
}
