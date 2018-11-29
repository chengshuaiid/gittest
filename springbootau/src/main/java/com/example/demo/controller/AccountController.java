package com.example.demo.controller;

import com.example.demo.entity.Account;
import com.example.demo.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by hzl-coding on 2018/11/9.
 */
@RestController
@RequestMapping("/account/")
public class AccountController {
    @Autowired
    private AccountService accountService;

    @GetMapping("test")
    public String test(){
        return "test";
    }

    @GetMapping("acclist")
    public List<Object> accList(){
        return accountService.getAccList();
    }

    @GetMapping("accOfUser/{userId}")
    public List accOfUser(@PathVariable("userId") String userId){
        List accList = accountService.getAccount(userId);
        return accList;
    }

    @GetMapping("{id}")
    public Account findAccById(@PathVariable("id") Integer id){
        Account acc = accountService.getAccOne(id);
        return acc;
    }

    @PostMapping("accAdd")
    public Account accAdd(@RequestBody Map<String,Object> map){
        Account acc = new Account();
        acc.setName((String)map.get("name"));
        acc.setMoney((double) map.get("money"));
        acc.setUserId((String)map.get("userId"));

        return accountService.insertAccount(acc);
    }

    @PostMapping("accUpdate")
    public Boolean accUpdate(@RequestBody Account acc){
        /*Account acc = new Account();

        acc.setId((Integer) map.get("id"));
        acc.setName((String)map.get("name"));
        acc.setMoney((double) map.get("money"));
        acc.setUserId((String)map.get("userid"));*/

        return accountService.accountUpdate(acc);
    }

    @GetMapping("delete/{id}")
    public Boolean delete(@PathVariable("id") Integer id){
        return accountService.deleteAccount(id);
    }
    
}
