package com.example.demo.dao;

import com.example.demo.entity.Account;
import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by hzl-coding on 2018/11/9.
 */
public interface AccountDAO extends JpaRepository<Account, Integer> {
        List findByUserid(String userid);

        //Boolean updateAccount(@Param(value= "account") Account account);

}
