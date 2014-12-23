package net.xiayule.reading.db.model;

import java.util.List;

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
    private List<String> author;

    /**
     * 书籍的封面图片地址
     */
    private String imgUrl;

    /**
     * 书籍的描述
     */
    private String desc;

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
    private String date;
}
