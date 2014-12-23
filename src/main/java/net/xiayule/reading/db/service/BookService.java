package net.xiayule.reading.db.service;

import net.xiayule.reading.db.model.Book;

/**
 * Created by tan on 14-12-23.
 */
public interface BookService {
    public Book getBook(Integer id);

    public void saveBook(Book book);
}
