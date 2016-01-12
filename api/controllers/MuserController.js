/**
 * MuserController
 *
 * @description :: Server-side logic for managing musers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var nodemailer = require("nodemailer");

// SMTPコネクションプールを作成(Gmail)
var smtpTransport = nodemailer.createTransport("SMTP", {
    // SMTPサーバーを使う場合
    host: 'smtp.office365.com',
    secure: true,
    tls: { rejectUnauthorized: false },
    port: '587',
    auth: {
        user: 'Taskalquery@icsoft.co.jp',
        pass: '1183Icsoftincaa'
    }
    
    // Webサービスを使う場合
    // service: "Gmail",
    // auth: {
    //     user: "narabannaa@gmail.com",
    //     pass: "narabanna"
    // }
    
});

module.exports = {
	// メール送信
	sendMailTest: function (req,res) {
        // unicode文字でメールを送信
        // TODO:ローカルでテストする場合は上のURLを使用すること
        //var _url = 'https://nsys2-icmurase.c9.io/login';
        var _url = 'https://msys.herokuapp.com/login';
        var _text = 'Taskalアンケート　ユーザー登録が完了いたしました。\n以下のURLからログインしてください。\n' + _url;
        var _mail = req.param('mail');
        var mailOptions = {
            //from: "自動試算システム <narabannaa@gmail.com>", // sender address
            from: "Taskalアンケート <Taskalquery@icsoft.co.jp>", // sender address
            to: _mail, // list of receivers
            subject: "Taskalアンケート　ユーザー登録のお知らせ", // Subject line
            text: _text // plaintext body
        };
	    
	    // 先ほど宣言したトランスポートオブジェクトでメールを送信
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
            res.json( { user: response } );
            // 他の送信処理はなければ、下記のコメントを解除して、トランスポートオブジェクトをクローズしてください。
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
	},
	
	// メール送信
	sendMailToUser: function (req,res) {
        // unicode文字でメールを送信
        var _text = req.param('mail');
        var _mail = req.param('address');
        var _title = req.param('title');
        var mailOptions = {
            //from: "自動試算システム <narabannaa@gmail.com>", // sender address
            from: "Taskalアンケート <Taskalquery@icsoft.co.jp>", // sender address
            to: _mail, // list of receivers
            subject: _title, // Subject line
            text: _text // plaintext body
        };
	    
	    // 先ほど宣言したトランスポートオブジェクトでメールを送信
        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
            res.json( { user: response } );
            // 他の送信処理はなければ、下記のコメントを解除して、トランスポートオブジェクトをクローズしてください。
            //smtpTransport.close(); // shut down the connection pool, no more messages
        });
	}
};

