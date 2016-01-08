/**
* Manswer.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    companyId       : {type: 'STRING',required: true},
    userId          : {type: 'STRING',required: true},
    projectNo       : {type: 'INTEGER',required: true},
    questionNo      : {type: 'STRING',required: true},
    sortNo          : 'INTEGER',
    backNo          : 'STRING',
    question        : 'STRING',
    questionSel     : 'STRING',
    answer1         : 'STRING',
    answer2         : 'STRING',
    answer3         : 'STRING',
    answer4         : 'STRING',
    answer5         : 'STRING',
    price1          : 'INTEGER',
    price2          : 'INTEGER',
    price3          : 'INTEGER',
    price4          : 'INTEGER',
    price5          : 'INTEGER',
    quantity1       : 'INTEGER',
    quantity2       : 'INTEGER',
    quantity3       : 'INTEGER',
    quantity4       : 'INTEGER',
    quantity5       : 'INTEGER',
    subTotal        : 'INTEGER'
  }
};

