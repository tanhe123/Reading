package net.xiayule.reading;

import net.xiayule.reading.db.dao.impl.UserDaoImpl;

import java.net.UnknownHostException;

/**
 * Created by tan on 14-12-23.
 */
public class Test {
    public static void main(String[] args) throws UnknownHostException {

        /*Note note = new Note();
        note.setTitle("test");
        note.setContent("hahatest");
        note.setOwnerId("1");
        note.setVersionId(1);

        BasicDBObject document = new BasicDBObject()
                .append("title", note.getTitle())
                .append("content", note.getContent())
                .append("isBlog", note.getIsBlog())
                .append("createTime", note.getCreateTime())
                .append("versionId", note.getVersionId())
                .append("noteOwner", note.setOwnerId(1));

        MongoDbManager.getNoteDb().insert(document);*/

        UserDaoImpl userService = new UserDaoImpl();
        System.out.println(userService.findUserIdByUsername("1"));
    }
}
