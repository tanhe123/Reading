package net.xiayule.reading.db.repositories;

import net.xiayule.reading.db.model.Notebook;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = "file:src/main/web/WEB-INF/dispatcher-servlet.xml")
public class NotebookRepositoryTest {

    @Autowired
    private NotebookRepository notebookRepository;

    @Test
    public void testInsert() throws Exception {
        Notebook notebook = new Notebook();
        notebook.setUserId("54d44faac8303be6c9f8baaf");
        notebook.setTitle("ba");

        notebookRepository.insert(notebook);
    }

    @Test
    public void testFindAll() throws Exception {
        List<Notebook> notebooks = notebookRepository.findAll("54d44faac8303be6c9f8baaf");

        System.out.println(notebooks);
    }
}