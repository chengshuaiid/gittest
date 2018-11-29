package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.*;

/**
 * Created by hzl-coding on 2018/11/14.
 */
@RestController
public class FileDownLoadController {
    @RequestMapping("/download")
    public String downLoad(HttpServletResponse response, @RequestParam("name") String filename){
//        String filename="2.jpg";
        String filePath = "C:/uploadtest" ;
        File file = new File(filePath + "/" + filename);
        /**
         * 判断文件父目录是否存在
         */
        if(file.exists()){
            response.setContentType("application/force-download");
            response.setHeader("Content-Disposition", "attachment;fileName=" + filename);

            /**
             * 文件输入流
             */
            byte[] buffer = new byte[1024];
            FileInputStream fis = null;
            BufferedInputStream bis = null;

            /**
             * 输出流
             */
            OutputStream os = null;
            try {
                os = response.getOutputStream();
                fis = new FileInputStream(file);
                bis = new BufferedInputStream(fis);
                int i = bis.read(buffer);
                while(i != -1){
                    os.write(buffer);
                    i = bis.read(buffer);
                }

            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
            System.out.println("----------file download: " + filename);
            try {
                bis.close();
                fis.close();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return null;
    }
}
