/******
 * ms.login.js
 * ログイン画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  
  _wt.initLogin = function(){
    console.log('initLogin() called.');
    
    _wt.initMasterModals();
    
    // cookieの取得
    var _u_id = $.cookie( "UID" );
    var _pass = $.cookie( "UPAS" );
    
    if(_u_id != undefined){
      $('#username').val(_u_id);
    }
    if(_pass != undefined){
      $('#password').val(_pass);
    }
    
    // 端末によってログイン先を判断
    var ua = navigator.userAgent;
    if((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1)){
      // Androidタブレットは本来ここになるが、機種によってはスマホ扱いとなってしまうため、画面サイズで判断
      $('#loginplace').val('');
    }else if ((ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0)){
      var w = $(window).width();
      var x = 600;
      if(w < x){
          $('#loginplace').val('1');
      } else {
          $('#loginplace').val('');
      }
      
    }else if (ua.indexOf('iPhone') > 0){
      $('#loginplace').val('1');
      
    }else if (ua.indexOf('iPad') > 0){
      $('#loginplace').val('');
      
    }else if (ua.indexOf('iPod') > 0){
      $('#loginplace').val('1');
      
    }else{
      $('#loginplace').val('');
    }
    
    // ログインボタン（btn_submitだったもの）
    $('#second').unbind();
    $('#second').bind('click',function(e){
      if(!_wt.isBlankCheck($('#username'),'ログインID')){return false;}
      if(!_wt.isBlankCheck($('#password'),'パスワード')){return false;}
      if($('#loginsave').val() == '1'){
        $.cookie("UID", $('#username').val(), { expires: 90 });
        $.cookie("UPAS", $('#password').val(), { expires: 90 });
      }
      document.forms[0].submit();
    });
    
    // ログイン情報を保持
    $('#c_loginsave').unbind();
    $('#c_loginsave').bind('click',function(e){
      $('#loginsave').val('1');
    });
    
    // 問い合わせフォームを表示
    $('#btn_forget').unbind();
    $('#btn_forget').bind('click',function(e){
      $('#loginform').css('display', 'none');
      $('#mail').val('');
      $('#date').val('');
      $('#forgetform').css('display', '');
    });
    
    // 元のフォームに戻る
    $('#btn_back').unbind();
    $('#btn_back').bind('click',function(e){
      $('#loginform').css('display', '');
      $('#forgetform').css('display', 'none');
      $('#contactform').css('display', 'none');
    });
    
    // 再設定画面へ
    $('#btn_contact').unbind();
    $('#btn_contact').bind('click',function(e){
      if(!_wt.isBlankCheck($('#mail'),'登録メールアドレス')){return false;}
      if(!_wt.isBlankCheck($('#date'),'認証用年月日')){return false;}
      _wt.isMuserCheck();
    });
  };
  
  //
  //initialize modals for presence
  //
  _wt.initMasterModals = function(){
    _wt.getHtmlSimple(_wt.htmlLoader.urlBase + '/top-pane-floor/modal/modal-member-password.html', function(res){
      $('body').append(res);
    });
  };
  
  // 最終ログイン日登録チェック
  _wt.loginSave = function(){
    console.log('loginSave called.');
    _wt.loginCheckSave();
  };

//////exports
  if('undefined' == typeof module){
    if( !window.ms ){window.ms = {};}
      window.ms.login = _wt;
  } else {
    module.exports = _wt;
  }
})();