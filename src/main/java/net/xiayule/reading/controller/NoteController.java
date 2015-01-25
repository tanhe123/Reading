package net.xiayule.reading.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by tan on 14-12-27.
 */
@Controller
@RequestMapping("/article")
public class NoteController {

//    @Autowired
//    private ArticleService articleService;

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public String newNote() {
        return "/note/new";
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String createNote(@RequestParam String title,
                                @RequestParam String content) {

//        System.out.println(title);
//        System.out.println(content);

//        Article article = new Article();
//        article.setTitle(title);
//        article.setContent(content);

//        articleService.saveArticle(article);

        return "redirect:/note/show";
    }

    @RequestMapping(value = "/show", method = RequestMethod.GET)
    public String showNote(Model model) {
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
