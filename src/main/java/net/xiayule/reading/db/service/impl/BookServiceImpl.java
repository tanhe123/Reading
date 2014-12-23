package net.xiayule.reading.db.service.impl;

import net.xiayule.reading.db.dao.BookDao;
import net.xiayule.reading.db.model.Book;
import net.xiayule.reading.db.service.BookService;

/**
 * Created by tan on 14-12-23.
 */
public class BookServiceImpl implements BookService {
    private BookDao bookDao;

    public Book getBook(Integer id) {
        return bookDao.get(id);
    }

    public void saveBook(Book book) {
        bookDao.save(book);
    }

    // get and set method

    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }
}
