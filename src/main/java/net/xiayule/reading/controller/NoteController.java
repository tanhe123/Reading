package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.Note;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
@Controller
@RequestMapping("/{username}/note")
public class NoteController {

//    @Autowired
//    private ArticleService articleService;

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public String newNote(@PathVariable String username) {

        System.out.println(username);

        return "/note/new";
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public @ResponseBody
    Note createNote(@PathVariable String username,
                    @RequestParam String title,
                    @RequestParam String content) {

        System.out.println(username);

        Note note = new Note();
        note.setTitle(title);
        note.setContent(content);
        //todo: noteOwener
        note.setNoteOwner("1");
        //todo: version id
        note.setVersionId(1);

        return note;
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String showAllNote(Model model) {

        


//        List<Article> articles = articleService.getAllArticle();

//        System.out.println(articles);

//        model.addAttribute("articles", articles);

        return "/note/show";
    }

    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    public String deleteNote(@RequestParam Integer id) {

//        try {
//            articleService.deleteArticle(id);
//        } catch (Exception e) {
//            System.out.println("删除失败");
//        }

        return "redirect:/note/show";
    }
}
