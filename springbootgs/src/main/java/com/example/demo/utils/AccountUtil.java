package com.example.demo.utils;

import com.example.demo.entity.Account;
import com.example.demo.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;

/**
 * Created by hzl-coding on 2018/11/16.
 */
@Configuration
public class AccountUtil {
    @Autowired
    RestTemplate restTemplate;

    private String url  = "http://localhost:8093/account/";

    public Object getObject(String method,String userId){
        /*HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("userId",userId);*/
        return this.restTemplate.getForObject(url+method+"/{userId}",Object.class,userId);
    }

    public Object getObject(String method){
        return this.restTemplate.getForObject(url+method,Object.class);
    }

    public Object getObject(Integer id){
        return this.restTemplate.getForObject(url+id,Object.class);
    }

    public Boolean updateObject(String method,Account account){
       /* HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("id",account.getId());
        map.put("name",account.getName());
        map.put("money",account.getMoney());
        map.put("userid",account.getUserId());*/
        return this.restTemplate.postForObject(url+method,account,Boolean.class);
    }

    public Object getObject(String method,String key,int begin,int end){
        HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("key",key);
        map.put("begin",begin);
        map.put("end",end);
        return this.restTemplate.postForObject(url+method,map,Object.class);
    }

    public Boolean setObject(String method, String key, String identify, User user, Long time){
        HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("key",key);
        map.put("identify",identify);
        map.put("user",user);
        map.put("time",time);
        return this.restTemplate.postForObject(url+method,map,Boolean.class);
    }

    public Boolean setObject(String method,String key,List list){
        HashMap<String,Object> map = new HashMap<String, Object>(){};
        map.put("key",key);
        map.put("list",list);
        return this.restTemplate.postForObject(url+method,map,Boolean.class);
    }

    public Boolean delObject(String method,Integer key){
        return this.restTemplate.getForObject(url+method+"/"+key,Boolean.class);
    }
}
