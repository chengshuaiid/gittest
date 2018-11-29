package com.example.demo.manage;

import com.example.demo.entity.User;
import com.example.demo.model.Session;
import com.example.demo.utils.IdGen;
//import erp.common.security.cache.CacheManager;
import com.example.demo.utils.RedisUtilTest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

/**
 * Session管理类
 * Created by moon on 16/3/6.
 */
@Configuration
public class SessionManager {
    @Autowired
    private RedisUtilTest redisUtilTest;

    private Logger logger = LoggerFactory.getLogger(getClass());
    public static final int sessionTimeout = Integer.parseInt("30000");
    private static final String SESSION_KEK_TOKEN = "UserCache.";
    private static SessionManager instance;
    private static ThreadLocal<String> currentSessionToken = new ThreadLocal<String>();
    //    Timer timer;
    /// <summary>
    /// 调用ThreadTimerCallback的间隔时间，默认10分钟，10min = 600s = 600000ms
    /// </summary>
    private final int CallBackPeriod = 6000;

    //private SessionManager() {
//        timer = new Timer();
//        timer.schedule(new ThreadTimerCallback(),1000, CallBackPeriod);

    //}

//    class ThreadTimerCallback extends TimerTask {
//        public void run() {
//            logger.debug("启动定时清理用户任务{}",new Date());
//        }
//    }

    /**
     * SessionManager对象实例（单例）
     * Created by moon on 16/3/6.
     */
    public static SessionManager getIstance() {
        if (instance == null) {
            synchronized (SessionManager.class) {
                if (instance == null) {
                    instance = new SessionManager();
                }
            }
        }
        return instance;
    }

    /**
     * 设置当前会话的Token
     * Created by moon on 16/3/6.
     */
    public void SetCurrentSessionToken(String token) {
        currentSessionToken.set(token);
    }

    /**
     * 获取当前会话Token
     * Created by moon on 16/3/6.
     */
    public String GetCurrentSessionToken() {
        return currentSessionToken.get();
    }

    /**
     * 获取当前会话用户信息
     * Created by moon on 16/3/6.
     */
    public Session GetCurrentUserSessionInfo() {
        String token = GetCurrentSessionToken();
        return get(token);
    }

    public String add(User user) {
        /*String token = IdGen.uuid();
        session.setToken(token);*/
       String token = user.getUsername();
        new RedisUtilTest().setObject("setObject", SESSION_KEK_TOKEN, token,user,(long)sessionTimeout);
        //CacheManager.getInstance().put(SESSION_KEK_TOKEN + session.getToken(), session, sessionTimeout);
        //CacheManager.getInstance().getCache(USER_CACHE).put(USER_CACHE_LOGIN_NAME + session.getLoginName(), session.getUser());
        return token;
    }

    public void remove(String token) {
        Session session = get(token);
        if (session != null) {
            new RedisUtilTest().delObject("del",SESSION_KEK_TOKEN+token);
        }
    }

    public Session get(String token) {
        Map map = (Map) redisUtilTest.getObject("getObject",SESSION_KEK_TOKEN,token);
        if(map==null){
          return null;
        }
        User user = new User();
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
        Session session = new Session();
        session.setUser(user);
        return session;
    }
}
