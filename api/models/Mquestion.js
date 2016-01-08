/**
* Mquestion.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId       : {type: 'STRING',required: true},
    questionNo      : {type: 'STRING',required: true},
    sortNo          : 'INTEGER',
    version         : {type: 'STRING',required: true},
    question        : {type: 'STRING',required: true},
    questionReq     : 'STRING',
    questionQua     : 'STRING',
    questionSel     : 'STRING',
    questionMoney   : 'INTEGER',
    questionNextNo  : 'STRING',
    questionAnswer1 : 'STRING',
    questionMoney1  : 'INTEGER',
    questionNextNo1 : 'STRING',
    questionAnswer2 : 'STRING',
    questionMoney2  : 'INTEGER',
    questionNextNo2 : 'STRING',
    questionAnswer3 : 'STRING',
    questionMoney3  : 'INTEGER',
    questionNextNo3 : 'STRING',
    questionAnswer4 : 'STRING',
    questionMoney4  : 'INTEGER',
    questionNextNo4 : 'STRING',
    questionAnswer5 : 'STRING',
    questionMoney5  : 'INTEGER',
    questionNextNo5 : 'STRING'
    // questionMoneyn  : 'INTEGER',
    // questionNextNon : 'STRING'
  }
};

