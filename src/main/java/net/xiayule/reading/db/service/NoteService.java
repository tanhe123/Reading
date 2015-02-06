package net.xiayule.reading.db.service;

import net.xiayule.reading.db.model.Note;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public interface NoteService {

    public void create(Note note);

    /**
     * 返回owner所有的笔记
     */
    public List<Note> findAll(String owner);

    public Note find(String noteId);

    /**
     * 查找notebookid下所有的笔记
     */
    public List<Note> findByNotebookId(String notebookId);

    /**
     * 更新note的title和content
     * @param note 更新的note
     */
    public void updateContentOrTitle(Note note);

    /**
     * 删除笔记
     */
    public void deleteNote(String noteId);

    /**
     * 更新 blog 状态
     * @param noteId
     * @param flag
     */
    public void updateBlog(String noteId, Boolean flag);

    /**
     * 移动笔记到其他的笔记本
     */
    public void moveNote(String noteId, String notebookId);
}
