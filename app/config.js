'use strict'

var app = angular.module("app");

app.constant('cmds', [
	{
		Cmd: '/help',
		Desc: 'Show list of available commands.'
	},
	{
		Cmd: '/wordCount',
		Desc: 'Sprekn reveals the number of words it has learned.'
	}
]);

