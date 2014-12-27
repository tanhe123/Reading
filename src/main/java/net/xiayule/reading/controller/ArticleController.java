package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.Article;
import net.xiayule.reading.db.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
@Controller
@RequestMapping("/article")
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public String newArticle() {
        return "/article/new";
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String createArticle(@RequestParam String title,
                                @RequestParam String content) {

        System.out.println(title);
        System.out.println(content);

        Article article = new Article();
        article.setTitle(title);
        article.setContent(content);

        articleService.saveArticle(article);

        return "redirect:/article/show";
    }

    @RequestMapping(value = "/show", method = RequestMethod.GET)
    public String showArticle(Model model) {
        List<Article> articles = articleService.getAllArticle();

        System.out.println(articles);

        model.addAttribute("articles", articles);

        return "/article/show";
    }

    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    public String deleteArticle(@RequestParam Integer id) {

        try {
            articleService.deleteArticle(id);
        } catch (Exception e) {
            System.out.println("删除失败");
        }

        return "redirect:/article/show";
    }
}
