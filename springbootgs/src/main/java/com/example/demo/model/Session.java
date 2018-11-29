package com.example.demo.model;
import com.example.demo.entity.User;

import java.io.Serializable;
import java.util.List;

/**
 * Created by moon on 16/3/6.
 */
public class Session implements Serializable {


    private String token;
    private User user;
    /*private List<Permission> permissions;*/

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    /*public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }*/
}