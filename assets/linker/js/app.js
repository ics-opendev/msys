/**
 * app.js
 *
 */
(function() {
  
  window._top_msys_master_load = false;
  window._top_msys_entry_load = false;
  window._top_msys_customer_load = false;
  window._top_msys_project_load = false;
  window._top_msys_mobile_load = false;
  
  // 接続前処理
  if (typeof console !== 'undefined') {
    log('Connecting to Server...');
  }

  // Listen for Comet messages from Sails
  //////////////////////////////////////////////////////
  // new 0.10.5
  io.socket.on('connect', function() {
    console.log("接続されました");
    
    io.socket.on('disconnect', function(){
      console.log('user disconnected.try to reconnect');
      //io.connect();
    });

    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to 
    // the Sails.js server.
    ///////////////////////////////////////////////////////////

    //★暫定初期処理
    $(document).ready(function() {
      
      //momentロケール設定
      moment.locale('ja');

      //ローカル日付設定
      setTimeout(function(){
        if($('#current-local-time').size() == 0){
          setTimeout(arguments.callee, 100);
        }else{
          $('#current-local-time').toDate({
            format : 'm月d日(W) H時i分'
          });
        }
      },100);

    });
  
  });//document.ready
  //log('Socket is now connected and globally accessible as `socket`.\n' + 'e.g. to send a GET request to Sails, try \n' + '`socket.get("/", function (response) ' + '{ console.log(response); })`');


  //window.socket = socket;

  // Simple log function to keep the example simple
  function log() {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }

})();