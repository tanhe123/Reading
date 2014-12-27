package net.xiayule.reading.db.service;

import net.xiayule.reading.db.dao.ArticleDao;
import net.xiayule.reading.db.model.Article;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public interface ArticleService {
    public Article getArticle(Integer id);

    public void saveArticle(Article book);

    public void deleteArticle(Integer id);

    public List<Article> getAllArticle();

}
