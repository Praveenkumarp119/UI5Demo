/*global QUnit*/

sap.ui.define([
	"App/Simple_app/controller/Basics.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Basics Controller");

	QUnit.test("I should test the Basics controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});