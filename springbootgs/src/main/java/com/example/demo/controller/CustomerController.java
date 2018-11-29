package com.example.demo.controller;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by hzl-coding on 2018/11/12.
 */
@RestController
public class CustomerController {
    /**
     * 消息监听者
     */
    @JmsListener(destination = "active.queue")
    public void readActiveQueue(String message){
        System.out.println("接收到的消息："+message);
    }
}
