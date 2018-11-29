package com.example.demo.service;

import com.example.demo.entity.Account;
import com.example.demo.utils.AccountUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by hzl-coding on 2018/11/16.
 */
@Service
public class AccountService {
    @Autowired
    AccountUtil accountUtil;

    public List findAccount(String userId){
        String method = "accOfUser";
        return (List)accountUtil.getObject(method,userId);
    }

    public List findAccountAll(){
        String method = "acclist";
        return (List)accountUtil.getObject(method);
    }

    public Account findAccountById(Integer id){
        Map map = (Map)accountUtil.getObject(id);
        Account account = new Account();
        account.setId((Integer)map.get("id"));
        account.setName((String)map.get("name"));
        account.setMoney((double)map.get("money"));
        account.setUserId((String)map.get("userId"));
        return account;
    }

    public Boolean update(Account account){
        return accountUtil.updateObject("accUpdate",account);
    }

    public Boolean deleteAccount(Integer id){
        return accountUtil.delObject("delete",id);
    }
}
