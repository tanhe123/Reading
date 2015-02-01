package net.xiayule.reading.db.dao;

import net.xiayule.reading.db.model.Note;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public interface NoteDao {
    public void create(Note note);

    /**
     * 返回owner所有的笔记
     */
    public List<Note> findByOwner(String owner);

    public Note find(String noteId);

    /**
     * 更新note的title和content
     * @param note 更新的note
     */
    public void updateContentOrTitle(Note note);

    /**
     * 删除笔记
     */
    public void delete(String noteId);

    /**
     * 更新 blog 状态
     * @param noteId
     * @param flag
     */
    public void updateBlog(String noteId, Boolean flag);
}
