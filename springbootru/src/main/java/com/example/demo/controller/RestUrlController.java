package com.example.demo.controller;

import com.example.demo.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

/**
 * Created by hzl-coding on 2018/11/13.
 */
@RestController
public class RestUrlController {

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/template/{id}")
    public User findById(@PathVariable Long id) {
        User u = this.restTemplate.getForObject("http://localhost:8091/user/" + id,User.class);
        //System.out.println(u);
        return u;
    }

}
