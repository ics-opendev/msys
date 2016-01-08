module.exports = function (grunt) {
	grunt.registerTask('prod', [
		'compileAssets',
// add below 2015.11.06
		'linkAssets'
//disable below 2015.11.06
//		'concat',
//		'uglify',
//		'cssmin',
//		'sails-linker:prodJs',
//		'sails-linker:prodStyles',
//		'sails-linker:devTpl',
//		'sails-linker:prodJsJade',
//		'sails-linker:prodStylesJade',
//		'sails-linker:devTplJade'
	]);
};
