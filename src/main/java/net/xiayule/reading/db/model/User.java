package net.xiayule.reading.db.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * Created by tan on 14-12-23.
 * 用户 Model
 */
@Document
public class User {
    /**
     * 用户的 id
     */
    @Id
    private String id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;

    /**
     * 用户昵称
     */
    private String nick;

    /**
     * 用户email
     */
    private String email;

    /**
     * 用户手机号
     */
    private String mobile;

    /**
     * 笔记分类
     */
    private List<String> notebookIds;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setId(ObjectId id) {
        this.id = id.toHexString();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public List<String> getNotebookIds() {
        return notebookIds;
    }

    public void setNotebookIds(List<String> notebookIds) {
        this.notebookIds = notebookIds;
    }
}
