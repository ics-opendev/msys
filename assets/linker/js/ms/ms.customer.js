/******
 * ms.customer.js
 * マスタ画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  var _allCDiv = "#"+'all_customer';
  var _cidPrefix = "cid-";
  
  var qNo = 0;
  
  _wt._html = {
    url: _wt.htmlLoader.urlBase + '/top-pane-floor/customer-msys.html',
    obj: {},
    loaded: false
  };
  
  _wt.initCustomer = function(){
    console.log('initCustomer() called.');
    
    // 【案件テーブル】案件検索
    _wt.findMproject(function(res){
      // 初期化
      $('#all_customer div').remove();
      
      if(res.length == 0){
        console.log('0件');
        _wt.firstLoad_customer = true;
      }
      
      for(var c in res){
        _wt.addCustomer(res[c],c,res.length);
      }
    });
    
    // 新規受付
    $('#customer-project-create').unbind();
    $('#customer-project-create').bind('click',function(e){
      _wt.findMquestion(KsWidgetTmpl.prototype.companyId,function(res){
        if(res[0] != undefined){
          qNo = 0;
          $('#xform').css('display', 'none');
          $('#yform').css('display', '');
          $('#zform').css('display', 'none');
          
          // $('#questionTotal').text(res.length);
          $('#questionRe').text(res.length);
          
          _wt.initQuestion(res[0],'','');
        } else {
          alert('あなたの会社の質問項目が作成されていません。');
        }
      });
    });
    
    // 「戻る」ボタン
    $('#customer-back').unbind();
    $('#customer-back').bind('click',function(e){
      location.href = "/msys/main";
    });
  };
  
  // 案件行展開
  _wt.addCustomer = function (_c,c,len) {
    // Deferredと後処理をコールバック外へ
    var df = $.Deferred();
    df.done(function(){
      // 後処理
      if(_wt.firstLoad_customer == false){
         _wt.firstLoad_customer = true;
         console.log('初回再読み込み');
         _wt.initCustomer();
       }
    });
    
    _wt.fromHtml(_wt._html, function(_div,_p) {
      // 共通
      _div.attr('id', _cidPrefix + _c.id);
      _div.find('.customer-no').text(_c.projectNo + '　');
      _div.find('.customer-name').text(_c.projectName.substr(0,12));
      _div.find('.customer-price').text('￥' + _wt.addFigure(_c.totalPrice));
      
      // 回答が途中か判別
      if(_c.endFlg == '1'){
        _div.find('.customer-option1').text('完');
        _div.find('.customer-option1').css( "background", "#8cc11f" );
      } else {
        _div.find('.customer-option1').text('未');
        _div.find('.customer-option1').css( "background", "gray" );
      }
      
      // ステータス
      if(_c.status == '1'){
        _div.find('.customer-status').text('確');
        _div.find('.customer-status').css( "background", "#8cc11f" );
      } else if(_c.status == '2'){
        _div.find('.customer-status').text('保');
        _div.find('.customer-status').css( "background", "orange" );
      } else if(_c.status == '3'){
        _div.find('.customer-status').text('失');
        _div.find('.customer-status').css( "background", "gray" );
      } else {
        _div.find('.customer-status').text('商');
        _div.find('.customer-status').css( "background", "blue" );
      }
      
      // 見積依頼
      if(_c.request == '1'){
        _div.find('.customer-request').text('済');
        _div.find('.customer-request').css( "background", "#8cc11f" );
      } else {
        _div.find('.customer-request').text('前');
        _div.find('.customer-request').css( "background", "gray" );
      }
      
      var old = _wt.findCustomerDivByCid(_c.id);
      if(old.length === 0){
        $(_allCDiv).append(_div).fadeIn(500);
      } else {
        _div.replaceAll(old).fadeIn(500);
      }
      
      // 「修正」ボタン
      _div.find('.customer-button').unbind();
      _div.find('.customer-button').bind('click',function(e){
        _wt.findMquestion(KsWidgetTmpl.prototype.companyId,function(res){
          if(res[0] != undefined){
            if(res[0].version != _c.version){
              alert('質問マスタの内容が更新されたため、この案件は修正できません。');
              return;
            }
            qNo = 0;
            $('#xform').css('display', 'none');
            $('#yform').css('display', '');
            $('#zform').css('display', 'none');
            
            // $('#questionTotal').text(res.length);
            $('#questionRe').text(res.length);
            
            _wt.initQuestion(res[0],'',_c.projectNo);
          } else {
            alert('あなたの会社の質問項目が作成されていません。');
          }
        });
      });
      
      // 行クリック時アクション
      _div.find('.customer-zone').unbind();
      _div.find('.customer-zone').bind('click',function(e){
        _wt.openDetailForm(_c);
      });
      
      // 最後の行を出力しきったところでresolve
      if(len == parseInt(c,10)+1){
        df.resolve();
      }
    });
  };
  
  // 質問画面初期表示
  _wt.initQuestion = function(que,com,pNo){
    // 初期化
    $('#enterform').css('display', 'none');
    $('#touchform').css('display', 'none');
    $('#dateform').css('display', 'none');
    $('#checkform').css('display', 'none');
    $('#radioform').css('display', 'none');
    $('#quantityform').css('display', '');
    
    $('#btn_customer_back').css('display', 'none');
    $('#btn_customer_next').css('display', 'none');
    $('#btn_customer_create').css('display', 'none');
    
    $('input:checkbox').prop("checked",false);
    $('input:radio').prop("checked",false);
    //$('#rdoname1').prop("checked",true);
    
    $('#lastMessage').text('');
    $('#radio_nextNo').val('');
    $('#quantity').val('');
    $('#quantity').keypad({
    });
    $('#chkquantity1').val('');
    $('#chkquantity1').keypad({
    });
    $('#chkquantity2').val('');
    $('#chkquantity2').keypad({
    });
    $('#chkquantity3').val('');
    $('#chkquantity3').keypad({
    });
    $('#chkquantity4').val('');
    $('#chkquantity4').keypad({
    });
    $('#chkquantity5').val('');
    $('#chkquantity5').keypad({
    });
    $('#backNo').val('');
    
    qNo++;
    $('#questionNo').text(qNo);
    
    _wt.findMquestionRemaing(que.sortNo,function(rem){
      $('#questionRe').text(rem.length);
    });
    // var _percentage = Math.ceil(qNo / parseInt($('#questionTotal').text(),10) * 100);
    // $('#questionPercentage').text(_percentage);
    
    // 回答テーブル検索
    _wt.findManswer(pNo,que.questionNo,function(res){
      // 回答区分によって表示する解答欄を分ける
      // 漢字
      if(que.questionSel == '1'){
        $('#enter_question').text(que.question);
        if(res[0] != undefined){
          $('#enter-answer').val(res[0].answer1);
          $('#quantity').val(res[0].quantity1);
        } else {
          $('#enter-answer').val('');
        }
        
        $('#enterform').css('display', '');
        if(que.questionQua != '1'){
          $('#quantityform').css('display', 'none');
        }
        
        // 次質問番号が存在するか
        if(que.questionNextNo != ''){
          $('#btn_customer_next').css('display', '');
        } else {
          $('#btn_customer_create').css('display', '');
          $('#lastMessage').text('質問は以上になります。お疲れ様でした。');
        }
        
        // clearボタン
        $('#btn_enter_del').unbind();
        $('#btn_enter_del').bind('click',function(e){
          $('#enter-answer').val('');
        });
        
      // 数値
      } else if(que.questionSel == '2'){
        $('#touch_question').text(que.question);
        if(res[0] != undefined){
          $('#touch-answer').val(res[0].answer1);
        } else {
          $('#touch-answer').val('');
        }
        
        $('#touchform').css('display', '');
        $('#quantityform').css('display', 'none');
        
        // 次質問番号が存在するか
        if(que.questionNextNo != ''){
          $('#btn_customer_next').css('display', '');
        } else {
          $('#btn_customer_create').css('display', '');
          $('#lastMessage').text('質問は以上になります。お疲れ様でした。');
        }
        
        // clearボタン
        $('#btn_touch_del').unbind();
        $('#btn_touch_del').bind('click',function(e){
          $('#touch-answer').val('');
        });
        
        // 数値タッチパネル
        $('.number_x').unbind();
        $('.number_x').bind('click',function(e){
        //$('.number_x').bind('touchstart',function(e){
          $('#touch-answer').val($('#touch-answer').val() + $(this).text());
        });
        
      // 日付
      } else if(que.questionSel == '3'){
        $('#date_question').text(que.question);
        if(res[0] != undefined){
          $('#date-answer').val(res[0].answer1);
          $('#quantity').val(res[0].quantity1);
        } else {
          $('#date-answer').val('');
        }
        
        $("#date-answer").datepicker();
        $('#dateform').css('display', '');
        if(que.questionQua != '1'){
          $('#quantityform').css('display', 'none');
        }
        
        // 次質問番号が存在するか
        if(que.questionNextNo != ''){
          $('#btn_customer_next').css('display', '');
        } else {
          $('#btn_customer_create').css('display', '');
          $('#lastMessage').text('質問は以上になります。お疲れ様でした。');
        }
        
      // チェックボックス
      } else if(que.questionSel == '4'){
        $('#check_question').text(que.question);
        $('#checkform').css('display', '');
        $('#quantityform').css('display', 'none');
        $('#check_templete1').css('display', 'none');
        $('#check_templete2').css('display', 'none');
        $('#check_templete3').css('display', 'none');
        $('#check_templete4').css('display', 'none');
        $('#check_templete5').css('display', 'none');
        
        $('#quantityform1').css('display', '');
        $('#quantityform2').css('display', '');
        $('#quantityform3').css('display', '');
        $('#quantityform4').css('display', '');
        $('#quantityform5').css('display', '');
        
        if(que.questionAnswer1 != ''){
          $('#check_templete1').css('display', '');
          if(que.questionQua != '1'){
            $('#quantityform1').css('display', 'none');
          }
          $('#chkname1').val(que.questionAnswer1);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer1, $('#chkname1'));
            if(res[0].answer1 != ''){
              $('#chkquantity1').val(res[0].quantity1);
            }
          }
          $('#check_name1').text(que.questionAnswer1);
        }
        if(que.questionAnswer2 != ''){
          $('#check_templete2').css('display', '');
          if(que.questionQua != '1'){
            $('#quantityform2').css('display', 'none');
          }
          $('#chkname2').val(que.questionAnswer2);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer2, $('#chkname2'));
            if(res[0].answer2 != ''){
              $('#chkquantity2').val(res[0].quantity2);
            }
          }
          $('#check_name2').text(que.questionAnswer2);
        }
        if(que.questionAnswer3 != ''){
          $('#check_templete3').css('display', '');
          if(que.questionQua != '1'){
            $('#quantityform3').css('display', 'none');
          }
          $('#chkname3').val(que.questionAnswer3);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer3, $('#chkname3'));
            if(res[0].answer3 != ''){
              $('#chkquantity3').val(res[0].quantity3);
            }
          }
          $('#check_name3').text(que.questionAnswer3);
        }
        if(que.questionAnswer4 != ''){
          $('#check_templete4').css('display', '');
          if(que.questionQua != '1'){
            $('#quantityform4').css('display', 'none');
          }
          $('#chkname4').val(que.questionAnswer4);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer4, $('#chkname4'));
            if(res[0].answer4 != ''){
              $('#chkquantity4').val(res[0].quantity4);
            }
          }
          $('#check_name4').text(que.questionAnswer4);
        }
        if(que.questionAnswer5 != ''){
          $('#check_templete5').css('display', '');
          if(que.questionQua != '1'){
            $('#quantityform5').css('display', 'none');
          }
          $('#chkname5').val(que.questionAnswer5);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer5, $('#chkname5'));
            if(res[0].answer5 != ''){
              $('#chkquantity5').val(res[0].quantity5);
            }
          }
          $('#check_name5').text(que.questionAnswer5);
        }
        
        // 次質問番号が存在するか
        if(que.questionNextNo != ''){
          $('#btn_customer_next').css('display', '');
        } else {
          $('#btn_customer_create').css('display', '');
          $('#lastMessage').text('質問は以上になります。お疲れ様でした。');
        }
        
      // ラジオボタン
      } else if(que.questionSel == '5'){
        $('#radio_question').text(que.question);
        $('#radioform').css('display', '');
        if(que.questionQua != '1'){
          $('#quantityform').css('display', 'none');
        }
        $('#radio_templete1').css('display', 'none');
        $('#radio_templete2').css('display', 'none');
        $('#radio_templete3').css('display', 'none');
        $('#radio_templete4').css('display', 'none');
        $('#radio_templete5').css('display', 'none');
        if(res[0] != undefined){
          $('#quantity').val(res[0].quantity1);
        }
        
        if(que.questionAnswer1 != ''){
          $('#radio_templete1').css('display', '');
          $('#rdoname1').val(que.questionAnswer1);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer1, $('#rdoname1'));
          }
          $('#radio_name1').text(que.questionAnswer1);
        }
        if(que.questionAnswer2 != ''){
          $('#radio_templete2').css('display', '');
          $('#rdoname2').val(que.questionAnswer2);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer1, $('#rdoname2'));
          }
          $('#radio_name2').text(que.questionAnswer2);
        }
        if(que.questionAnswer3 != ''){
          $('#radio_templete3').css('display', '');
          $('#rdoname3').val(que.questionAnswer3);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer1, $('#rdoname3'));
          }
          $('#radio_name3').text(que.questionAnswer3);
        }
        if(que.questionAnswer4 != ''){
          $('#radio_templete4').css('display', '');
          $('#rdoname4').val(que.questionAnswer4);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer1, $('#rdoname4'));
          }
          $('#radio_name4').text(que.questionAnswer4);
        }
        if(que.questionAnswer5 != ''){
          $('#radio_templete5').css('display', '');
          $('#rdoname5').val(que.questionAnswer5);
          if(res[0] != undefined){
            _wt.checkboxCheck(res[0].answer1, $('#rdoname5'));
          }
          $('#radio_name5').text(que.questionAnswer5);
        }
        
        // 次質問番号が存在するか
        if(que.questionNextNo1 != '' || que.questionNextNo2 != '' || que.questionNextNo3 != '' || que.questionNextNo4 != '' || que.questionNextNo5 != ''){
          $('#btn_customer_next').css('display', '');
        } else {
          $('#btn_customer_create').css('display', '');
          $('#lastMessage').text('質問は以上になります。お疲れ様でした。');
        }
      }
      
      // 前質問番号が存在するか
      if(res[0] != undefined){
        $('#backNo').val(res[0].backNo);
      
      } else if(com != ''){
        $('#backNo').val(com);
      }
      if($('#backNo').val() != ''){
        $('#btn_customer_back').css('display', '');
      }
    });
    
    // 「次へ」ボタン
    $('#btn_customer_next').unbind();
    $('#btn_customer_next').bind('click',function(e){
      
      // ラジオボタンの場合のみ、チェックされた選択肢によって次質問番号が変わる
      if(que.questionSel == '5'){
        var check1 = $('#rdoname1').prop('checked');
        var check2 = $('#rdoname2').prop('checked');
        var check3 = $('#rdoname3').prop('checked');
        var check4 = $('#rdoname4').prop('checked');
        var check5 = $('#rdoname5').prop('checked');
        
        if(check1 == true){
          $('#radio_nextNo').val(que.questionNextNo1);
          $('#radio_price').val(que.questionMoney1);
        } else if(check2 == true){
          $('#radio_nextNo').val(que.questionNextNo2);
          $('#radio_price').val(que.questionMoney2);
        } else if(check3 == true){
          $('#radio_nextNo').val(que.questionNextNo3);
          $('#radio_price').val(que.questionMoney3);
        } else if(check4 == true){
          $('#radio_nextNo').val(que.questionNextNo4);
          $('#radio_price').val(que.questionMoney4);
        } else if(check5 == true){
          $('#radio_nextNo').val(que.questionNextNo5);
          $('#radio_price').val(que.questionMoney5);
        }
      }
      
      // 次質問No
      var _questionNextNo = '';
      if(que.questionNextNo != ''){
        _questionNextNo = que.questionNextNo;
        
      } else {
        _questionNextNo = $('#radio_nextNo').val();
      }
      
      // 初回時、案件テーブルに登録
      if(pNo == ''){
        _wt.createMproject(que,_questionNextNo);
      } else {
        _wt.updateMproject(que,_questionNextNo,pNo);
      }
      
    });
    
    // 「前へ」ボタン
    $('#btn_customer_back').unbind();
    $('#btn_customer_back').bind('click',function(e){
      _wt.findQuestionNo($('#backNo').val(),function(res){
        if(res[0] != undefined){
          qNo = qNo -2;
          _wt.initQuestion(res[0],'',pNo);
          
        } else {
          alert('質問マスタが異常です。恐れ入りますがアイシーソフト担当者にご連絡ください。');
        }
      });
    });
    
    // 「OK」ボタン
    $('#btn_customer_create').unbind();
    $('#btn_customer_create').bind('click',function(e){
      // ラジオボタンの場合のみ、金額をセット
      if(que.questionSel == '5'){
        var check1 = $('#rdoname1').prop('checked');
        var check2 = $('#rdoname2').prop('checked');
        var check3 = $('#rdoname3').prop('checked');
        var check4 = $('#rdoname4').prop('checked');
        var check5 = $('#rdoname5').prop('checked');
        
        if(check1 == true){
          $('#radio_price').val(que.questionMoney1);
        } else if(check2 == true){
          $('#radio_price').val(que.questionMoney2);
        } else if(check3 == true){
          $('#radio_price').val(que.questionMoney3);
        } else if(check4 == true){
          $('#radio_price').val(que.questionMoney4);
        } else if(check5 == true){
          $('#radio_price').val(que.questionMoney5);
        }
      }
      
      _wt.updateMproject(que,'0',pNo);
    });
    
    // 「キャンセル」ボタン
    $('#btn_customer_cancel').unbind();
    $('#btn_customer_cancel').bind('click',function(e){
      $('#xform').css('display', '');
      $('#yform').css('display', 'none');
      $('#zform').css('display', '');
      
      _wt.initCustomer();
    });
  };
  
  // 案件回答一覧画面表示
  _wt.openDetailForm = function(_c){
    // メール送信用
    var _title = _c.projectName;
    var _mail = '';
    
    // 初期化
    $('#xform').css('display', 'none');
    $('#yform').css('display', 'none');
    $('#zform').css('display', 'none');
    $('#detailform').css('display', '');
    
    $('#status').val(_c.status);
    if(_c.request == '1'){
      $('#btn_request').val('見積依頼取消');
    } else {
      $('#btn_request').val('見積依頼');
    }
    
    // 案件詳細回答一覧
    _wt.findManswerDetail(_c.projectNo,function(res){
      // 初期化
      var delindex = $('.detail_questionNo').parent().parent().index();
      for( var i = 1; i < delindex; i++ ) {
        $("#msys_customer_table_detail tr:last").remove();
      }
      
      $('#detail_price').text('￥' + _wt.addFigure(_c.totalPrice));
      _mail = '試算総額：' + '￥' + _wt.addFigure(_c.totalPrice) + '\n\n';
      
      var cnt = 1;
      for(var c in res){
        var detailT_Div = $('#detail_template').clone();
        $('#msys_customer_table_detail').append(detailT_Div);
        $('#msys_customer_table_detail tr:last').css('display', '');
        $('.detail_questionNo').eq(cnt).text(cnt);
        $('.detail_question').eq(cnt).text(res[c].question);
        
        _mail = _mail + '質問No' + cnt + '：' + res[c].question + '\n';
        
        // TODO:リリース時に小計は削除すること！
        // $('.detail_subTotal').eq(cnt).text(res[c].subTotal);
        if(res[c].questionSel == '4'){
          var _answer = '';
          var _quantity = '';
          var _quantity_m = '';
          if(res[c].answer1 != ''){
            _answer = '・' + res[c].answer1;
            _quantity = res[c].quantity1;
            _quantity_m = res[c].quantity1;
          }
          if(res[c].answer2 != ''){
            if(_answer != ''){
              _answer = _answer + '<br>・' + res[c].answer2;
              _quantity = _quantity + '<br>' + res[c].quantity2;
              _quantity_m = _quantity_m + ',' + res[c].quantity2;
            } else {
              _answer = '・' + res[c].answer2;
              _quantity = res[c].quantity2;
              _quantity_m = res[c].quantity2;
            }
          }
          if(res[c].answer3 != ''){
            if(_answer != ''){
              _answer = _answer + '<br>・' + res[c].answer3;
              _quantity = _quantity + '<br>' + res[c].quantity3;
              _quantity_m = _quantity_m + ',' + res[c].quantity3;
            } else {
              _answer = '・' + res[c].answer3;
              _quantity = res[c].quantity3;
              _quantity_m = res[c].quantity3;
            }
          }
          if(res[c].answer4 != ''){
            if(_answer != ''){
              _answer = _answer + '<br>・' + res[c].answer4;
              _quantity = _quantity + '<br>' + res[c].quantity4;
              _quantity_m = _quantity_m + ',' + res[c].quantity4;
            } else {
              _answer = '・' + res[c].answer4;
              _quantity = res[c].quantity4;
              _quantity_m = res[c].quantity4;
            }
          }
          if(res[c].answer5 != ''){
            if(_answer != ''){
              _answer = _answer + '<br>・' + res[c].answer5;
              _quantity = _quantity + '<br>' + res[c].quantity5;
              _quantity_m = _quantity_m + ',' + res[c].quantity5;
            } else {
              _answer = '・' + res[c].answer5;
              _quantity = res[c].quantity5;
              _quantity_m = res[c].quantity5;
            }
          }
          
          $('.detail_answer').eq(cnt).html(_answer);
          $('.detail_quantity').eq(cnt).html(_quantity);
          
          _mail = _mail + '回答：\n' + _answer.split("<br>").join("\n") + '\n' + '個数：' + _quantity_m + '\n\n';
          
        } else {
          $('.detail_answer').eq(cnt).text(res[c].answer1);
          $('.detail_quantity').eq(cnt).text(res[c].quantity1);
          
          _mail = _mail + '回答：' + res[c].answer1 + '\n' + '個数：' + res[c].quantity1 + '\n\n';
        }
        
        cnt++;
      }
      
      // ステータス変更ボタン
      $('#btn_status').unbind();
      $('#btn_status').bind('click',function(e){
        if(!confirm("選択したステータスに変更します。よろしいですか？")){
          return false;
        }
        _wt.changeStatus(_c.id,$('#status').val());
      });
      
      // 見積依頼ボタン
      $('#btn_request').unbind();
      $('#btn_request').bind('click',function(e){
        var _msg = 'アイシーソフトに見積依頼を行います。よろしいですか？';
        var _request = '1';
        if(this.value == '見積依頼取消'){
          _msg = '見積依頼を取り消します。よろしいですか？';
          _request = '';
        }
        if(!confirm(_msg)){
          return false;
        }
        _wt.changeRequest(_c.id,_request,_title,_mail);
      });
      
      // 案件削除ボタン
      $('#btn_delete').unbind();
      $('#btn_delete').bind('click',function(e){
        if(_c.request == '1'){
          alert('見積依頼取消を行ってから削除してください。');
          return false;
        }
        if(!confirm("この案件を削除します。よろしいですか？")){
          return false;
        }
        
        _wt.deleteMproject(_c);
      });
      
      // メール送信ボタン
      $('#btn_mail').unbind();
      $('#btn_mail').bind('click',function(e){
        if(!confirm("自分のメールアドレスにこの案件の内容を送信します。よろしいですか？")){
          return false;
        }
        
        _wt.sendMailProject(_title,_mail);
      });
      
      // 案件詳細画面・戻るボタン
      $('#detail-back').unbind();
      $('#detail-back').bind('click',function(e){
        $('#xform').css('display', '');
        $('#yform').css('display', 'none');
        $('#zform').css('display', '');
        $('#detailform').css('display', 'none');
        
        _wt.initCustomer();
      });
    });
  };
  
//////exports
  if('undefined' == typeof module){
    if( !window.ms ){window.ms = {};}
      window.ms.customer = _wt;
  } else {
    module.exports = _wt;
  }
})();