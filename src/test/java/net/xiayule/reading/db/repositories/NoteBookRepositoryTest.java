package net.xiayule.reading.db.repositories;

import net.xiayule.reading.db.model.NoteBook;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "file:src/main/web/WEB-INF/dispatcher-servlet.xml")
public class NoteBookRepositoryTest {

    @Autowired
    private NoteBookRepository noteBookRepository;

    @Test
    public void testInsert() throws Exception {
        NoteBook noteBook = new NoteBook();
        noteBook.setUserId("54d3695ac830e69e287aad8c");
        noteBook.setTitle("test");

        noteBookRepository.insert(noteBook);
    }

    @Test
    public void testFindAll() throws Exception {
        List<NoteBook> noteBooks = noteBookRepository.findAll("54d3695ac830e69e287aad8c");

        System.out.println(noteBooks);
    }
}