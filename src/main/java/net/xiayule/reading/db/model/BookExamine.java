package net.xiayule.reading.db.model;

/**
 * Created by tan on 14-12-23.
 * 书籍审批表
 * 用户创建新的书籍后，需要审批，审批通过后，才能被展现
 */
public class BookExamine {

    /**
     * 审批项目对应的id
     */
    private Integer id;

    /**
     * 对应的书籍的 id
     */
    private Integer bookId;

    /**
     * 创建者
     */
    private String poster;

    /**
     * 是否通过了审批
     */
    private Boolean approve;
}
