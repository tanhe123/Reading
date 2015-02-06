package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.Note;
import net.xiayule.reading.db.model.Notebook;
import net.xiayule.reading.db.model.User;
import net.xiayule.reading.db.service.NotebookService;
import net.xiayule.reading.db.service.NoteService;
import net.xiayule.reading.db.service.UserService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public String newNote(@CookieValue(value = "userId", defaultValue = "") String userId,
                          Model model) {

        Note note = new Note();
        note.setTitle("new note");
        note.setUserId(userId);
        note.setContent("new note");

        noteService.create(note);

//        System.out.println("NoteController: newNote: noteId:" + note.getId());

//        model.addAttribute(note);

        String noteId = note.getId();

        return "redirect:/note/" + noteId + "/edit";
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public @ResponseBody
    Note createNote(@RequestParam String title,
                    @RequestParam String content) {

//        System.out.println(username);

        Note note = new Note();
        note.setTitle(title);
        note.setContent(content);
        //todo: noteOwener
        note.setUserId("1");
        //todo: version id
        note.setVersionId(1);

        return note;
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


    @RequestMapping(value = "/{noteId}/edit", method = RequestMethod.GET)
    public String editNote(@CookieValue(value = "userId", defaultValue = "") String userId,
                           @PathVariable String noteId,
                           Model model) {

//        System.out.println("NoteController: editNote: username" + username + " noteid:" + noteId);

//        String ownerId = userService.findUserIdByUsername(username);

        // 获得用户所有的 notebook
        List<Notebook> notebooks = notebookService.getNoteBooks(userId);

        // 查找 note
        Note note = noteService.find( noteId);

        System.out.println("NoteController: editNote: notebooks: " + notebooks);

        model.addAttribute("note", note);
        model.addAttribute("notebooks", notebooks);

        return "/note/edit";
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String userHome(@CookieValue(value = "userId", defaultValue = "") String userId,
                           Model model) {

        // 如果没有登录
        if (StringUtils.isBlank(userId)) {
            return "redirect:/login";
        }
        
        // 获得 id
//        String userId = userService.findUserIdByUsername(username);

//        System.out.println("NoteController: showAllnote: userId:" + userId);
        
        //todo: 检查该用户是否存在
        
        User user = userService.get(userId);

        // 获得用户所有的 notebook
        List<Notebook> notebooks = notebookService.getNoteBooks(userId);

        System.out.println("NoteController: userHome: notebooks: " + notebooks);

        // 获得其所有的 note
        List<Note> notes = noteService.findByOwner(userId);

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
