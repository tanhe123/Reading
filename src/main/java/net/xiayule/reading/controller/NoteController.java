package net.xiayule.reading.controller;

import net.xiayule.reading.db.model.Note;
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

    @RequestMapping(value = "/new", method = RequestMethod.GET)
    public String newNote() {

//        System.out.println(username);

        return "/note/new";
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
        note.setOwnerId("1");
        //todo: version id
        note.setVersionId(1);

        return note;
    }

    @RequestMapping(value = "/{noteId}", method = RequestMethod.GET)
    public String showNote(@PathVariable String noteId,
                           Model model) {

//        System.out.println(username + " " + noteId);

//        String ownerId = userService.findUserIdByUsername(username);

//        System.out.println("ownerId: " + ownerId);

        Note note = noteService.find(noteId);

//        System.out.println(note);

        model.addAttribute("note", note);

        return "/note/view";
    }

    @RequestMapping(value = "/getNoteContent", method = RequestMethod.GET)
    public @ResponseBody Note getNoteContent(@RequestParam String noteId) {

        System.out.println("NoteController: getNoteContent: noteId:" + noteId);

        return noteService.find(noteId);
    }

    @RequestMapping(value = "/{noteId}/edit", method = RequestMethod.GET)
    public String editNote(@PathVariable String noteId,
                           Model model) {

//        System.out.println("NoteController: editNote: username" + username + " noteid:" + noteId);

//        String ownerId = userService.findUserIdByUsername(username);

        Note note = noteService.find( noteId);

        model.addAttribute("note", note);

        return "/note/edit";
    }

    @RequestMapping(value = "", method = RequestMethod.GET)
    public String showAllNote(@CookieValue(value = "userId", defaultValue = "") String userId,
                              Model model) {

        // 如果没有登录
        if (StringUtils.isBlank(userId)) {
            return "redirect:/login";
        }
        
        // 获得 id
//        String userId = userService.findUserIdByUsername(username);

//        System.out.println("NoteController: showAllnote: userId:" + userId);

        // 获得其所有的 note
        List<Note> notes = noteService.findByOwner(userId);

        System.out.println("NoteController: showAllNote: " + notes);

        model.addAttribute("notes", notes);

        return "/note/show";
    }

/*    public String updateNote() {

    }*/

    @RequestMapping(value = "/delete", method = RequestMethod.GET)
    public String deleteNote(@RequestParam Integer id) {

        //todo: 删除

        return "redirect:/note";
    }
}
