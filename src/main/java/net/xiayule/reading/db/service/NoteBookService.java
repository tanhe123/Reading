package net.xiayule.reading.db.service;

import net.xiayule.reading.db.model.NoteBook;

import java.util.List;

/**
 * Created by tan on 15-2-6.
 */
public interface NoteBookService {
    /**
     * 创建一个笔记分类
     */
    public void create(NoteBook noteBook);

    /**
     * 查找用户的所有笔记分类
     */
    public List<NoteBook> getNoteBooks(String userId);
}
