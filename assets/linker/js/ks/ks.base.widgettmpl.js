/**
 * 表示ウィジェットprototype
 * KsWidgetTmpl
 * ks.cast,ks.seatsなどの表示共通の処理や属性をまとめている
 */
(function(window,undefined) {
  function KsWidgetTmpl(){
    //prototype宣言
    var _proto = KsWidgetTmpl.prototype;
    //属性
    _proto.ddui = new KsDragUi(); //UIアタッチ ks.base.dragUI.js
    _proto.cache = new KsHtmlCache(); //ks.base.htmlcache.js

    _proto._html = {}; //読み込みHTML用。継承先でそれぞれに初期化
    _proto.htmlLoader = {
      urlBase: '/panel'
    };

//-----public functions
    //外部HTML読み込み＊シンプルバージョン
    _proto.getHtmlSimple = function( url, cb ){
      $("<div>").load(url, function(res){
        //console.log(url," loaded. ",res);
        cb(res);
      });
    };

    //外部HTML読み込み＊キャッシュバージョン
    _proto.fromHtml = function( p, cb ){
      if( p.loaded ){cb(p.obj.clone(),p); }else{ 
        console.log('Loading... ', p.url );
        $("<div>").load(p.url, function(res){
          p.obj = $(res);
          setTimeout(function(){if($(p.obj).size == 0){ setTimeout( arguments.callee, 100 ); }else{p.loaded = true;cb(p.obj.clone(),p);}},100);
        });
      }
    };
    
    // msys
    _proto.companyId = '';
    _proto.userId = '';
    _proto.firstLoad_main = false;
    
    _proto.allCustomerId = 'all_customer';
    _proto.allMobileCustomerId = 'mobile_all_customer';
    _proto.firstLoad_customer = false;
    _proto.firstLoad_mobile = false;
    
    _proto._answer1 = "";
    _proto._answer2 = "";
    _proto._answer3 = "";
    _proto._answer4 = "";
    _proto._answer5 = "";
    _proto._quantity1 = 0;
    _proto._quantity2 = 0;
    _proto._quantity3 = 0;
    _proto._quantity4 = 0;
    _proto._quantity5 = 0;
    _proto._price1 = 0;
    _proto._price2 = 0;
    _proto._price3 = 0;
    _proto._price4 = 0;
    _proto._price5 = 0;
    _proto._subTotal = 0;
    
    _proto.findCustomerDivByCid = function(cid){
      return $( '#' + this.allCustomerId ).find( '#' + 'cid-' + cid );
    };
    
    _proto.findMobileCustomerDivByCid = function(cid){
      return $( '#' + this.allMobileCustomerId ).find( '#' + 'cid-' + cid );
    };
    
    // 使用者マスタ検索
    _proto.findMuser = function(cb){
      io.socket.get('/muser', {
        companyId: _proto.companyId,
        userId: _proto.userId
      }, cb);
    };
    
    _proto.isMailCheck = function(obj,cb){
      io.socket.get('/muser', {
        mail: obj.val()
      }, cb);
    };
    
    // 使用者マスタ検索（ユーザーID検索条件）
    _proto.findProjectMuser = function(_userId,cb){
      io.socket.get('/muser', {
        userId: _userId
      }, cb);
    };
    
    // 企業マスタ検索
    _proto.findMcompany = function(cb){
      io.socket.get('/mcompany?limit=0', {
        sort:{ createdAt: 1 }
      }, cb);
    };
    
    _proto.findMcompanytoId = function(_companyId,cb){
      io.socket.get('/mcompany', {
        companyId: _companyId
      }, cb);
    };
    
    // 質問マスタ検索
    _proto.findMquestion = function(_companyId,cb){
      io.socket.get('/mquestion?limit=0', {
        companyId: _companyId,
        sort:{ sortNo: 1 }
      }, cb);
    };
    
    // 質問マスタ検索（質問No指定）
    _proto.findQuestionNo = function(_questionNo,cb){
      io.socket.get('/mquestion', {
        companyId: _proto.companyId,
        questionNo: _questionNo
      }, cb);
    };
    
    // 質問マスタ検索（残質問数）
    _proto.findMquestionRemaing = function(_sortNo,cb){
      io.socket.get('/mquestion?limit=0', {
        companyId: _proto.companyId,
        sortNo: { $gt: _sortNo }
      }, cb);
    };
    
    // 案件テーブル検索
    // TODO:初期表示のソートが異常（nsysのように2回読み込むしかないか？）
    _proto.findMproject = function(cb){
      io.socket.get('/mproject?limit=0', {
        companyId: _proto.companyId,
        userId: _proto.userId,
        sort:{ status: 1, request: 1, projectNo: -1 }
      }, cb);
    };
    
    // 【案件管理】会社単位案件テーブル検索
    _proto.findMprojectAll = function(_companyId,cb){
      io.socket.get('/mproject?limit=0', {
        companyId: _companyId,
        sort:{ request: -1, updatedAt: -1 }
      }, cb);
    };
    
    // 回答テーブル検索（個人・案件No、質問No指定）
    _proto.findManswer = function(pNo,_questionNo,cb){
      io.socket.get('/manswer', {
        companyId: _proto.companyId,
        userId: _proto.userId,
        projectNo: pNo,
        questionNo: _questionNo
      }, cb);
    };
    
    // 回答テーブル検索（個人・案件No指定）
    _proto.findManswerDetail = function(pNo,cb){
      io.socket.get('/manswer?limit=0', {
        companyId: _proto.companyId,
        userId: _proto.userId,
        projectNo: pNo,
        sort:{ sortNo: 1 }
      }, cb);
    };
    
    // 【マスタ画面】企業マスタ登録/更新
    _proto.createMcompany = function(){
      var index = $('.companyName').parent().parent().length;
      for(var i=1; i<index; i++){
        var _id = $(".hiddenId").eq(i).val();
        var _companyName = $(".companyName").eq(i).val();
        var _companyId = _proto.create_privateid(5);
        
        if(_id != ''){
          io.socket.put('/mcompany/' + _id,{
            companyName: _companyName
          },function(res,JWR){
            console.log(res,JWR);
          });
          
        } else {
          io.socket.post('/mcompany',{
            companyId: _companyId,
            companyName: _companyName
          },function(res,JWR){
            console.log(res,JWR);
          });
        }
      }
    };
    
    // 【マスタ画面】企業マスタ削除
    _proto.deleteMcompany = function(_id){
      io.socket.delete('/mcompany/',{ id: _id },function(res,JWR){
        console.log(res,JWR);
        
        // 削除後、この企業の質問マスタも全て削除
        _proto.findMquestion(res.companyId,function(que){
          for(var c in que){
            _proto.deleteMquestion(que[c].id);
          }
        });
      });
    };
    
    // 【マスタ画面】質問マスタ登録/更新
    _proto.createMquestion = function(){
      var index = $('.questionNo').parent().parent().length;
      
      // 質問バージョン
      var _version = 1;
      if($('#version').val() != ''){
        _version = parseInt($('#version').val(),10) + 1;
      }
      
      // Deferredと後処理をコールバック外へ
      var df = $.Deferred();
      df.done(function(){
        alert('登録が完了しました。再読み込みを行います。');
        setTimeout(function() {
          ms.master.initMquestion($('#companySel').val());
        }, 500);
      });
      
      // 1件も存在しない場合、resolve
      if(index == 1){
        df.resolve();
      }
      
      for(var i=1; i<index; i++){
        var _id = $(".questionId").eq(i).val();
        
        if(_id != ''){
          io.socket.put('/mquestion/' + _id,{
            questionNo: $(".questionNo").eq(i).val(),
            sortNo: parseInt($(".questionNo").eq(i).val(),10),
            version: _version,
            question: $(".question").eq(i).val(),
            questionReq: _proto.setCheckboxVal($(".questionReq").eq(i)),
            questionQua: _proto.setCheckboxVal($(".questionQua").eq(i)),
            questionSel: $(".questionSel").eq(i).val(),
            questionMoney: parseInt($(".questionMoney").eq(i).val(),10),
            questionNextNo: $(".questionNextNo").eq(i).val(),
            questionAnswer1: $(".questionAnswer1").eq(i).val(),
            questionMoney1: parseInt($(".questionMoney1").eq(i).val(),10),
            questionNextNo1: $(".questionNextNo1").eq(i).val(),
            questionAnswer2: $(".questionAnswer2").eq(i).val(),
            questionMoney2: parseInt($(".questionMoney2").eq(i).val(),10),
            questionNextNo2: $(".questionNextNo2").eq(i).val(),
            questionAnswer3: $(".questionAnswer3").eq(i).val(),
            questionMoney3: parseInt($(".questionMoney3").eq(i).val(),10),
            questionNextNo3: $(".questionNextNo3").eq(i).val(),
            questionAnswer4: $(".questionAnswer4").eq(i).val(),
            questionMoney4: parseInt($(".questionMoney4").eq(i).val(),10),
            questionNextNo4: $(".questionNextNo4").eq(i).val(),
            questionAnswer5: $(".questionAnswer5").eq(i).val(),
            questionMoney5: parseInt($(".questionMoney5").eq(i).val(),10),
            questionNextNo5: $(".questionNextNo5").eq(i).val()
            // questionMoneyn: parseInt($(".questionMoneyn").eq(i).val(),10),
            // questionNextNon: $(".questionNextNon").eq(i).val()
          },function(res,JWR){
            console.log(res,JWR);
          });
          
        } else {
          io.socket.post('/mquestion',{
            companyId: $('#companySel').val(),
            questionNo: $(".questionNo").eq(i).val(),
            sortNo: parseInt($(".questionNo").eq(i).val(),10),
            version: _version,
            question: $(".question").eq(i).val(),
            questionReq: _proto.setCheckboxVal($(".questionReq").eq(i)),
            questionQua: _proto.setCheckboxVal($(".questionQua").eq(i)),
            questionSel: $(".questionSel").eq(i).val(),
            questionMoney: parseInt($(".questionMoney").eq(i).val(),10),
            questionNextNo: $(".questionNextNo").eq(i).val(),
            questionAnswer1: $(".questionAnswer1").eq(i).val(),
            questionMoney1: parseInt($(".questionMoney1").eq(i).val(),10),
            questionNextNo1: $(".questionNextNo1").eq(i).val(),
            questionAnswer2: $(".questionAnswer2").eq(i).val(),
            questionMoney2: parseInt($(".questionMoney2").eq(i).val(),10),
            questionNextNo2: $(".questionNextNo2").eq(i).val(),
            questionAnswer3: $(".questionAnswer3").eq(i).val(),
            questionMoney3: parseInt($(".questionMoney3").eq(i).val(),10),
            questionNextNo3: $(".questionNextNo3").eq(i).val(),
            questionAnswer4: $(".questionAnswer4").eq(i).val(),
            questionMoney4: parseInt($(".questionMoney4").eq(i).val(),10),
            questionNextNo4: $(".questionNextNo4").eq(i).val(),
            questionAnswer5: $(".questionAnswer5").eq(i).val(),
            questionMoney5: parseInt($(".questionMoney5").eq(i).val(),10),
            questionNextNo5: $(".questionNextNo5").eq(i).val()
            // questionMoneyn: parseInt($(".questionMoneyn").eq(i).val(),10),
            // questionNextNon: $(".questionNextNon").eq(i).val()
          },function(res,JWR){
            console.log(res,JWR);
          });
        }
        
        // 全て更新したらresolve
        if(index == parseInt(i,10)+1){
          df.resolve();
        }
      }
    };
    
    // 【マスタ画面】質問マスタ削除
    _proto.deleteMquestion = function(_id){
      io.socket.delete('/mquestion/',{ id: _id },function(res,JWR){
        console.log(res,JWR);
      });
    };
    
    // 【ユーザー登録画面】使用者マスタ登録
    _proto.createUser = function(){
      var _userId = _proto.create_privateid(5);
      
      // 使用者マスタ登録
      io.socket.post('/muser',{
        companyId: _proto.companyId,
        userId: _userId,
        name: $('#master-user-name').val(),
        postcode: $('#postcode').val(),
        address1: $('#address1').val(),
        address2: $('#address2').val(),
        address3: $('#address3').val(),
        address4: $('#address4').val(),
        tel: $('#master-user-tel').val(),
        mail: $('#master-user-mail').val(),
        date: $('#master-user-date').val(),
        password: $('#master-user-password').val(),
        admin: '',
        loginDate: ''
        
      },function(cre,JWR){
        console.log(cre,JWR);
        if(JWR.statusCode == '200' || JWR.statusCode == '201'){
          //$('#loginno').text(_userId);
          $('#entryform').css('display', 'none');
          $('#successform').css('display', '');
          
          // ログインIDをcookie保存（1日）
          //$.cookie("UID", _userId, { expires: 1,path: '/' });
          $.cookie("UID", $('#master-user-mail').val(), { expires: 1,path: '/' });
          
          // メール送信
          io.socket.get('/Muser/sendMailTest', {
            userId: _userId,
            mail: $('#master-user-mail').val()
          }, function(data) {
            console.log(data.user.message);
          });
          
        } else {
          alert('正しく登録されませんでした。入力内容をお確かめの上、もう一度登録を行ってください。');
        }
      });
    };
    
    // 【問い合わせ画面】ユーザー削除処理
    _proto.deleteMuser = function(cid){
      io.socket.delete('/muser',{ id: cid },function(res){
        console.log(res);
      });
    };
    
    // 最終ログイン日チェック・更新
    _proto.loginCheckSave = function(){
      _proto.findMuser(function(user){
        if(user[0] != undefined){
          var m = moment();
          var n = m.format("YYYY/MM/DD");
          if( n != user[0].loginDate ){
            io.socket.put('/muser/' + user[0].id,{
              loginDate: n
            },function(upd,err){
              console.log(upd,err);
            });
          }
        }
      });
    };
    
    // パスワード問い合わせ対象ユーザー検索
    _proto.isMuserCheck = function(){
      var _mail = $('#mail').val();
      var _date = $('#date').val();
      
      // 初期化
      $('#forget_message').text('0');
      $('#contactform').css('display', '');
      var delindex = $('.forget_userName').parent().parent().index() + 1;
      for( var i = 1; i < delindex; i++ ) {
        $("#msys_forget_table_user tr:last").remove();
      }
      
      io.socket.get('/muser',{
        mail: _mail,
        date: _date
      },function(user){
        if(user[0] == undefined){
          alert('該当するユーザーが存在しません。');
        } else {
          var usercnt = 1;
          for(var c in user){
            var userT_Div = $('#forget_user_template').clone();
            $('#msys_forget_table_user').append(userT_Div);
            $('#msys_forget_table_user tr:last').css('display', '');
            
            $('.forget_userName').eq(usercnt).text(user[c].name);
            $('.forget_userId').eq(usercnt).text(user[c].userId);
            $('.forget_id').eq(usercnt).val(user[c].id);
            
            $('.forget_userName').unbind();
            $('.forget_userName').bind('click',function(e){
              var index = $('.forget_userName').index(this);
              $('#master-tenpo-name').val($('.forget_userName').eq(index).text());
              $('#master-tenpo-id').val($('.forget_id').eq(index).val());
              
              _proto.openPasswordMsys();
            });
            
            // 店舗削除ボタン
            $('.userDelete').unbind();
            $('.userDelete').bind("click", function(){
              var index = $(this).parent().parent().index();
              var _id = $('.forget_id').eq(index).val();
              if(!confirm("このユーザーを削除します。本当によろしいですか？")){
                return false;
              }
              _proto.deleteMuser(_id);
              
              $('#msys_forget_table_user tr').eq(index).remove();
            });
            
            usercnt++;
          }
          $('#forget_message').text(usercnt-1);
        }
      });
    };
    
    // 【マスタ画面】パスワード変更モーダル画面展開
    _proto.openPasswordMsys = function(){
      var _m = $('#modal-member-password');
      var _form = _m.find('form');
      _m.find('.member-name').text($('#master-tenpo-name').val());
      
      // 初期化
      $('#modal-form-member-password-password').val('');
      $('#modal-form-member-password-password-se').val('');
      
      var _s1 = $('#modal-form-member-password-save-btn');
      _s1.unbind();
      _s1.bind('click',function(e){
        e.preventDefault();
        
        if(!_proto.isBlankCheck($('#modal-form-member-password-password'),'パスワード')){return;}
        if(_form.find("#modal-form-member-password-password").val() != _form.find("#modal-form-member-password-password-se").val()){
          alert('パスワードの入力内容が異なっています。');
          _form.find("#modal-form-member-password-password-se").focus();
          return;
        }
        
        if(!confirm("パスワードを変更しますか？")){
          return false;
        }
        
        // 使用者マスタ更新（パスワードのみ）
        io.socket.put('/muser/' + $("#master-tenpo-id").val(), {
          password: _form.find("#modal-form-member-password-password").val()
        },function(res,JWR){
          console.log(res,JWR);
          
          $('#modal-member-password').modal('hide');
        });
      });
      
      _m.modal();
    };
    
    // 案件テーブル登録
    _proto.createMproject = function(que,next){
      // 必須チェック
      if(que.questionReq == '1'){
        if(que.questionSel == '1'){
          if(!_proto.isBlankCheck($('#enter-answer'),'回答')){return;}
        } else if(que.questionSel == '2'){
          if(!_proto.isBlankCheck($('#touch-answer'),'回答')){return;}
        } else if(que.questionSel == '3'){
          if(!_proto.isBlankCheck($('#date-answer'),'回答')){return;}
        } else if(que.questionSel == '4'){
          // いずれかにチェックしなければエラー
          if(!$("#chkname1").prop('checked')
          && !$('#chkname2').prop('checked')
          && !$('#chkname3').prop('checked')
          && !$('#chkname4').prop('checked')
          && !$('#chkname5').prop('checked')){
            alert('いずれか1つは必ずチェックしてください。');
            return;
          }
        } else if(que.questionSel == '5'){
          // いずれかにチェックしなければエラー
          if(!$("#rdoname1").prop('checked')
          && !$('#rdoname2').prop('checked')
          && !$('#rdoname3').prop('checked')
          && !$('#rdoname4').prop('checked')
          && !$('#rdoname5').prop('checked')){
            alert('いずれか1つは必ずチェックしてください。');
            return;
          }
        }
      }
      
      _proto.calcSubTotal(que);
      
      // 案件番号取得
      var _newNo = 0;
      io.socket.get('/mproject?limit=0', {
        companyId: _proto.companyId,
        userId: _proto.userId,
        sort:{ projectNo: -1 }
      },function(res){
        if(res[0] != undefined){
          _newNo = res[0].projectNo + 1;
        } else {
          _newNo = 1;
        }
        
        // 案件テーブル
        io.socket.post('/mproject',{
          companyId: _proto.companyId,
          userId:  _proto.userId,
          projectNo:  _newNo,
          version:  que.version,
          projectName:  _proto._answer1,
          questionNo: que.questionNo,
          totalPrice:  _proto._subTotal,
          endFlg:  '',
          status:  '',
          request: ''
          
        },function(cre,JWR){
          console.log(cre,JWR);
          
          // 案件テーブル登録後、回答テーブルも登録
          io.socket.post('/manswer',{
            companyId: _proto.companyId,
            userId:  _proto.userId,
            projectNo:  _newNo,
            questionNo:  que.questionNo,
            sortNo: parseInt(que.questionNo,10),
            backNo:  '',
            question:  que.question,
            questionSel:  que.questionSel,
            answer1:  _proto._answer1,
            answer2:  _proto._answer2,
            answer3:  _proto._answer3,
            answer4:  _proto._answer4,
            answer5:  _proto._answer5,
            price1:  que.questionMoney1,
            price2:  que.questionMoney2,
            price3:  que.questionMoney3,
            price4:  que.questionMoney4,
            price5:  que.questionMoney5,
            quantity1:  _proto._quantity1,
            quantity2:  _proto._quantity2,
            quantity3:  _proto._quantity3,
            quantity4:  _proto._quantity4,
            quantity5:  _proto._quantity5,
            subTotal: _proto._subTotal
            
          },function(ans,JWR){
            console.log(ans,JWR);
            
            // 次質問Noへ
            _proto.findQuestionNo(next,function(nex){
              if(nex[0] != undefined){
                if($("#mobile").val() != ''){
                  ms.mobile.initQuestion(nex[0],que.questionNo,_newNo);
                } else {
                  ms.customer.initQuestion(nex[0],que.questionNo,_newNo);
                }
                
              } else {
                alert('質問マスタが異常です。恐れ入りますがアイシーソフト担当者にご連絡ください。');
              }
            });
            
          });
          
        });
        
      });
      
    };
    
    // 案件テーブル更新
    _proto.updateMproject = function(que,next,pNo){
      // 必須チェック
      if(que.questionReq == '1'){
        if(que.questionSel == '1'){
          if(!_proto.isBlankCheck($('#enter-answer'),'回答')){return;}
        } else if(que.questionSel == '2'){
          if(!_proto.isBlankCheck($('#touch-answer'),'回答')){return;}
        } else if(que.questionSel == '3'){
          if(!_proto.isBlankCheck($('#date-answer'),'回答')){return;}
        } else if(que.questionSel == '4'){
          // いずれかにチェックしなければエラー
          if(!$("#chkname1").prop('checked')
          && !$('#chkname2').prop('checked')
          && !$('#chkname3').prop('checked')
          && !$('#chkname4').prop('checked')
          && !$('#chkname5').prop('checked')){
            alert('いずれか1つは必ずチェックしてください。');
            return;
          }
        } else if(que.questionSel == '5'){
          // いずれかにチェックしなければエラー
          if(!$("#rdoname1").prop('checked')
          && !$('#rdoname2').prop('checked')
          && !$('#rdoname3').prop('checked')
          && !$('#rdoname4').prop('checked')
          && !$('#rdoname5').prop('checked')){
            alert('いずれか1つは必ずチェックしてください。');
            return;
          }
        }
      }
      
      _proto.calcSubTotal(que);
      
      var _deleteNo = next;
      var _endFlg = '';
      if(next == '0'){
        _endFlg = '1';
        // 既存の最終回答を削除する
        _deleteNo = que.sortNo + 1;
      }
      
      // 既存の回答テーブルの現在の質問No以上、次質問No未満のデータを全て削除
      io.socket.get('/manswer?limit=0', {
        companyId: _proto.companyId,
        userId: _proto.userId,
        projectNo: pNo,
        $and: [
          {sortNo: { $gte: que.sortNo }},
          {sortNo: { $lt: parseInt(_deleteNo,10) }}
        ]
      },function(res){
        // Deferredと後処理をコールバック外へ
        var df = $.Deferred();
        df.done(function(){
          // 回答テーブル登録
          io.socket.post('/manswer',{
            companyId: _proto.companyId,
            userId:  _proto.userId,
            projectNo:  pNo,
            questionNo:  que.questionNo,
            sortNo: parseInt(que.questionNo,10),
            backNo:  $('#backNo').val(),
            question:  que.question,
            questionSel:  que.questionSel,
            answer1:  _proto._answer1,
            answer2:  _proto._answer2,
            answer3:  _proto._answer3,
            answer4:  _proto._answer4,
            answer5:  _proto._answer5,
            price1:  que.questionMoney1,
            price2:  que.questionMoney2,
            price3:  que.questionMoney3,
            price4:  que.questionMoney4,
            price5:  que.questionMoney5,
            quantity1:  _proto._quantity1,
            quantity2:  _proto._quantity2,
            quantity3:  _proto._quantity3,
            quantity4:  _proto._quantity4,
            quantity5:  _proto._quantity5,
            subTotal: _proto._subTotal
            
          },function(ans,JWR){
            console.log(ans,JWR);
            
            // 回答登録後、案件テーブルに小計を加算
            io.socket.get('/mproject', {
              companyId: _proto.companyId,
              userId: _proto.userId,
              projectNo: pNo
            },function(pro){
              // 案件名更新
              var _projectName = pro[0].projectName;
              // 回答質問Noと案件タイトルで使用している回答質問Noが一致している場合、上書き
              if(que.questionNo == pro[0].questionNo){
                _projectName = _proto._answer1;
              }
              io.socket.put('/mproject/' + pro[0].id,{
                projectNo: pro[0].projectNo,
                projectName: _projectName,
                totalPrice: pro[0].totalPrice + _proto._subTotal - delTotal,
                endFlg: _endFlg
              },function(upd,JWR){
                console.log(upd,JWR);
                
                // OKボタンから来た場合、一覧画面に戻し、再読み込み
                if(next == '0'){
                  if($("#mobile").val() != ''){
                    ms.mobile.openDetailForm(upd);
                  } else {
                    ms.customer.openDetailForm(upd);
                  }
                  
                } else {
                  var df2 = $.Deferred();
                  df2.done(function(){
                    // 次質問Noへ
                    _proto.findQuestionNo(next,function(nex){
                      if(nex[0] != undefined){
                        if($("#mobile").val() != ''){
                          ms.mobile.initQuestion(nex[0],que.questionNo,pNo);
                        } else {
                          ms.customer.initQuestion(nex[0],que.questionNo,pNo);
                        }
                        
                      } else {
                        alert('質問マスタが異常です。恐れ入りますがアイシーソフト担当者にご連絡ください。');
                      }
                    });
                  });
                  
                  // 次質問Noの回答が存在するとき、前質問番号を当質問番号に更新する
                  io.socket.get('/manswer', {
                    companyId: _proto.companyId,
                    userId: _proto.userId,
                    projectNo: pro[0].projectNo,
                    questionNo: next
                    
                  },function(buf){
                    if(buf[0] != undefined){
                      io.socket.put('/manswer/' + buf[0].id,{
                        backNo: que.questionNo
                      },function(ret,JWR){
                        console.log(ret,JWR);
                        
                        df2.resolve();
                      });
                      
                    } else {
                      df2.resolve();
                    }
                    
                  });
                  
                  
                }
              });
            });
            
          });
          
        });
        
        // 検索条件に当てはまったデータ全ての削除
        // 1件も存在しない場合、resolve
        if(res.length == 0){
          df.resolve();
        }
        
        var delTotal = 0;
        for(var c in res){
          // 削除したデータの小計を貯めこむ
          delTotal = delTotal + res[c].subTotal;
          io.socket.delete('/manswer',{ id: res[c].id },function(del,JWR){
            console.log(del,JWR);
            
            // 全て削除したらresolve
            if(res.length == parseInt(c,10)+1){
              df.resolve();
            }
          });
        }
        
      });
      
    };
    
    // 外出し小計計算
    _proto.calcSubTotal = function(que){
      // 回答抽出
      _proto._answer1 = "";
      _proto._answer2 = "";
      _proto._answer3 = "";
      _proto._answer4 = "";
      _proto._answer5 = "";
      _proto._quantity1 = 0;
      _proto._quantity2 = 0;
      _proto._quantity3 = 0;
      _proto._quantity4 = 0;
      _proto._quantity5 = 0;
      _proto._price1 = 0;
      _proto._price2 = 0;
      _proto._price3 = 0;
      _proto._price4 = 0;
      _proto._price5 = 0;
      _proto._subTotal = 0;
      
      // 漢字
      if(que.questionSel == '1'){
        _proto._answer1 = $('#enter-answer').val();
        
        // 数量
        if($('#quantity').val() == undefined || $('#quantity').val() == ''){
          _proto._quantity1 = 1;
        } else {
          _proto._quantity1 = parseInt($('#quantity').val(),10);
        }
        
        // 小計計算
        _proto._price1 = que.questionMoney * _proto._quantity1;
        
      // 数値
      } else if(que.questionSel == '2'){
        if($('#touch-answer').val() == ''){
          _proto._answer1 = 1;
        } else {
          _proto._answer1 = $('#touch-answer').val();
        }
        
        // 小計計算（数値の場合、回答が数量扱い）
        _proto._price1 = que.questionMoney * parseInt(_proto._answer1,10);
        
      // 日付
      } else if(que.questionSel == '3'){
        _proto._answer1 = $('#date-answer').val();
        
        // 数量
        if($('#quantity').val() == undefined || $('#quantity').val() == ''){
          _proto._quantity1 = 1;
        } else {
          _proto._quantity1 = parseInt($('#quantity').val(),10);
        }
        
        // 小計計算
        _proto._price1 = que.questionMoney * _proto._quantity1;
        
      // チェックボックス
      } else if(que.questionSel == '4'){
        _proto._answer1 = _proto.setCheckboxVal($("#chkname1"));
        _proto._answer2 = _proto.setCheckboxVal($("#chkname2"));
        _proto._answer3 = _proto.setCheckboxVal($("#chkname3"));
        _proto._answer4 = _proto.setCheckboxVal($("#chkname4"));
        _proto._answer5 = _proto.setCheckboxVal($("#chkname5"));
        
        // 数量
        if($('#chkquantity1').val() == undefined || $('#chkquantity1').val() == ''){
          _proto._quantity1 = 1;
        } else {
          _proto._quantity1 = parseInt($('#chkquantity1').val(),10);
        }
        if($('#chkquantity2').val() == undefined || $('#chkquantity2').val() == ''){
          _proto._quantity2 = 1;
        } else {
          _proto._quantity2 = parseInt($('#chkquantity2').val(),10);
        }
        if($('#chkquantity3').val() == undefined || $('#chkquantity3').val() == ''){
          _proto._quantity3 = 1;
        } else {
          _proto._quantity3 = parseInt($('#chkquantity3').val(),10);
        }
        if($('#chkquantity4').val() == undefined || $('#chkquantity4').val() == ''){
          _proto._quantity4 = 1;
        } else {
          _proto._quantity4 = parseInt($('#chkquantity4').val(),10);
        }
        if($('#chkquantity5').val() == undefined || $('#chkquantity5').val() == ''){
          _proto._quantity5 = 1;
        } else {
          _proto._quantity5 = parseInt($('#chkquantity5').val(),10);
        }
        
        // 小計計算
        if(_proto._answer1 != ''){
          _proto._price1 = que.questionMoney1 * _proto._quantity1;
        }
        if(_proto._answer2 != ''){
          _proto._price2 = que.questionMoney2 * _proto._quantity2;
        }
        if(_proto._answer3 != ''){
          _proto._price3 = que.questionMoney3 * _proto._quantity3;
        }
        if(_proto._answer4 != ''){
          _proto._price4 = que.questionMoney4 * _proto._quantity4;
        }
        if(_proto._answer5 != ''){
          _proto._price5 = que.questionMoney5 * _proto._quantity5;
        }
        
      // ラジオボタン
      } else if(que.questionSel == '5'){
        _proto._answer1 = $("input[name='rdo']:checked").val();
        
        // 数量
        if($('#quantity').val() == undefined || $('#quantity').val() == ''){
          _proto._quantity1 = 1;
        } else {
          _proto._quantity1 = parseInt($('#quantity').val(),10);
        }
        
        // 小計計算
        _proto._price1 = parseInt($('#radio_price').val(),10) * _proto._quantity1;
      }
      
      // 小計合計
      _proto._subTotal = _proto._price1 + _proto._price2 + _proto._price3 + _proto._price4 + _proto._price5;
    };
    
    // ステータス変更
    _proto.changeStatus = function(_id,_status){
      io.socket.put('/mproject/' + _id,{
        status: _status
      },function(upd,JWR){
        console.log(upd,JWR);
        
        $('#xform').css('display', '');
        $('#yform').css('display', 'none');
        $('#zform').css('display', '');
        $('#detailform').css('display', 'none');
        
        if($("#mobile").val() != ''){
          ms.mobile.initMobile();
        } else {
          ms.customer.initCustomer();
        }
        
      });
    };
    
    // 見積依頼
    _proto.changeRequest = function(_id,_request,_title,_mail){
      io.socket.put('/mproject/' + _id,{
        request: _request
      },function(upd,JWR){
        console.log(upd,JWR);
        
        // prototypeからメールアドレス検索
        _proto.findMuser(function(user){
          if(user[0] != undefined){
            _proto.findMcompanytoId(user[0].companyId,function(com){
              var _mail_req = '会社名：' + com[0].companyName + '\n依頼者名：' + user[0].name + '\nメールアドレス：' + user[0].mail + '\n\n' + _mail;
              
              // メール送信
              io.socket.get('/Muser/sendMailToUser', {
                address: 'eigyo@icsoft.co.jp',
                title: _title,
                mail: _mail_req
              }, function(data) {
                console.log(data.user.message);
              });
            });
            
          }
          
          $('#xform').css('display', '');
          $('#yform').css('display', 'none');
          $('#zform').css('display', '');
          $('#detailform').css('display', 'none');
          
          if($("#mobile").val() != ''){
            ms.mobile.initMobile();
          } else {
            ms.customer.initCustomer();
          }
        });
      });
    };
    
    // 案件削除
    _proto.deleteMproject = function(pro){
      // Deferredと後処理をコールバック外へ
      var df = $.Deferred();
      df.done(function(){
        io.socket.delete('/mproject/',{ id: pro.id },function(res,JWR){
          console.log(res,JWR);
          
          $('#xform').css('display', '');
          $('#yform').css('display', 'none');
          $('#zform').css('display', '');
          $('#detailform').css('display', 'none');
          
          if($("#mobile").val() != ''){
            ms.mobile.initMobile();
          } else {
            ms.customer.initCustomer();
          }
        });
      });
      
      // 案件番号に対応した回答を検索・削除
      _proto.findManswerDetail(pro.projectNo,function(ans){
        // 1件も存在しない場合、resolve
        if(ans.length == 0){
          df.resolve();
        }
        for(var c in ans){
          io.socket.delete('/manswer/',{ id: ans[c].id },function(del,JWR){
            console.log(del,JWR);
            
            // 全て削除したらresolve
            if(ans.length == parseInt(c,10)+1){
              df.resolve();
            }
          });
        }
      });

    };
    
    // メール送信（自分宛）
    _proto.sendMailProject = function(_title,_mail){
      // prototypeからメールアドレス検索
      _proto.findMuser(function(user){
        if(user[0] != undefined){
          // メール送信
          io.socket.get('/Muser/sendMailToUser', {
            address: user[0].mail,
            title: _title,
            mail: _mail
          }, function(data) {
            console.log(data.user.message);
          });
        }
      });
    };
    
    // 入力チェック
    // 必須チェック
    _proto.isBlankCheck = function(obj,name){
      var res = true;
      if(obj.val() == ''){
        alert(name + 'は必須入力です。');
        obj.focus();
        res = false;
      }
      return res;
    };
    
    // 1/5 数値カンマ区切り
    _proto.addFigure = function(str){
      var num = new String(str).replace(/,/g, "");
      while(num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
      return num;
    };
    
    // 数値項目nullブランク対応
    _proto.transNullBlankToZero = function(obj){
      var res = obj;
      if(obj == null || obj == '') {
        res = 0;
      }
      return res;
    };
    
    // プルダウン時間範囲取得(00-40)
    _proto.getPulldown_h = function(obj) {
      var o_hour = '<option value=""></option>';
      var hour = "";
      for( var i=0; i<36; i++){
        if( i < 10) {
          hour = "0" + i;
        } else {
          hour = i;
        }
        o_hour = o_hour + '<option value="' + hour + '">' + hour + '</option>';
      }
      obj.append(o_hour);
    };
    
    // プルダウン分範囲取得(00-59)
    _proto.getPulldown_m = function(obj) {
      var o_min = '<option value=""></option>';
      var min = "";
      for( var i=0; i<60; i++){
        if( i < 10) {
          min = "0" + i;
        } else {
          min = i;
        }
        o_min = o_min + '<option value="' + min + '">' + min + '</option>';
      }
      obj.append(o_min);
    };
    
    // プルダウン分範囲取得(10分単位)
    _proto.getPulldown_m10 = function(obj) {
      var o_min = '<option value=""></option>';
      var min = "";
      for( var i=0; i<=60; i= i+10){
        if( i < 10) {
          min = "0" + i;
        } else {
          min = i;
        }
        o_min = o_min + '<option value="' + min + '">' + min + '</option>';
      }
      obj.append(o_min);
    };
    
    // チェックボックスの値を取得する
    _proto.setCheckboxVal = function(obj) {
      if(obj.attr("checked") !== undefined){
        return obj.val();
      } else {
        return "";
      }
    };
    
    // チェックボックスON判定
    _proto.checkboxCheck = function(day,obj) {
      if(day == obj.val()) {
        obj.attr("checked",true);
      }
    };
    
    // n桁のランダムなIDを作成する
    _proto.create_privateid = function( n ){
      var CODE_TABLE = "0123456789";
          // + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
          // + "abcdefghijklmnopqrstuvwxyz";
      var r = "";
      for (var i = 0, k = CODE_TABLE.length; i < n; i++)
        r += CODE_TABLE.charAt(Math.floor(k * Math.random()));
      return r;
    };
    
  }
 //////exports
    window.KsWidgetTmpl = KsWidgetTmpl;
})(window);