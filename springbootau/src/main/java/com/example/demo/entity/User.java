package com.example.demo.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by hzl-coding on 2018/11/9.
 */
@Entity
public class User implements Serializable{

    //@GeneratedValue(strategy = GenerationType.IDENTITY)  数据库实现id自增
    @Id @GeneratedValue(generator="system-uuid")
    @GenericGenerator(name="system-uuid", strategy = "uuid")
    private String id;

    private String username;
    private String password;
    private Integer sex;

    @Column(name = "createtime")
    private Date createTime;

    @Column(name = "lastlogintime")
    private Date lastLogInTime;

    public User() {
        super();
    }

    public User(String id,String username, String password, Integer sex, Date createTime, Date lastLogInTime) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.sex = sex;
        this.createTime = createTime;
        this.lastLogInTime = lastLogInTime;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public void setLastLogInTime(Date lastLogInTime) {
        this.lastLogInTime = lastLogInTime;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public Integer getSex() {
        return sex;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public Date getLastLogInTime() {
        return lastLogInTime;
    }
}
