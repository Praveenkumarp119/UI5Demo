sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text"
	
], function (Controller, Dialog, Button, ButtonType, Text) {
	"use strict";

	return Controller.extend("App.Simple_app.controller.Basics", {
		onInit: function () {
			debugger;
			var arr1 = {
				id: "63284298742",
				name: "Bill No.:",
				unit: "ABC402",
				desc: "1513512",
				sname: "Prajwal"
			};
			// Property Binding
			var searchmodel = new sap.ui.model.json.JSONModel();
			searchmodel.setData(arr1);
			this.getView().setModel(searchmodel);

			// this.getOwnerComponent().setModel(searchmodel, "ddoModel");
			// this.getOwnerComponent().getModel("ddoModel").refresh();
		},
		onMessageDialogPress: function (oEvent) {
			debugger;
			var dialog = new Dialog({
				title: 'Confirmation',
				type: 'Message',
				state: 'Information',
				content: new Text({
					text: 'Save Student Info.'
				}),
				beginButton: new Button({
					type: ButtonType.Emphasized,
					text: 'OK',
					press: function () {
						
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		}
	});
});