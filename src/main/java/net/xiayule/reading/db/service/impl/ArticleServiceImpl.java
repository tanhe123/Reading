package net.xiayule.reading.db.service.impl;

import net.xiayule.reading.db.dao.ArticleDao;
import net.xiayule.reading.db.model.Article;
import net.xiayule.reading.db.service.ArticleService;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public class ArticleServiceImpl implements ArticleService {
    private ArticleDao articleDao;

    public Article getArticle(Integer id) {
        return articleDao.get(id);
    }

    public void saveArticle(Article book) {
        articleDao.save(book);
    }

    public void deleteArticle(Integer id) {
        articleDao.delete(id);
    }

    public List<Article> getAllArticle() {
        return articleDao.findAll();
    }

    // get and set method


    public void setArticleDao(ArticleDao articleDao) {
        this.articleDao = articleDao;
    }
}
