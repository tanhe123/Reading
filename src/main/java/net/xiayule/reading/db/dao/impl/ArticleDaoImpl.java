package net.xiayule.reading.db.dao.impl;

import net.xiayule.reading.db.dao.ArticleDao;
import net.xiayule.reading.db.model.Article;
import org.springframework.orm.hibernate4.support.HibernateDaoSupport;

import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
public class ArticleDaoImpl extends HibernateDaoSupport implements ArticleDao {
    public Article get(Integer id) {
        return getHibernateTemplate().get(Article.class, id);
    }

    public void save(Article article) {
        getHibernateTemplate().saveOrUpdate(article);
    }

    public void delete(Integer id) {
        getHibernateTemplate().delete(get(id));
    }

    public void delete(Article article) {
        getHibernateTemplate().delete(article);
    }

    public List<Article> findAll() {
        return (List<Article>)getHibernateTemplate().find("from Article as article");
    }
}
