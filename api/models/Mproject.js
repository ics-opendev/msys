/**
* Mproject.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId       : {type: 'STRING',required: true},
    userId          : {type: 'STRING',required: true},
    projectNo       : {type: 'INTEGER',required: true},
    version         : {type: 'STRING',required: true},
    projectName     :'STRING',
    questionNo      :'STRING',
    totalPrice      :'INTEGER',
    endFlg          :'STRING',
    status          :'STRING',
    request         :'STRING'
  }
};

