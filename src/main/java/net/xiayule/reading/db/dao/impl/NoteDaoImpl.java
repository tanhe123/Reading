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
                .append("isPublic", note.getIsPublic())
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

        System.out.println("cursor size:" + cursor.size());

        while (cursor.hasNext()) {
            DBObject dbObject = cursor.next();

            Note note = new Note();
            note.setId((ObjectId)dbObject.get("_id"));
            note.setOwnerId((String) dbObject.get("ownerId"));
            note.setVersionId((Integer)dbObject.get("versionId"));
            note.setContent((String)dbObject.get("content"));
            note.setCreateTime((Date)dbObject.get("createTime"));
            note.setIsPublic((Boolean)dbObject.get("isPublic"));
            note.setTitle((String)dbObject.get("title"));

            notes.add(note);
        }

        return notes;
    }
}
