package net.xiayule.reading.db.service.impl;

import net.xiayule.reading.db.dao.NoteDao;
import net.xiayule.reading.db.model.Note;
import net.xiayule.reading.db.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
@Service
public class NoteServiceImpl implements NoteService {

    @Autowired
    private NoteDao noteDao;

    public void create(Note note) {
        noteDao.create(note);
    }

    /**
     * 返回owner所有的笔记
     */
    public List<Note> findByOwner(String owner) {
        return noteDao.findByOwner(owner);
    }

    public Note find(String noteId) {
        return noteDao.find(noteId);
    }

    /**
     * 更新note的title和content
     * @param note 更新的note
     */
    public void updateContentOrTitle(Note note) {
        noteDao.updateContentOrTitle(note);
    }

    /**
     * 删除笔记
     */
    public void deleteNote(String noteId) {
        noteDao.delete(noteId);
    }

    /**
     * 更新 blog 状态
     * @param noteId
     * @param flag
     */
    public void updateBlog(String noteId, Boolean flag) {
        noteDao.updateBlog(noteId, flag);
    }
}
