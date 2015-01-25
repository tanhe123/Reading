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

    /**
     * 返回owner所有的笔记
     */
    public List<Note> find(String owner) {
        return noteDao.find(owner);
    }
}
