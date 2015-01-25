package net.xiayule.reading.db.dao;

import net.xiayule.reading.db.model.Note;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public interface NoteDao {
    public Note get(Integer id);

    public void save(Note note);

    public void delete(Integer id);

    public void delete(Note note);

    public List<Note> findAll();
}
