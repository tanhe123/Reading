package net.xiayule.reading.db.dao;

import net.xiayule.reading.db.model.Article;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public interface ArticleDao {
    public Article get(Integer id);

    public void save(Article article);

    public void delete(Integer id);

    public void delete(Article article);

    public List<Article> findAll();
}
