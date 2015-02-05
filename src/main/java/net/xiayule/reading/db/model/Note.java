package net.xiayule.reading.db.model;

import com.sun.org.apache.xpath.internal.operations.Bool;
import org.bson.types.ObjectId;

import java.io.Serializable;
import java.util.Date;

/**
 * Created by tan on 14-12-27.
 * 文章笔记类
 */
public class Note implements Serializable {

    private String id;
    private String title;
    private String content;
    private boolean isBlog;
    private Date createTime;

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
    private String ownerId;

    /**
     * 是否删除了（回收站)
     */
    private boolean isTrash;

    public Note() {
        createTime = new Date();
        isBlog = false;
        versionId = 1;
        isTrash = false;
    }

    @Override
    public String toString() {
        return "id:" + id + " title:" + title + " content:" + content
                + " isBlog:" + isBlog + " versionId:" + versionId
                + " ownerId:" + ownerId + " desc:" + desc
                + " createTime:" + createTime + "\n";
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

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
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
}
