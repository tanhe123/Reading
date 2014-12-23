package net.xiayule.reading.db.model;

import javax.persistence.Entity;
import java.util.*;

/**
 * Created by tan on 14-12-23.
 * Book Model
 */
public class Book {
    /**
     * 书籍的 id
     */
    private Integer id;

    /**
     * 书籍的名称
     */
    private String bookName;

    /**
     * 书籍的作者, 可能包含几个作者
     */
    private Set<String> authors = new HashSet<String>();

    /**
     * 书籍的封面图片地址
     */
    private String imgUrl;

    /**
     * 书籍的描述
     */
    private String bookDesc;

    /**
     * 书籍的 isbn
     */
    private String isbn;

    /**
     * 书籍的出版社
     */
    private String publisher;

    /**
     * 书籍的出版时间
     */
    private Date date;

    /**
     * 添加一个作者
     * @param author
     */
    public void addAuthor(String author) {
        this.authors.add(author);
    }

    @Override
    public String toString() {
        return "id:" + id + " bookName:" + bookName + " authors:" + authors + " imgUrl:" + imgUrl
                + " desc:" + bookDesc + " isbn:" + isbn + " publisher:" + publisher + " date:" + date;
    }

    // get and set methods


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getBookName() {
        return bookName;
    }

    public void setBookName(String bookName) {
        this.bookName = bookName;
    }

    public void setAuthors(Set<String> authors) {
        this.authors = authors;
    }

    public Set<String> getAuthors() {
        return authors;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getBookDesc() {
        return bookDesc;
    }

    public void setBookDesc(String bookDesc) {
        this.bookDesc = bookDesc;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
