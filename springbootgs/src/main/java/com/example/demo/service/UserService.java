package com.example.demo.service;

import com.example.demo.dao.UserDAO;
import com.example.demo.entity.User;
import com.example.demo.manage.SessionManager;
import com.example.demo.model.Session;
import com.example.demo.utils.Digests;
import com.example.demo.utils.Encodes;
import com.example.demo.utils.RedisUtilTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by hzl-coding on 2018/11/9.
 */
@Service
public class UserService {

    public static final String HASH_ALGORITHM = "SHA-1";
    public static final int HASH_INTERATIONS = 1024;
    public static final int SALT_SIZE = 8;

    @Autowired
    private RedisUtilTest redisUtilTest;

    @Autowired
    private SessionManager sessionManager;

    @Autowired
    UserDAO userDao;


    //@Cacheable(value = "UserCache",key = "'user.getUserList'" )
    public List getUserList(){

        List result = (List) redisUtilTest.getObject("getList","User.all",0,-1);
        if(result.size()!=0){
            return result;
        }else{
            List<User> userList = userDao.findAll();
            redisUtilTest.setObject("setList","User.all",userList);
            return userList;
        }
    }

    //@Cacheable(value = "UserOneCache",key = "'user.getUserOne'" )
    public User getUserOne(String id){
//        List result = redisUtil.lGet("UserCache",0,-1);
//        int tempResult = 0;
//        if(result !=null){
//            for(int i=0;i<result.size();i++){
//                System.out.println(result.get(i).toString());
//                User user = (User) result.get(i);
//                if(id.equals(user.getId())){
//                    tempResult = 1;
//                    return user;
//                }
//            }
//        }
//        if(tempResult == 0){
//            User user = userDao.findById(id).get();
//            redisUtil.set("UserOneCache", user);
//            return user;
//        }
//        return null;
        return userDao.findById(id).get();
    }

    public Session getSession(String username , String password){

        Map map = (Map) redisUtilTest.getObject("getObject","UserCache.",username);
        User user = null;
        Session session = null;
        if(map!=null){
            user = new User();
            user.setId((String) map.get("id"));
            user.setUsername((String) map.get("username"));
            user.setPassword((String) map.get("password"));
            user.setSex((int) map.get("sex"));
            try {
                String createTime = (String) map.get("createTime");
                String lastLogInTime = (String) map.get("lastLogInTime");
                user.setCreateTime((new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(createTime.substring(0,createTime.indexOf(".")).replace("T"," ")));
                user.setLastLogInTime((new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")).parse(lastLogInTime.substring(0,lastLogInTime.indexOf(".")).replace("T"," ")));
            } catch (ParseException e) {
                e.printStackTrace();
            }

        }

        if(user!=null){
            if(username.equals(user.getUsername()) && validatePassword(password,user.getPassword())){
                String token = user.getUsername();
                session = new Session();
                session.setToken(token);
                user.setPassword(password);
                session.setUser(user);
                return session;
            }
        }else{
            user = userDao.findByUsername(username);
            //System.out.println("wwwwwwwwwww"+password+" qqqqqqqqq"+user.getPassword());
            if(user!=null && validatePassword(password,user.getPassword())){
                String token = user.getUsername();
                session = new Session();
                session.setToken(token);
                session.setUser(user);
                redisUtilTest.setObject("setObject","UserCache.",username,user, (long) (7*24*60*60));
                user.setPassword(password);
            }
            return session;
        }
        return null;
    }


    @Transactional
    public User insertUser(User user){
        //tring plainPassword = user.getPassword();
        user.setPassword(entryptPassword(user.getPassword()));
        //System.out.println("用户密文密码————————"+user.getPassword());
        user.setCreateTime(new Date());
        user.setLastLogInTime(new Date());
        User userX = userDao.saveAndFlush(user);
        if(userX!=null){
            //userX.setPassword(plainPassword);
            redisUtilTest.delObject("del","User.all");
        }
        return userX;
    }

    @Transactional
    public User findUserByName(String username){
        return userDao.findTop1ByUsername(username);
    }

    @Transactional
    public Integer deleteUser(String id){
        User user = new User();
        user.setId(id);
        try {
            userDao.delete(user);
            redisUtilTest.delObject("del","User.all");
            return 1;
        }catch (Exception e){
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * 验证密码
     *
     * @param plainPassword 明文密码
     * @param password      密文密码
     * @return 验证成功返回true
     */
    public static boolean validatePassword(String plainPassword, String password) {
        byte[] salt = Encodes.decodeHex(password.substring(0, 16));
        byte[] hashPassword = Digests.sha1(plainPassword.getBytes(), salt, HASH_INTERATIONS);
        return password.equals(Encodes.encodeHex(salt) + Encodes.encodeHex(hashPassword));
    }

    /**
     * 生成密文密码
     *
     * @param plainPassword
     * @return
     */
    private String entryptPassword(String plainPassword){
        byte[] salt = Digests.generateSalt(SALT_SIZE);
        byte[] hashPassword = Digests.sha1(plainPassword.getBytes(), salt, HASH_INTERATIONS);
        return Encodes.encodeHex(salt) + Encodes.encodeHex(hashPassword);
    }


    public User findUserCondition(String username){
        return userDao.findByUsername(username);
    }
}
