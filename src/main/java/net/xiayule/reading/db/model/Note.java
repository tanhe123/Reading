package net.xiayule.reading.db.model;

import java.util.Date;

/**
 * Created by tan on 14-12-27.
 * 文章笔记类
 */
public class Note {
    private String id;
    private String title;
    private String content;
    private Boolean isPublic;
    private Date createTime;
    private Integer versionId;

    /**
     * 笔记所属的用户id
     */
    private String noteOwner;


    public Note() {
        createTime = new Date();
        isPublic = false;
    }

    @Override
    public String toString() {
        return "id:" + id + " title:" + title + " content:" + content;
    }

    // get and set methods


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNoteOwner() {
        return noteOwner;
    }

    public void setNoteOwner(String noteOwner) {
        this.noteOwner = noteOwner;
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

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Integer getVersionId() {
        return versionId;
    }

    public void setVersionId(Integer versionId) {
        this.versionId = versionId;
    }


}
