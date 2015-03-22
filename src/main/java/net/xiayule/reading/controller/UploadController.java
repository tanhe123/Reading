package net.xiayule.reading.controller;

import net.xiayule.reading.domain.UploadResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by tan on 15-3-22.
 */
@Controller
@RequestMapping("/upload")
public class UploadController {

    @RequestMapping(value = "/uploadImage", method = RequestMethod.POST)
    public @ResponseBody
    UploadResult uploadImage(@RequestParam(value = "editormd-image-file") MultipartFile image) {

        saveImage(image);

        return new UploadResult(1, "上传成功");
    }

    private void saveImage(MultipartFile image) {
        System.out.println("upload file : filename: " + image.getOriginalFilename());
    }
}
