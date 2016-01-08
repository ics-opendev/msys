/******
 * ms.project.js
 * マスタ画面上のエリアを操作するJS
 * 
 */
(function() {
  var _wt = new KsWidgetTmpl();
  
  _wt.initProject = function(){
    console.log('initProject() called.');
    
    // 【企業マスタ】企業検索
    _wt.findMcompany(function(res){
      // 初期化
      $('#companySel option').remove();
      $('#companySel').append('<option value="">企業を選択</option>');
      
      var cnt = 1;
      for(var c in res){
        var o_company = '<option value="' + res[c].companyId + '">' + res[c].companyName + '</option>';
        $('#companySel').append(o_company);
        
        cnt++;
      }
      
      // 企業プルダウン
      $('#companySel').unbind();
      $('#companySel').bind('change',function(e){
        _wt.initUserProject($(this).val());
      });
      
    });
    
    // 「戻る」ボタン
    $('#project-back').unbind();
    $('#project-back').bind('click',function(e){
      location.href = "/msys/main";
    });
  };
  
  // 選択企業の案件一覧抽出
  _wt.initUserProject = function(_companyId){
    console.log('initUserProject() called.');
    
    // 初期化
    var delindex = $('.name').parent().parent().index();
    for( var i = 1; i < delindex; i++ ) {
      $("#msys_management_table_project tr:last").remove();
    }
    
    // 案件テーブル検索
    _wt.findMprojectAll(_companyId,function(res){
      var cnt = 1;
      for(var c in res){
        var projectT_Div = $('#project_template').clone();
        $('#msys_management_table_project').append(projectT_Div);
        $('#msys_management_table_project tr:last').css('display', '');
        $('.projectName').eq(cnt).text(res[c].projectName);
        $('.totalPrice').eq(cnt).text(res[c].totalPrice);
        if(res[c].request != ''){
          $('.request').eq(cnt).text('依頼済');
        }
        
        // 案件作成者情報検索
        _wt.setProjectUser(cnt,res[c].userId);
        
        cnt++;
      }
    });
  };
  
  // 案件作成者情報検索
  _wt.setProjectUser= function(cnt,_userId){
    // 案件テーブル検索
    _wt.findProjectMuser(_userId,function(res){
      $('.name').eq(cnt).text(res[0].name);
      $('.mail').eq(cnt).text(res[0].mail);
      $('.tel').eq(cnt).text(res[0].tel);
    });
  };
  
//////exports
  if('undefined' == typeof module){
    if( !window.ms ){window.ms = {};}
      window.ms.project = _wt;
  } else {
    module.exports = _wt;
  }
})();