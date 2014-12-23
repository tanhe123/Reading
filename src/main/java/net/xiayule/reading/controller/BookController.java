package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.Book;
import net.xiayule.reading.db.service.BookService;
import org.hibernate.service.spi.InjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Created by tan on 14-12-23.
 */
@Controller
@RequestMapping("/book")
public class BookController {
    @Autowired
    private BookService bookService;

    @RequestMapping("/new")
    public String newBook() {

        return "book/new";
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public String createBook(@RequestParam String bookName,
                             @RequestParam String poster,
                             @RequestParam String bookDesc) {

        //todo: 还没有处理 poster

        System.out.println(bookName);
        System.out.println(bookDesc);
        System.out.println(poster);

        Book book = new Book();
        book.setBookName(bookName);
        book.setBookDesc(bookDesc);

        try {
            bookService.saveBook(book);
        } catch (Exception e) {
            System.out.println("保存错误");
        }


        return "redirect:/new";
    }

    // get and set methods


    public void setBookService(BookService bookService) {
        this.bookService = bookService;
    }
}
