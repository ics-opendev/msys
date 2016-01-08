/**
 * AuthController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

var passport = require('passport'),  
LocalStrategy = require('passport-local').Strategy,  
bcrypt = require('bcrypt');

//helper functions
function findById(id, fn) {
    // findOneならオブジェクトが返ってくるが、findByIdやfindByUsernameを使うとArrayで返ってくるので注意！
    Muser.findOne(id).exec(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

function findByUsername(u, fn) {  
    Muser.findOne({
        //userId: u
        mail: u
    }).exec(function (err, user) {
        if (err) {
            return fn(null, null);
        } else {
            return fn(null, user);
        }
    });
}

// passport コアモジュール 基本動作定義
// コアの処理としてデータシリアライズなどの定義を行う。user.id のみをキーとして持ち回り
passport.serializeUser(function (user, done) {  
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {  
    findById(id, function (err, user) {
        done(err, user);
    });
});

// passport-local サブモジュール ID/Password認証定義
// ログイン処理時に実行される処理を定義。引数として渡された userneme,password を元にUserデータを確認し、
// 必要なデータ(任意のオブジェクト)を、コールバックの引数へ渡す
passport.use(new LocalStrategy(
    function (username, password, done) {
        process.nextTick(function () {

            findByUsername(username, function (err, user) {
                if (err)
                    return done(null, err);
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user ' + username
                    });
                }

                bcrypt.compare(password, user.password, function (err, res) {
                    if (!res)
                        return done(null, false, {
                            message: 'Invalid Password'
                        });
                    var returnUser = {
                        username: user.name,
                        id: user.id
                    };
                    return done(null, returnUser, {
                        message: 'Logged In Successfully'
                    });
                });
            });
        });
    }
));

module.exports = {
    
    // 初期表示処理(msys)
    login: function (req, res) {
    
        // ログイン画面表示
        return res.view();
    },
    
    
    // ログインエラー画面
    error: function (req, res) {
    
        // ログイン画面表示
        return res.view();
    },


    // 認証処理
    process: function (req, res) {
        passport.authenticate('local', function(err, user, info) {

            console.log(info);
                if ((err) || (!user)) {
                    return res.redirect("/auth/error");
                    // return res.send({
                    //     message: 'ユーザーIDかパスワードが間違っています。'
                    // });
                }
                
                // req.body.～で取得するにはnameを付与すること
                var loginplace = req.body.loginplace;
                
                req.logIn(user, function(err) {
                    if (err) res.send(err);
                    // 承認後 /dashboardへ
                    if(loginplace == ''){
                        return res.redirect("/msys/main");
                    }else{
                        // 案件登録画面（スマホ版）へ
                        return res.redirect("/msys/mobile");
                    }
                });

            
        })(req, res);
    },
    
    
    // ログアウト処理(msys)
    logout: function (req, res) {
    
        // ログイン承認解除
        //req.logout;
        req.session.destroy();
        
        //解除後、topページへ
        res.redirect("/login");
    },


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to AuthController)
   */
  _config: {}

  
};
