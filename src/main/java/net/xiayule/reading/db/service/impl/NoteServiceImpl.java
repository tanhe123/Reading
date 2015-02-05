package net.xiayule.reading.db.service.impl;

import net.xiayule.reading.db.model.Note;
import net.xiayule.reading.db.repositories.NoteRepository;
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
    private NoteRepository repository;

    public void create(Note note) {
        repository.insert(note);
    }

    /**
     * 返回owner所有的笔记
     */
    public List<Note> findByOwner(String owner) {
        return repository.findByOwner(owner);
    }

    public Note find(String noteId) {
        return repository.find(noteId);
    }

    /**
     * 更新note的title和content
     * @param note 更新的note
     */
    public void updateContentOrTitle(Note note) {
        repository.updateContentOrTitle(note);
    }

    /**
     * 删除笔记
     */
    public void deleteNote(String noteId) {
        repository.delete(noteId);
    }

    /**
     * 更新 blog 状态
     * @param noteId
     * @param flag
     */
    public void updateBlog(String noteId, Boolean flag) {
        repository.updateBlog(noteId, flag);
    }
}
