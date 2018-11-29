package com.example.demo.utils;

import com.example.demo.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by hzl-coding on 2018/11/15.
 */
@Configuration
public class RedisUtilTest {

    @Autowired
    RestTemplate restTemplate;

    private String url  = "http://localhost:8092/redis/";

    public Object getObject(String method,String key,String identify){
        HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("key",key);
        map.put("identify",identify);
        return this.restTemplate.postForObject(url+method,map,Object.class);
    }

    public Object getObject(String method,String key,int begin,int end){
        HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("key",key);
        map.put("begin",begin);
        map.put("end",end);
        return this.restTemplate.postForObject(url+method,map,Object.class);
    }

    public Boolean setObject(String method, String key, String identify, Object obj, Long time){
        HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("key",key);
        map.put("identify",identify);
        map.put("obj",obj);
        map.put("time",time);
        return this.restTemplate.postForObject(url+method,map,Boolean.class);
    }

    public Boolean setObject(String method,String key,List list){
        HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("key",key);
        map.put("list",list);
        return this.restTemplate.postForObject(url+method,map,Boolean.class);
    }

    public Boolean delObject(String method,String key){
        return this.restTemplate.getForObject(url+method+"/"+key,Boolean.class);
    }

}
