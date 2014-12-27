package net.xiayule.reading;

import net.xiayule.reading.db.model.Book;
import net.xiayule.reading.db.service.BookService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import java.util.Date;

/**
 * Created by tan on 14-12-23.
 */
public class Test {
    public static void main(String[] args) {
        System.out.println("haha");
        ApplicationContext ctx = new ClassPathXmlApplicationContext("");
        BookService bookService = ctx.getBean("", BookService.class);

        //todo: book get save 测试
        Book book = new Book();
        book.setBookName("test");
        book.setIsbn("123");
        book.setBookDesc("this is just a test");
        book.setDate(new Date());
        book.addAuthor("tan");
        book.addAuthor("he");
        book.setImgUrl("http://123");
        book.setPublisher("sdut");

        bookService.saveBook(book);

        System.out.println(bookService.getBook(3));
        System.out.println("haha");
    }
}
