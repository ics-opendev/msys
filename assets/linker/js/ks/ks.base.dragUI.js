// ksys/ksys.base.dragUI.js
// injected as "KsWidgetTmpl(ks.widgettmpl.js).ddui"
(function(window,undefined) {
  function KsDragUi(){
    var _proto = KsDragUi.prototype;
    
    // 【汎用】ドロップイベントをアタッチ
    _proto.attachDroppableForNewCas = function(_elm,acc,cla,cb){
        _elm.droppable({
            accept: acc,
            hoverClass: cla,
            drop: function(event, ui) {
                cb(event,ui);
            }
        });
    };
    
    // 【汎用】ドロップイベントをアタッチ(accept2つ用)
    _proto.attachDroppableForNewCas2 = function(_elm,acc1,acc2,cla,cb){
        var acc = '"' + acc1 + ',' + acc2 + '"';
        _elm.droppable({
            accept: acc,
            hoverClass: cla,
            drop: function(event, ui) {
                cb(event,ui);
            }
        });
    };
    
    // 【汎用】ドロップイベントをアタッチ(accept3つ用)
    _proto.attachDroppableForNewCas3 = function(_elm,acc1,acc2,acc3,cla,cb){
        var acc = '"' + acc1 + ',' + acc2 + ',' + acc3 + '"';
        _elm.droppable({
            accept: acc,
            hoverClass: cla,
            drop: function(event, ui) {
                cb(event,ui);
            }
        });
    };
    
    // appendTo   :helper のコンテナ要素を指定
    // containment:ドラッグの範囲を制限
    // scroll     :true に指定すると、ドラッグ中にオートスクロールが実行される
    _proto.attachDraggableForCast = function(_v,_c){
      _v.draggable({
        appendTo: 'body',
        containment: 'window',
        scroll: false,
        snapTolerance: 50,
        opacity: 0.5,
        distance: 5,
        //helper: "clone",
        helper: function( event ) {
          return $( "<div><span class='glyphicon glyphicon-plus-sign' ></span>" + _c.name + "　様</div>" );
        },
        stop: function(e, ui) {
      }});
    };
    
    _proto.attachDraggableForCustomer = function(_v,_c){
      _v.draggable({
        appendTo: 'body',
        containment: 'window',
        scroll: false,
        snapTolerance: 50,
        opacity: 0.5,
        distance: 5,
        helper: "clone",
        stop: function(e, ui) {
      }});
    };
  }
    //exports
    window.KsDragUi = KsDragUi;
})(window);