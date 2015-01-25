package net.xiayule.reading.db.dao.impl;

import com.mongodb.BasicDBObject;
import com.mongodb.DBCollection;
import net.xiayule.reading.db.MongoDbManager;
import net.xiayule.reading.db.dao.NoteDao;
import net.xiayule.reading.db.model.Note;

/**
 * Created by tan on 14-12-27.
 */
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
                .append("noteOwner", note.getNoteOwner());

        getTable().insert(document);
    }


}
