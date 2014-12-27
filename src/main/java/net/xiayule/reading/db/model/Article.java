package net.xiayule.reading.db.model;

import com.sun.org.apache.xpath.internal.operations.Bool;

import java.util.Date;

/**
 * Created by tan on 14-12-27.
 * 文章笔记类
 */
public class Article {
    private Integer articleId;
    private String title;
    private String content;
    private Boolean isPublic;
    private Date createTime;
    private Integer versionId;

    /**
     * user 与 article 之间的关系为 一对多
     */
    private User owner;

    public Article() {
        createTime = new Date();
    }

    // get and set methods


    public Integer getArticleId() {
        return articleId;
    }

    public void setArticleId(Integer articleId) {
        this.articleId = articleId;
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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }
}
