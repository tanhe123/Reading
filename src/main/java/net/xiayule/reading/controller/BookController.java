package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import java.util.List;

/**
 * Created by tan on 14-12-23.
 */
@Controller
@RequestMapping("/book")
public class BookController {

//    @Autowired
//    private BookService bookService;

    @RequestMapping(value = "/new", method = RequestMethod.GET)
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

//        try {
//            bookService.saveBook(book);
//        } catch (Exception e) {
//            System.out.println("保存错误");
//        }

        return "redirect:/book/show";
    }

    @RequestMapping(value = "/show", method = RequestMethod.GET)
    public String show(Model model) {

//        List<Book> books = bookService.getAllBook();
//
//        model.addAttribute("books", books);
//
        return "/book/show";
    }

    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    public String delete(@RequestParam Integer id) {

//        try {
//            bookService.deleteBook(id);
//        } catch (Exception e) {
//            System.out.println("删除失败");
//        }

        return "redirect:/book/show";
    }

    // get and set methods

//    public void setBookService(BookService bookService) {
//        this.bookService = bookService;
//    }
}
