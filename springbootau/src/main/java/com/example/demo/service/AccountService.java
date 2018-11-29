package com.example.demo.service;

import com.example.demo.dao.AccountDAO;
import com.example.demo.entity.Account;
import com.example.demo.entity.Account;
import com.example.demo.utils.RedisUtilTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by hzl-coding on 2018/11/9.
 */
@Service
public class AccountService {

    @Autowired
    private RedisUtilTest redisUtilTest;

    @Autowired
    AccountDAO accountDao;


    //@Cacheable(value = "AccountCache",key = "'acc.getAccountList'" )
    public List getAccList(){
        List result = (List) redisUtilTest.getObject("getList","AccAllCache",0,-1);
        if(result.size()!=0){
            return result;
        }else{
            List<Account> accList = accountDao.findAll();
            redisUtilTest.setObject("setList","AccAllCache",accList);
            return accList;
        }
    }

    //@Cacheable(value = "AccountOneCache",key = "'acc.getAccountOne'" )
    public Account getAccOne(Integer id){
/*        List result = redisUtil.lGet("AccountCache",0,-1);
        int tempResult = 0;
        if(result !=null){
            for(int i=0;i<result.size();i++){
                System.out.println(result.get(i).toString());
                Account acc = (Account) result.get(i);
                if(id.equals(acc.getId())){
                    tempResult = 1;
                    return acc;
                }
            }
        }
        if(tempResult == 0){
            Account acc = accountDao.findById(id).get();
            redisUtil.set("AccountOneCache", acc);
            return acc;
        }
        return null;*/
        return accountDao.findById(id).get();
    }

    public List getAccount(String userId){
        List accList = (List) redisUtilTest.getObject("getList","AccountCache."+userId,0,-1);
        if(accList.size()==0) {
            accList = accountDao.findByUserid(userId);
            //redisUtilTest.setObject("setList", "AccountCache." + userId, accList);
        }
        return accList;
    }


    @Transactional
    public Account insertAccount(Account account){
        Account acc = accountDao.saveAndFlush(account);
        if(acc!=null){
            redisUtilTest.delObject("del","AccAllCache");
        }
        return acc;
    }

    @Transactional
    public Boolean accountUpdate(Account account){
        Account acc = accountDao.saveAndFlush(account);
        if(acc!=null){
            redisUtilTest.delObject("del","AccAllCache");
            return true;
        }
        return false;
    }

    @Transactional
    public Boolean deleteAccount(Integer id){
        /*Account acc = new Account();
        acc.setId(id);*/
        try {
            accountDao.deleteById(id);
            redisUtilTest.delObject("del","AccAllCache");
            //redisUtilTest.setObject("setList", "AccountCache." + userId, accList);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }

}
