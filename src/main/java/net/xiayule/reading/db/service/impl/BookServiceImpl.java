package net.xiayule.reading.db.service.impl;

import net.xiayule.reading.db.dao.BookDao;
import net.xiayule.reading.db.model.Book;
import net.xiayule.reading.db.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by tan on 14-12-23.
 */
//@Service
public class BookServiceImpl implements BookService {
//    @Autowired
    private BookDao bookDao;

    public Book getBook(Integer id) {
        return bookDao.get(id);
    }

    public void saveBook(Book book) {
        bookDao.save(book);
    }

    public void deleteBook(Integer id) {
        bookDao.delete(id);
    }

    public List<Book> getAllBook() {
        return bookDao.findAll();
    }

    // get and set method

    public void setBookDao(BookDao bookDao) {
        this.bookDao = bookDao;
    }
}
