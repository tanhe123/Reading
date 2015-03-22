package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.Note;
import net.xiayule.reading.db.model.Notebook;
import net.xiayule.reading.db.model.User;
import net.xiayule.reading.db.service.NotebookService;
import net.xiayule.reading.db.service.NoteService;
import net.xiayule.reading.db.service.UserService;
import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Created by tan on 14-12-27.
 */
@Controller
@RequestMapping("/note")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotebookService notebookService;

    private static ObjectMapper objectMapper = new ObjectMapper();

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public String newNote(@CookieValue(value = "userId", defaultValue = "") String userId,
                          Model model) {

        Note note = new Note();
        note.setTitle("new note");
        note.setUserId(userId);
        note.setContent("new note");

        // 指定笔记本
        // 1. 如果没有指定笔记本，则为默认笔记本
        // 2. 获得默认笔记本的 id
        User user = userService.get(userId);
        List<String> notebookIds = user.getNotebookIds();
        String defaultNotebookId = notebookIds.get(0);

        // 3. 添加
        note.setNotebookId(defaultNotebookId);

        noteService.create(note);

        String noteId = note.getId();

        return "redirect:/note/" + noteId + "/edit";
    }

    // ajax方式获取笔记内容
    @RequestMapping(value = "/getNoteContent", method = RequestMethod.GET)
    public @ResponseBody Note getNoteContent(@RequestParam String noteId) {

        System.out.println("NoteController: getNoteContent: noteId:" + noteId);

        return noteService.find(noteId);
    }

    @RequestMapping(value = "/updateNoteTitleOrContent", method = RequestMethod.POST)
    public @ResponseBody
    Boolean updateNoteTitleOrContent(@RequestParam String noteId,
                                     @RequestParam String title,
                                     @RequestParam String content) {
        Note note = new Note();
        note.setId(noteId);
        note.setTitle(title);
        note.setContent(content);

        System.out.println("Notecontroller: updateNoteTitleOrContent:" + note);

        noteService.updateContentOrTitle(note);

        return true;
    }


//    @RequestMapping(value = "/{noteId}/edit", method = RequestMethod.GET)
    @RequestMapping(value = "", method = RequestMethod.GET)
    public String editNote(@CookieValue(value = "userId", defaultValue = "") String userId,
//                           @PathVariable String noteId,
                           Model model) {

        // 获得用户所有的 notebook
        List<Notebook> notebooks = notebookService.getNoteBooks(userId);

        // 查找所有的 notes
        List<Note> notes = noteService.findAll(userId);

        System.out.println("NoteController: editNote: notebooks: " + notebooks);

//        取第一个查看, todo: 以后取最后浏览的那个
        model.addAttribute("note", notes.get(0));

        try {
            String notebooksJson = objectMapper.writeValueAsString(notebooks);
            model.addAttribute("notebooks", notebooksJson);

            System.out.println("NoteController: editNote: notebooks(Json): " + notebooks);

            //       查找所有 notes,  todo: 这里肯定要只查询笔记的梗概
            String notesJson = objectMapper.writeValueAsString(notes);
            model.addAttribute("notes", notesJson);

            System.out.println("NoteController: editNote: notes(Json): " + notesJson);
        } catch (IOException e) {
            e.printStackTrace();
        }

//        todo:
        return "/note/editor";
    }

//   todo: 显示用户目录，这个以后当作博客显示吧
//    @RequestMapping(value = "", method = RequestMethod.GET)
    public String userHome(@CookieValue(value = "userId", defaultValue = "") String userId,
                           @RequestParam(value = "category", required = false) String category,

                           Model model) {

        // 如果没有登录
        if (StringUtils.isBlank(userId)) {
            return "redirect:/login";
        }

        //todo: 检查该用户是否存在
        
        User user = userService.get(userId);

        // 获得用户所有的 notebook
        List<Notebook> notebooks = notebookService.getNoteBooks(userId);

        System.out.println("NoteController: userHome: notebooks: " + notebooks);

        List<Note> notes = null;
        if (category == null) {        // 获得其所有的 note
            notes = noteService.findAll(userId);
        } else  {
            //todo: 检查  category 即 title 是否存在

            System.out.println("Note|Controller: userHome: category:" + category);

            String notebookId = notebookService.getNotebookIdByTitle(category);
            System.out.println("Note|Controller: userHome: notebookId:" + notebookId);

            notes = noteService.findByNotebookId(notebookId);
        }


        model.addAttribute("user", user);
        model.addAttribute("notes", notes);
        model.addAttribute("notebooks", notebooks);

        return "/note/show";
    }


    @RequestMapping(value = "/{noteId}", method = RequestMethod.DELETE)
    public @ResponseBody
    Boolean deleteNote(@PathVariable String noteId) {
//        System.out.println(noteId);
//        System.out.println("删除笔记");
        noteService.deleteNote(noteId);

        return true;
    }

    @RequestMapping(value = "/{noteId}/publish", method = RequestMethod.POST)
    public @ResponseBody
    Boolean publish(@PathVariable String noteId) {

        // todo: 暂时只将标记为blog，以后blog要单独存放一个表，可以blog和笔记独立，笔记更新blog

        noteService.updateBlog(noteId, true);

        return true;
    }

    @RequestMapping(value = "/moveNote", method = RequestMethod.POST)
    public @ResponseBody
    Boolean moveNote(@RequestParam String noteId,
                            @RequestParam String notebookId) {

        noteService.moveNote(noteId, notebookId);

        return true;
    }

    // 已博客的形式显示内容
    @RequestMapping(value = "/{noteId}", method = RequestMethod.GET)
    public String showNote(@PathVariable String noteId,
                           Model model) {

        Note note = noteService.find(noteId);

        model.addAttribute("note", note);

        // 查看模式
        model.addAttribute("viewer", true);

        return "/note/view";
    }


}
