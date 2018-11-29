package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.jms.Queue;

/**
 * Created by hzl-coding on 2018/11/12.
 */
@RestController
@RequestMapping("/queue/")
public class QueueController {

    @Autowired
    private JmsMessagingTemplate jmsMessagingTemplate;
    @Autowired
    private Queue queue;

    @GetMapping("send")
    public void send() {
        this.jmsMessagingTemplate.convertAndSend(this.queue,"新发送的消息！");
    }
}
