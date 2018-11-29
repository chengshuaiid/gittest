package com.example.demo.dao;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * Created by hzl-coding on 2018/11/9.
 */
public interface UserDAO extends JpaRepository<User, String> {
    User findByUsername(String username);

    User findTop1ByUsername(String username);

    User findByUsernameAndPassword(String username, String password);
}
