package net.xiayule.reading.db.model;

import net.xiayule.reading.utils.JsonDateSerializer;
import org.bson.types.ObjectId;
import org.codehaus.jackson.map.annotate.JsonSerialize;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by tan on 14-12-27.
 * 文章笔记类
 */
@Document
public class Note implements Serializable {
    @Id
    private String id;

    private String title;
    private String content;
    private boolean isBlog;
    private Date createTime;

    /**
     * 图片, 第一张缩略图地址
     */
//    private String imageSrc;

    // 最后更新时间
    private Date updateTime;

    /**
     * 版本号
     * 这里如果用 Integer, mongo会把它识别为Double类型
     */
    private int versionId;

    /**
     * todo 增加一个 desc， 用来描述文章
     * 可以使用文章内容的前多少个文字来表示
     * 方便显示文章缩略图
     */
    private String desc;

    /**
     * 笔记所属的用户id
     */
    private String userId;

    private String notebookId;

    /**
     * 是否删除了（回收站)
     */
    private boolean isTrash;

    public Note() {
        updateTime = createTime = new Date();
        isBlog = false;
        versionId = 1;
        isTrash = false;
    }

    @Override
    public String toString() {
        return "id:" + id + " title:" + title + " content:" + content
                + " isBlog:" + isBlog + " versionId:" + versionId
                + " userId:" + userId + " desc:" + desc
                + " createTime:" + createTime + "\n";
    }

    public static Note createDefaultNote(String userId, String notebookId) {
        Note note = new Note();
        note.setTitle("new note");
        note.setUserId(userId);
        note.setContent("new note");
        note.setNotebookId(notebookId);

        return note;
    }



    // get and set methods


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setId(ObjectId objectId) {
        this.id = objectId.toHexString();
    }


    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isBlog() {
        return isBlog;
    }

    public void setBlog(boolean isBlog) {
        this.isBlog = isBlog;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public int getVersionId() {
        return versionId;
    }

    public void setVersionId(int versionId) {
        this.versionId = versionId;
    }

    public boolean isTrash() {
        return isTrash;
    }

    public void setTrash(boolean isTrash) {
        this.isTrash = isTrash;
    }

    public String getNotebookId() {
        return notebookId;
    }

    public void setNotebookId(String notebookId) {
        this.notebookId = notebookId;
    }

    @JsonSerialize(using=JsonDateSerializer.class)
    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
