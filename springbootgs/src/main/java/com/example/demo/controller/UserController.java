package com.example.demo.controller;

import com.example.demo.annotation.AuthPassport;
import com.example.demo.entity.Account;
import com.example.demo.entity.User;
import com.example.demo.model.Session;
import com.example.demo.service.AccountService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpSession;
import java.util.Date;
import java.util.List;

/**
 * Created by hzl-coding on 2018/11/9.
 */
@Controller
@RequestMapping("/user/")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AccountService accountService;

    @GetMapping("webIn")
    public String webIn(){
        return "login";
    }

    @GetMapping("webReg")
    public String webReg(){
        return "register";
    }

    /*@PostMapping("accUpdata")
    public String accUpdata(){
        return "account";
    }*/

    @AuthPassport //表示当前方法需要拦截器loginInteceptor要拦截访问该方法的路径
    @RequestMapping("userlist")
    @ResponseBody
    public List<Object> userList(){
        return userService.getUserList();
    }

    @RequestMapping("login")
    @ResponseBody
    public Session login(@RequestBody User user){
        Session session = userService.getSession(user.getUsername(),user.getPassword());
        if(session!=null){
            return session;
        }
        return null;
    }

    @GetMapping("testLogin")
    @ResponseBody
    public User testLogin(User user){
        return user;
    }

    @GetMapping("usersimple/{id}")
    @ResponseBody
    public User userSimple(@PathVariable("id") String id){
        return userService.getUserOne(id);
    }

    @PostMapping("findUserByName")
    @ResponseBody
    public User findUserByName(@RequestBody User user){
        return userService.findUserByName(user.getUsername());
    }

    @AuthPassport
    @PostMapping("deleteUser/{id}")
    @ResponseBody
    public Boolean deleteUser(@PathVariable("id") String id){
        return userService.deleteUser(id) == 1 ? true : false;
    }

    @PostMapping("userAdd")
    @ResponseBody
    public User userAdd(@RequestBody User user){
        user.setCreateTime(new Date());
        user.setLastLogInTime(new Date());
        return userService.insertUser(user);
    }

    @GetMapping("findUserCondition/{name}")
    @ResponseBody
    public User findUserCondition(@PathVariable("name") String name){
        return userService.findUserCondition(name);
    }

    @PostMapping("findUserAccount/{userId}")
    @ResponseBody
    public List findUserAccount(@PathVariable("userId") String userId){
        return accountService.findAccount(userId);
    }

    @AuthPassport
    @PostMapping("findAllAccount")
    @ResponseBody
    public List findAllAccount(){
        return accountService.findAccountAll();
    }

    @GetMapping("findOneAccount/{id}")
    @ResponseBody
    public Account findOneAccount(@PathVariable("id") Integer id){
        return accountService.findAccountById(id);
    }

    @AuthPassport
    @PostMapping("deleteAccount/{id}")
    @ResponseBody
    public Boolean deleteAccount(@PathVariable("id") Integer id){
        return accountService.deleteAccount(id);
    }

    /*@AuthPassport*/
    @GetMapping("updateFindAccount/{id}")
    public ModelAndView updataFindAccount(@PathVariable("id") Integer id, Model model){
        Account account = accountService.findAccountById(id);
        model.addAttribute("account",account);
        return new ModelAndView("account","model",model);
    }

    //@AuthPassport
    @PostMapping("updateAccount")
    @ResponseBody
    public Boolean updateAccount(@RequestBody Account account){
        return accountService.update(account);
    }
}
