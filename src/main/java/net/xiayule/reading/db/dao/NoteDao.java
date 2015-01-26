package net.xiayule.reading.db.dao;

import net.xiayule.reading.db.model.Note;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public interface NoteDao {
    public void save(Note note);

    /**
     * 返回owner所有的笔记
     */
    public List<Note> find(String owner);

    public Note find(String ownerId, String noteId);

    /**
     * 更新note的title和content
     * @param note 更新的note
     */
    public void updateContentOrTitle(Note note);
}
