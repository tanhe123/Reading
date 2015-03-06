package net.xiayule.reading.db.service.impl;

import net.xiayule.reading.db.model.Notebook;
import net.xiayule.reading.db.repositories.NotebookRepository;
import net.xiayule.reading.db.service.NotebookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by tan on 15-2-6.
 */
@Service
public class NotebookServiceImpl implements NotebookService {

    @Autowired
    private NotebookRepository notebookRepository;

    @Override
    public Notebook getNotebook(String notebookId) {
        return notebookRepository.getNotebook(notebookId);
    }

    @Override
    public void addNotebook(Notebook notebook) {
        notebookRepository.insert(notebook);
    }

    @Override
    public List<Notebook> getNoteBooks(String userId) {
        return notebookRepository.findAll(userId);
    }

    /**
     * 根据title获得notebookId
     */
    public String getNotebookIdByTitle(String title) {
        return notebookRepository.getNotebookIdByTitle(title);
    }
}
