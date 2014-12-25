package net.xiayule.reading.db.dao;

import net.xiayule.reading.db.model.Book;

import java.util.List;

/**
 * Created by tan on 14-12-23.
 */
public interface BookDao {
    public Book get(Integer id);

    public void save(Book book);

    public void delete(Integer id);

    public void delete(Book book);

    public List<Book> findAll();
}
