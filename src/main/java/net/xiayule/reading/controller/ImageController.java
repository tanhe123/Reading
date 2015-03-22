package net.xiayule.reading.controller;

import net.xiayule.reading.domain.UploadResult;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.UUID;

/**
 * Created by tan on 15-3-22.
 */
@Controller
@RequestMapping("/image")
public class ImageController {

    @RequestMapping(value = "", method = RequestMethod.POST)
    public @ResponseBody UploadResult uploadImage(@RequestParam(value = "img") MultipartFile image,
                              Model model) throws IOException {



        System.out.println(image.getContentType());


//        filename
        String contentType = image.getContentType();
        int index = contentType.lastIndexOf("/");
        String filetype = contentType.substring(index + 1);
        String filename = UUID.randomUUID().toString() + "." + filetype;

//        保存图片
        saveImage(filename, image);

        UploadResult uploadResult = new UploadResult(true, filename, "上传成功");

        return uploadResult;
    }


    @RequestMapping(value = "", method = RequestMethod.GET)
    public void downloadImage(@RequestParam(value = "img", required = true) String filename,
                              HttpServletResponse response) {
        byte[] bytes = readImage(filename);

        String fileType = filename.substring(filename.lastIndexOf(".") + 1);

        response.setContentType("image/" + fileType);

        try {
            OutputStream out = response.getOutputStream();
            out.write(bytes);
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    private void saveImage(String filename, MultipartFile image) {
        System.out.println("upload file : filename: " + image.getOriginalFilename());

        File file = new File("/home/tan/tmp/tmpImages/" + filename);

        try {
            image.transferTo(file);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private byte[] readImage(String filename) {
        File file = new File("/home/tan/tmp/tmpImages/" + filename);
        FileInputStream fileInputStream = null;

        try {
            fileInputStream = new FileInputStream(file);
            byte[] bytes = new byte[fileInputStream.available()];
            fileInputStream.read(bytes);
            return bytes;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fileInputStream != null) {
                try {
                    fileInputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return null;
    }
}
