package net.xiayule.reading.db.service;

import net.xiayule.reading.db.model.Notebook;

import java.util.List;

/**
 * Created by tan on 15-2-6.
 */
public interface NotebookService {

    /**
     * 查询 notebook
     */
    public Notebook getNotebook(String notebookId);

    /**
     * 创建一个笔记分类
     */
    public void addNotebook(Notebook notebook);

    /**
     * 查找用户的所有笔记分类
     */
    public List<Notebook> getNoteBooks(String userId);

    /**
     * 根据title获得notebookId
     */
    public String getNotebookIdByTitle(String title);
}
