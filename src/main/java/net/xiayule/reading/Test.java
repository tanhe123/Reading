package net.xiayule.reading;

import com.mongodb.*;
import net.xiayule.reading.db.MongoDbManager;
import net.xiayule.reading.db.model.Book;
import net.xiayule.reading.db.model.Note;
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

        Note note = new Note();
        note.setTitle("test");
        note.setContent("hahatest");
        note.setNoteOwner("1");
        note.setVersionId(1);

        BasicDBObject document = new BasicDBObject()
                .append("title", note.getTitle())
                .append("content", note.getContent())
                .append("isPublic", note.getIsPublic())
                .append("createTime", note.getCreateTime())
                .append("versionId", note.getVersionId())
                .append("noteOwner", note.getNoteOwner());

        MongoDbManager.getNoteDb().insert(document);
    }
}
