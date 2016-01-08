/******
 * ms.entry.js
 * ユーザー登録画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  
  _wt.initEntry = function(){
    console.log('initEntry() called.');
    
    // urlからパラメータを取得
    var url = location.href;
    
    // 「?」で分割「&」でも分割
    var params = url.split("?");
    var paramms = [];
    if(params[1] != undefined){
      paramms = params[1].split("&");
    }
    
    // パラメータ用の配列を用意
    var paramArray = [];
    
    // 配列にパラメータを格納
    for(var i=0; i<paramms.length; i++){
      var neet = paramms[i].split("=");
      paramArray.push(neet[0]);
      paramArray[neet[0]] = neet[1];
    }
    
    if(paramArray["companyId"] != undefined){
      KsWidgetTmpl.prototype.companyId = paramArray["companyId"];
      
      // 取得した企業Idから企業名を表示
      _wt.findMcompanytoId(KsWidgetTmpl.prototype.companyId,function(res){
        $('#companyName').text(res[0].companyName);
      });
    }
    
    // ユーザー登録
    $('#sign-up-button').unbind();
    $('#sign-up-button').bind('click',function(e){
      // 項目チェック
      if(KsWidgetTmpl.prototype.companyId == ''){
        alert('存在しない企業で登録しようとしています。URLをもう1度お確かめください。');
        return false;
      }
      // 入力チェック
      if($('#master-user-id').val() == ''){
        if(!_wt.isBlankCheck($('#master-user-password'),'パスワード')){return;}
        if($('#master-user-password').val() != $('#master-user-password-se').val()){
          alert('パスワードの入力内容が異なっています。');
          $('#master-user-password-se').focus();
          return;
        }
        if($('#master-user-mail').val() != $('#master-user-mail-se').val()){
          alert('メールアドレスの入力内容が異なっています。');
          $('#master-user-mail-se').focus();
          return;
        }
      }
      if(!_wt.isBlankCheck($('#master-user-name'),'お名前')){return;}
      // if(!_wt.isBlankCheck($('#postcode'),'オフィス〒')){return;}
      // if(!_wt.isBlankCheck($('#address4'),'番地以下')){return;}
      if(!_wt.isBlankCheck($('#master-user-mail'),'メールアドレス')){return;}
      if(!_wt.isBlankCheck($('#master-user-date'),'認証用年月日')){return;}
      _wt.isMailCheck($('#master-user-mail'),function(mail){
        if(mail[0] != undefined){
          alert('このメールアドレスのユーザーは既に登録されています。');
          return;
          
        } else {
          if(!confirm("上記の状態でユーザー情報を登録します。よろしいですか？")){
            return false;
          }
          _wt.createUser();
        }
      });
    });
    
    // ログイン画面へ
    $('#master-user-move').unbind();
    $('#master-user-move').bind('click',function(e){
      location.href = "/login";
    });
  };
  
//////exports
  if('undefined' == typeof module){
    if( !window.ms ){window.ms = {};}
      window.ms.entry = _wt;
  } else {
    module.exports = _wt;
  }
})();