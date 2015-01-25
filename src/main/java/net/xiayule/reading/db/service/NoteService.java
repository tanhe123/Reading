package net.xiayule.reading.db.service;

import net.xiayule.reading.db.model.Note;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public interface NoteService {

    /**
     * 返回owner所有的笔记
     */
    public List<Note> find(String owner);

}
