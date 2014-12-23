package net.xiayule.reading.db.dao.impl;

import net.xiayule.reading.db.dao.BookDao;
import net.xiayule.reading.db.model.Book;
import org.springframework.orm.hibernate4.support.HibernateDaoSupport;

/**
 * Created by tan on 14-12-23.
 */
public class BookDaoImpl extends HibernateDaoSupport implements BookDao {
    public Book get(Integer id) {
        return getHibernateTemplate().get(Book.class, id);
    }

    public void save(Book book) {
        getHibernateTemplate().saveOrUpdate(book);
    }

    public void delete(Integer id) {
        getHibernateTemplate().delete(get(id));
    }

    public void delete(Book book) {
        getHibernateTemplate().delete(book);
    }
}
