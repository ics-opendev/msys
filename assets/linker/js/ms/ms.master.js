/******
 * ms.master.js
 * マスタ画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  
  _wt.initMaster = function(){
    console.log('initMaster() called.');
    
    // 【企業マスタ】企業検索
    _wt.findMcompany(function(res){
      // 初期化
      $('#companySel option').remove();
      $('#companySel').append('<option value="">企業を選択</option>');
      
      var delindex = $('.companyName').parent().parent().index();
      for( var i = 1; i < delindex; i++ ) {
        $("#msys_management_table_company tr:last").remove();
      }
      
      // 質問マスタ行もクリア
      var delindex2 = $('.questionNo').parent().parent().index();
      for( var j = 2; j < delindex2; j++ ) {
        $("#msys_management_table_question tr:last").remove();
      }
      
      var cnt = 1;
      for(var c in res){
        var companyT_Div = $('#company_template').clone();
        $('#msys_management_table_company').append(companyT_Div);
        $('#msys_management_table_company tr:last').css('display', '');
        $('.companyName').eq(cnt).val(res[c].companyName);
        $('.hiddenId').eq(cnt).val(res[c].id);
        $('.companyId').eq(cnt).text(res[c].companyId);
        
        var o_company = '<option value="' + res[c].companyId + '">' + res[c].companyName + '</option>';
        $('#companySel').append(o_company);
        
        cnt++;
      }
      
      // 企業行追加
      $('#btn_company_add').unbind();
      $('#btn_company_add').bind('click',function(e){
        var genreT_Div = $('#company_template').clone();
        $('#msys_management_table_company').append(genreT_Div);
        $('#msys_management_table_company tr:last').css('display', '');
        
        $('.btn_company_del').unbind();
        $('.btn_company_del').bind('click',function(e){
          var index = $(this).parent().parent().index();
          var _id = $('.hiddenId').eq(index-1).val();
          if(_id != ''){
            if(!confirm("選択した企業を削除します。この企業の質問マスタも全て削除しますがよろしいですか？")){
              return false;
            }
            _wt.deleteMcompany(_id);
          }
          $('#msys_management_table_company tr').eq(index).remove();
        });
      });
      
      // 企業行削除
      $('.btn_company_del').unbind();
      $('.btn_company_del').bind('click',function(e){
        var index = $(this).parent().parent().index();
        var _id = $('.hiddenId').eq(index-1).val();
        if(_id != ''){
          if(!confirm("選択した企業を削除します。この企業の質問マスタも全て削除しますがよろしいですか？")){
            return false;
          }
          _wt.deleteMcompany(_id);
        }
        $('#msys_management_table_company tr').eq(index).remove();
      });
      
      // 企業登録
      $('#btn_company_save').unbind();
      $('#btn_company_save').bind('click',function(e){
        if(!confirm("上記の状態で企業を登録します。よろしいですか？")){
          return false;
        }
        
        _wt.createMcompany();
      });
      
      // 【質問マスタ】企業プルダウン
      $('#companySel').unbind();
      $('#companySel').bind('change',function(e){
        _wt.initMquestion($(this).val());
      });
    });
  };
  
  _wt.initMquestion = function(_companyId){
    console.log('initMquestion() called.');
    
    // 【企業マスタ】企業検索
    _wt.findMquestion(_companyId,function(res){
      if(res[0] != undefined){
        $('#version').val(res[0].version);
      } else {
        $('#version').val('');
      }
      
      // 初期化
      var delindex = $('.questionNo').parent().parent().index();
      for( var i = 2; i < delindex; i++ ) {
        $("#msys_management_table_question tr:last").remove();
      }
      
      var cnt = 1;
      for(var c in res){
        var questionT_Div = $('#question_template').clone();
        $('#msys_management_table_question').append(questionT_Div);
        $('#msys_management_table_question tr:last').css('display', '');
        $('.questionNo').eq(cnt).val(res[c].questionNo);
        $('.questionId').eq(cnt).val(res[c].id);
        $('.question').eq(cnt).val(res[c].question);
        _wt.checkboxCheck(res[c].questionReq, $('.questionReq').eq(cnt));
        _wt.checkboxCheck(res[c].questionQua, $('.questionQua').eq(cnt));
        
        // 必須入力チェックボックスがONの場合、入力可否変更
        // if(res[c].questionReq == '1'){
        //   _wt.lockObj($('.questionMoneyn').eq(cnt),'2');
        //   _wt.lockObj($('.questionNextNon').eq(cnt),'1');
        // }
        
        $('.questionSel').eq(cnt).val(res[c].questionSel);
        
        // 回答形式がチェックボックス、ラジオボタンの場合は入力可否変更
        if(res[c].questionSel == '4'){
          _wt.lockObj($('.questionMoney').eq(cnt),'2');
          _wt.lockObj($('.questionNextNo').eq(cnt),'');
          
          _wt.lockObj($('.questionAnswer1').eq(cnt),'');
          _wt.lockObj($('.questionMoney1').eq(cnt),'');
          _wt.lockObj($('.questionNextNo1').eq(cnt),'1');
          _wt.lockObj($('.questionAnswer2').eq(cnt),'');
          _wt.lockObj($('.questionMoney2').eq(cnt),'');
          _wt.lockObj($('.questionNextNo2').eq(cnt),'1');
          _wt.lockObj($('.questionAnswer3').eq(cnt),'');
          _wt.lockObj($('.questionMoney3').eq(cnt),'');
          _wt.lockObj($('.questionNextNo3').eq(cnt),'1');
          _wt.lockObj($('.questionAnswer4').eq(cnt),'');
          _wt.lockObj($('.questionMoney4').eq(cnt),'');
          _wt.lockObj($('.questionNextNo4').eq(cnt),'1');
          _wt.lockObj($('.questionAnswer5').eq(cnt),'');
          _wt.lockObj($('.questionMoney5').eq(cnt),'');
          _wt.lockObj($('.questionNextNo5').eq(cnt),'1');
          
        } else if(res[c].questionSel == '5'){
          _wt.lockObj($('.questionMoney').eq(cnt),'2');
          _wt.lockObj($('.questionNextNo').eq(cnt),'1');
          
          _wt.lockObj($('.questionAnswer1').eq(cnt),'');
          _wt.lockObj($('.questionMoney1').eq(cnt),'');
          _wt.lockObj($('.questionNextNo1').eq(cnt),'');
          _wt.lockObj($('.questionAnswer2').eq(cnt),'');
          _wt.lockObj($('.questionMoney2').eq(cnt),'');
          _wt.lockObj($('.questionNextNo2').eq(cnt),'');
          _wt.lockObj($('.questionAnswer3').eq(cnt),'');
          _wt.lockObj($('.questionMoney3').eq(cnt),'');
          _wt.lockObj($('.questionNextNo3').eq(cnt),'');
          _wt.lockObj($('.questionAnswer4').eq(cnt),'');
          _wt.lockObj($('.questionMoney4').eq(cnt),'');
          _wt.lockObj($('.questionNextNo4').eq(cnt),'');
          _wt.lockObj($('.questionAnswer5').eq(cnt),'');
          _wt.lockObj($('.questionMoney5').eq(cnt),'');
          _wt.lockObj($('.questionNextNo5').eq(cnt),'');
        }
        
        $('.questionMoney').eq(cnt).val(res[c].questionMoney);
        $('.questionNextNo').eq(cnt).val(res[c].questionNextNo);
        // $('.questionMoneyn').eq(cnt).val(res[c].questionMoneyn);
        // $('.questionNextNon').eq(cnt).val(res[c].questionNextNon);
        $('.questionAnswer1').eq(cnt).val(res[c].questionAnswer1);
        $('.questionMoney1').eq(cnt).val(res[c].questionMoney1);
        $('.questionNextNo1').eq(cnt).val(res[c].questionNextNo1);
        $('.questionAnswer2').eq(cnt).val(res[c].questionAnswer2);
        $('.questionMoney2').eq(cnt).val(res[c].questionMoney2);
        $('.questionNextNo2').eq(cnt).val(res[c].questionNextNo2);
        $('.questionAnswer3').eq(cnt).val(res[c].questionAnswer3);
        $('.questionMoney3').eq(cnt).val(res[c].questionMoney3);
        $('.questionNextNo3').eq(cnt).val(res[c].questionNextNo3);
        $('.questionAnswer4').eq(cnt).val(res[c].questionAnswer4);
        $('.questionMoney4').eq(cnt).val(res[c].questionMoney4);
        $('.questionNextNo4').eq(cnt).val(res[c].questionNextNo4);
        $('.questionAnswer5').eq(cnt).val(res[c].questionAnswer5);
        $('.questionMoney5').eq(cnt).val(res[c].questionMoney5);
        $('.questionNextNo5').eq(cnt).val(res[c].questionNextNo5);
        
        cnt++;
      }
      
      // 質問行追加
      $('#btn_question_add').unbind();
      $('#btn_question_add').bind('click',function(e){
        var genreT_Div = $('#question_template').clone();
        $('#msys_management_table_question').append(genreT_Div);
        $('#msys_management_table_question tr:last').css('display', '');
        
        // 質問行削除
        $('.btn_question_del').unbind();
        $('.btn_question_del').bind('click',function(e){
          var index = $(this).parent().parent().index();
          var _id = $('.questionId').eq(index-2).val();
          if(_id != ''){
            if(!confirm("選択した質問行を削除します。よろしいですか？")){
              return false;
            }
            _wt.deleteMquestion(_id);
          }
          $('#msys_management_table_question tr').eq(index).remove();
        });
        
        // 必須チェック
        // $('.questionReq').unbind();
        // $('.questionReq').bind('click',function(e){
        //   var index = $('.questionReq').index(this);
        //   if( $(this).prop('checked') ){
        //     _wt.lockObj($('.questionMoneyn').eq(index),'2');
        //     _wt.lockObj($('.questionNextNon').eq(index),'1');
            
        //   } else {
        //     _wt.lockObj($('.questionMoneyn').eq(index),'');
        //     _wt.lockObj($('.questionNextNon').eq(index),'');
        //   }
        // });
        
        // 回答形式プルダウン
        $('.questionSel').unbind();
        $('.questionSel').bind('change',function(e){
          var index = $('.questionSel').index(this);
          if( $(this).val() == '1' || $(this).val() == '2' || $(this).val() == '3' ){
            _wt.lockObj($('.questionMoney').eq(index),'');
            _wt.lockObj($('.questionNextNo').eq(index),'');
            
            _wt.lockObj($('.questionAnswer1').eq(index),'1');
            _wt.lockObj($('.questionMoney1').eq(index),'2');
            _wt.lockObj($('.questionNextNo1').eq(index),'1');
            _wt.lockObj($('.questionAnswer2').eq(index),'1');
            _wt.lockObj($('.questionMoney2').eq(index),'2');
            _wt.lockObj($('.questionNextNo2').eq(index),'1');
            _wt.lockObj($('.questionAnswer3').eq(index),'1');
            _wt.lockObj($('.questionMoney3').eq(index),'2');
            _wt.lockObj($('.questionNextNo3').eq(index),'1');
            _wt.lockObj($('.questionAnswer4').eq(index),'1');
            _wt.lockObj($('.questionMoney4').eq(index),'2');
            _wt.lockObj($('.questionNextNo4').eq(index),'1');
            _wt.lockObj($('.questionAnswer5').eq(index),'1');
            _wt.lockObj($('.questionMoney5').eq(index),'2');
            _wt.lockObj($('.questionNextNo5').eq(index),'1');
            
          } else if($(this).val() == '4'){
            _wt.lockObj($('.questionMoney').eq(index),'2');
            _wt.lockObj($('.questionNextNo').eq(index),'');
            
            _wt.lockObj($('.questionAnswer1').eq(index),'');
            _wt.lockObj($('.questionMoney1').eq(index),'');
            _wt.lockObj($('.questionNextNo1').eq(index),'1');
            _wt.lockObj($('.questionAnswer2').eq(index),'');
            _wt.lockObj($('.questionMoney2').eq(index),'');
            _wt.lockObj($('.questionNextNo2').eq(index),'1');
            _wt.lockObj($('.questionAnswer3').eq(index),'');
            _wt.lockObj($('.questionMoney3').eq(index),'');
            _wt.lockObj($('.questionNextNo3').eq(index),'1');
            _wt.lockObj($('.questionAnswer4').eq(index),'');
            _wt.lockObj($('.questionMoney4').eq(index),'');
            _wt.lockObj($('.questionNextNo4').eq(index),'1');
            _wt.lockObj($('.questionAnswer5').eq(index),'');
            _wt.lockObj($('.questionMoney5').eq(index),'');
            _wt.lockObj($('.questionNextNo5').eq(index),'1');
            
          } else if($(this).val() == '5'){
            _wt.lockObj($('.questionReq').eq(index),'on');
            
            _wt.lockObj($('.questionMoney').eq(index),'2');
            _wt.lockObj($('.questionNextNo').eq(index),'1');
            
            _wt.lockObj($('.questionAnswer1').eq(index),'');
            _wt.lockObj($('.questionMoney1').eq(index),'');
            _wt.lockObj($('.questionNextNo1').eq(index),'');
            _wt.lockObj($('.questionAnswer2').eq(index),'');
            _wt.lockObj($('.questionMoney2').eq(index),'');
            _wt.lockObj($('.questionNextNo2').eq(index),'');
            _wt.lockObj($('.questionAnswer3').eq(index),'');
            _wt.lockObj($('.questionMoney3').eq(index),'');
            _wt.lockObj($('.questionNextNo3').eq(index),'');
            _wt.lockObj($('.questionAnswer4').eq(index),'');
            _wt.lockObj($('.questionMoney4').eq(index),'');
            _wt.lockObj($('.questionNextNo4').eq(index),'');
            _wt.lockObj($('.questionAnswer5').eq(index),'');
            _wt.lockObj($('.questionMoney5').eq(index),'');
            _wt.lockObj($('.questionNextNo5').eq(index),'');
          }
        });
        
      });
      
      // 質問行削除
      $('.btn_question_del').unbind();
      $('.btn_question_del').bind('click',function(e){
        var index = $(this).parent().parent().index();
        var _id = $('.questionId').eq(index-2).val();
        if(_id != ''){
          if(!confirm("選択した質問行を削除します。よろしいですか？")){
            return false;
          }
          _wt.deleteMquestion(_id);
        }
        $('#msys_management_table_question tr').eq(index).remove();
      });
      
      // 必須チェック
      // $('.questionReq').unbind();
      // $('.questionReq').bind('click',function(e){
      //   var index = $('.questionReq').index(this);
      //   if( $(this).prop('checked') ){
      //     _wt.lockObj($('.questionMoneyn').eq(index),'2');
      //     _wt.lockObj($('.questionNextNon').eq(index),'1');
          
      //   } else {
      //     _wt.lockObj($('.questionMoneyn').eq(index),'');
      //     _wt.lockObj($('.questionNextNon').eq(index),'');
      //   }
      // });
      
      // 回答形式プルダウン
      $('.questionSel').unbind();
      $('.questionSel').bind('change',function(e){
        var index = $('.questionSel').index(this);
        if( $(this).val() == '1' || $(this).val() == '2' || $(this).val() == '3' ){
          _wt.lockObj($('.questionMoney').eq(index),'');
          _wt.lockObj($('.questionNextNo').eq(index),'');
          
          _wt.lockObj($('.questionAnswer1').eq(index),'1');
          _wt.lockObj($('.questionMoney1').eq(index),'2');
          _wt.lockObj($('.questionNextNo1').eq(index),'1');
          _wt.lockObj($('.questionAnswer2').eq(index),'1');
          _wt.lockObj($('.questionMoney2').eq(index),'2');
          _wt.lockObj($('.questionNextNo2').eq(index),'1');
          _wt.lockObj($('.questionAnswer3').eq(index),'1');
          _wt.lockObj($('.questionMoney3').eq(index),'2');
          _wt.lockObj($('.questionNextNo3').eq(index),'1');
          _wt.lockObj($('.questionAnswer4').eq(index),'1');
          _wt.lockObj($('.questionMoney4').eq(index),'2');
          _wt.lockObj($('.questionNextNo4').eq(index),'1');
          _wt.lockObj($('.questionAnswer5').eq(index),'1');
          _wt.lockObj($('.questionMoney5').eq(index),'2');
          _wt.lockObj($('.questionNextNo5').eq(index),'1');
          
        } else if($(this).val() == '4'){
          _wt.lockObj($('.questionMoney').eq(index),'2');
          _wt.lockObj($('.questionNextNo').eq(index),'');
          
          _wt.lockObj($('.questionAnswer1').eq(index),'');
          _wt.lockObj($('.questionMoney1').eq(index),'');
          _wt.lockObj($('.questionNextNo1').eq(index),'1');
          _wt.lockObj($('.questionAnswer2').eq(index),'');
          _wt.lockObj($('.questionMoney2').eq(index),'');
          _wt.lockObj($('.questionNextNo2').eq(index),'1');
          _wt.lockObj($('.questionAnswer3').eq(index),'');
          _wt.lockObj($('.questionMoney3').eq(index),'');
          _wt.lockObj($('.questionNextNo3').eq(index),'1');
          _wt.lockObj($('.questionAnswer4').eq(index),'');
          _wt.lockObj($('.questionMoney4').eq(index),'');
          _wt.lockObj($('.questionNextNo4').eq(index),'1');
          _wt.lockObj($('.questionAnswer5').eq(index),'');
          _wt.lockObj($('.questionMoney5').eq(index),'');
          _wt.lockObj($('.questionNextNo5').eq(index),'1');
          
        } else if($(this).val() == '5'){
          _wt.lockObj($('.questionReq').eq(index),'on');
          
          _wt.lockObj($('.questionMoney').eq(index),'2');
          _wt.lockObj($('.questionNextNo').eq(index),'1');
          
          _wt.lockObj($('.questionAnswer1').eq(index),'');
          _wt.lockObj($('.questionMoney1').eq(index),'');
          _wt.lockObj($('.questionNextNo1').eq(index),'');
          _wt.lockObj($('.questionAnswer2').eq(index),'');
          _wt.lockObj($('.questionMoney2').eq(index),'');
          _wt.lockObj($('.questionNextNo2').eq(index),'');
          _wt.lockObj($('.questionAnswer3').eq(index),'');
          _wt.lockObj($('.questionMoney3').eq(index),'');
          _wt.lockObj($('.questionNextNo3').eq(index),'');
          _wt.lockObj($('.questionAnswer4').eq(index),'');
          _wt.lockObj($('.questionMoney4').eq(index),'');
          _wt.lockObj($('.questionNextNo4').eq(index),'');
          _wt.lockObj($('.questionAnswer5').eq(index),'');
          _wt.lockObj($('.questionMoney5').eq(index),'');
          _wt.lockObj($('.questionNextNo5').eq(index),'');
        }
      });
      
      // 質問登録
      $('#btn_question_save').unbind();
      $('#btn_question_save').bind('click',function(e){
        if(!_wt.isBlankCheck($('#companySel'),'企業選択')){return;}
        
        if(!confirm("上記の状態で質問マスタを登録します。よろしいですか？")){
          return false;
        }
        
        _wt.createMquestion();
      });
      
    });
  };
  
  _wt.lockObj = function(obj,ptn){
    if(ptn == '1'){
      obj.addClass('TBL_SILVER').val('');
      obj.attr('readonly',true);
      
    } else if(ptn == '2'){
      obj.addClass('TBL_SILVER').val('0');
      obj.attr('readonly',true);
      
    } else if(ptn == '') {
      obj.removeClass('TBL_SILVER');
      obj.attr('readonly',false);
      
    } else if(ptn == 'on'){
      obj.prop('checked',true);
      
    }
  };
  
  io.socket.on('mcompany', function (e) {
    switch(e.verb){
      
      default:_wt.initMaster();
    }
  });
  
  // TODO:mquestion更新時処理
  
//////exports
  if('undefined' == typeof module){
    if( !window.ms ){window.ms = {};}
      window.ms.master = _wt;
  } else {
    module.exports = _wt;
  }
})();