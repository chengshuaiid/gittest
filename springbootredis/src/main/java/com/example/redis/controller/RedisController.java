package com.example.redis.controller;

import com.example.redis.Entity.User;
import com.example.redis.Utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Created by hzl-coding on 2018/11/15.
 */
@RestController
@RequestMapping("/redis/")
public class RedisController {
    @Autowired
    RedisUtil redisUtil;

    @PostMapping("setList")
    public Boolean setList(@RequestBody Map<String, Object> map){
        return redisUtil.lSet((String) map.get("key"),(List) map.get("list"));
    }

    @PostMapping("getList")
    public List getList(@RequestBody Map<String, Object> map){
        return redisUtil.lGet((String) map.get("key"),(int) map.get("begin"),(int) map.get("end"));
    }

    @PostMapping("setObject")
    public Boolean setUserOne(@RequestBody Map<String, Object> map){
        return redisUtil.set((String) map.get("key") + (String) map.get("identify"),map.get("obj"),(int) map.get("time"));
    }

    @PostMapping("getObject")
    public Object getUserOne(@RequestBody Map<String, Object> map){
        return redisUtil.get((String) map.get("key") + (String) map.get("identify"));
    }

    @GetMapping("del/{key}")
    public Boolean del(@PathVariable String key){
        try {
            redisUtil.del(key);
            return true;
        }catch (Exception e){
            e.printStackTrace();
        }
        return false;
    }
}
