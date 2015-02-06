package net.xiayule.reading.db.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 * Created by tan on 15-2-5.
 */
public class NoteBook {

    /**
     * 笔记分类id
     */
    private String id;

    /**
     * 笔记分类名
     */
    private String title;

    /**
     * 所属的user的id
     */
    private String userId;

    /**
     * notebook的顺序
     */
    private Integer seq;

    /**
     * 该笔记分类下的笔记数
     */
    private int noteNumber;

    /**
     * 创建时间
     */
    private Date createTime;

    public NoteBook() {
        createTime = new Date();
        noteNumber = 0;
        seq = 0;
    }

    @Override
    public String toString() {
        return "id:" + id + " title:" + title + " userId:" + userId +
                " seq:" + seq + " noteNumber:" + noteNumber +
                " createTime:" + createTime;
    }

    // set and get methods


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setId(ObjectId objectId) {
        this.id = objectId.toHexString();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getSeq() {
        return seq;
    }

    public void setSeq(Integer seq) {
        this.seq = seq;
    }

    public int getNoteNumber() {
        return noteNumber;
    }

    public void setNoteNumber(int noteNumber) {
        this.noteNumber = noteNumber;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
