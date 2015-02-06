package net.xiayule.reading.db.service.impl;

import net.xiayule.reading.db.model.NoteBook;
import net.xiayule.reading.db.repositories.NoteBookRepository;
import net.xiayule.reading.db.service.NoteBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by tan on 15-2-6.
 */
@Service
public class NoteBookServiceImpl implements NoteBookService {

    @Autowired
    private NoteBookRepository noteBookRepository;

    @Override
    public void create(NoteBook noteBook) {
        noteBookRepository.insert(noteBook);
    }

    @Override
    public List<NoteBook> getNoteBooks(String userId) {
        return noteBookRepository.findAll(userId);
    }
}
