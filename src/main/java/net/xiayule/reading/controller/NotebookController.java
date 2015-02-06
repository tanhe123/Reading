package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.Notebook;
import net.xiayule.reading.db.service.NotebookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

/**
 * Created by tan on 15-2-6.
 */
@Controller
@RequestMapping("/notebook")
public class NotebookController {

    @Autowired
    private NotebookService notebookService;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public @ResponseBody String addNotebook(@CookieValue(value = "userId", defaultValue = "") String userId,
                                             @RequestParam String notebookTitle) {
        Notebook notebook = new Notebook();
        notebook.setTitle(notebookTitle);
        notebook.setUserId(userId);

        System.out.println("NotebookController: addNoteBook: " + notebook);

        notebookService.addNotebook(notebook);

        return notebook.getId();
    }

}
