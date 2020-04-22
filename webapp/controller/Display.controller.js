sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
	// "service/APP_service/controller/js/jspdf",
	// "service/APP_service/controller/js/jspdf.plugin.autotable"
], function (Controller,Export,ExportTypeCSV) {
	"use strict";

	return Controller.extend("service.APP_service.controller.Display", {
		onInit: function () {
			this.PerDtails=[];
			//S
		var arr = [{
			value:  "sumit",
			display: "0.00"
		}];
		
		var model = new sap.ui.model.json.JSONModel(arr);
		this.getOwnerComponent().setModel(model,"modelpraveen");
		this.getOwnerComponent().getModel("modelpraveen").refresh();
		
	
		
			var date = new Date();
			var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
			var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
			this.byId("frmdate").setDateValue(firstDay);
			this.byId("todate").setDateValue(lastDay);
		},
		Valuehelporg: function () {
			debugger;
			if (!this.ddofrag) {
				this.ddofrag = sap.ui.xmlfragment("service.APP_service.fragments.emp", this);
				this.getView().addDependent(this.ddofrag);
			}

			this.getOwnerComponent().getModel().read("/OrgUnitHelpSet", {
				async: true,
				success: function (oData, oResponse) {
					debugger;
					var searchmodel = new sap.ui.model.json.JSONModel(oData);
					this.getOwnerComponent().setModel(searchmodel, "orgModel");
					this.getOwnerComponent().getModel("orgModel").refresh();
					this.ddofrag.open();
				}.bind(this),
				error: function (error) {

				}
			});

		},

		orgConfirm: function (oEvt) {
			debugger;
			var id = oEvt.getParameters().selectedItem.getTitle();
			var desc = oEvt.getParameters().selectedItem.getDescription();
			var fnlval = id + " (" + desc + ")";

			this.byId("ddo").setValue(fnlval);
			this.byId("ddo").setValueState("None");
		},

		Addhelporg: function () {
			debugger;
			if (!this.addfrag) {
				this.addfrag = sap.ui.xmlfragment("service.APP_service.fragments.add", this);
				this.getView().addDependent(this.addfrag);
			}

			this.getOwnerComponent().getModel("addModel").read("/LoanTransactionHelpSet", {
				async: true,
				success: function (oData, oResponse) {
					debugger;
					var addmodel = new sap.ui.model.json.JSONModel(oData);
					this.getOwnerComponent().setModel(addmodel, "orgModel1");
					this.getOwnerComponent().getModel("orgModel1").refresh();
					this.addfrag.open();
				}.bind(this),
				error: function (error) {

				}
			});
		},
		addConfirm: function (oEvent) {
			debugger;
			// var loanId = oEvt.getParameters().selectedItem.mProperties.title;
			// var ltype = oEvt.getParameters().selectedItem.mProperties.description;
			// var fnlval = loanId + " (" + ltype + ")";

			this.items = [];
			this.oSelectedItem = oEvent.getParameter("selectedItem");
			var sPath = oEvent.getParameter("selectedContexts");
			var sop = this.getView().byId("add");
			if (sPath !== undefined) {
				sPath.map(function (oContext) {
					sop.addToken(new sap.m.Token({
						text: oContext.getObject().TransactionNumber
					}));
				});
			}
			// this.protype = sop.getTokens()[0].getProperty("ProductType");

			// this.byId("add").setValue(fnlval);
			this.byId("add").setValueState("None");
		},

		// search function
		onpressSearch: function () {
			debugger;

			var sorg = this.getView().byId("ddo").getValue();
			var sfdate = this.getView().byId("frmdate").getValue();
			var sldate = this.getView().byId("todate").getValue();

			if (sorg !== "" && sfdate !== "" && sldate !== "") {

				var frdate = this.dateConverstion(sfdate);
				var tdate = this.dateConverstion(sldate);

				var id = sorg.split(" (")[0];
				var desc = sorg.split("(")[1].slice(0, -1);

				var filterarr = [];
				filterarr.push(new sap.ui.model.Filter("OrgId", sap.ui.model.FilterOperator.EQ, id));
				filterarr.push(new sap.ui.model.Filter("FromDate", sap.ui.model.FilterOperator.EQ, frdate));
				filterarr.push(new sap.ui.model.Filter("ToDate", sap.ui.model.FilterOperator.EQ, tdate));
				this.getOwnerComponent().getModel().read("/LeaveAuditSet", {
					filters: filterarr,
					success: function (oData, oResponse) {
						debugger;
						this.exptdata = oData.results;
						var tabdata = oData.results;
						var exdata= [];
						var addmodel = new sap.ui.model.json.JSONModel(oData);
						var eModel=new sap.ui.model.json.JSONModel(oData.results);
						this.getOwnerComponent().setModel(addmodel, "aModel");
						this.getOwnerComponent().getModel("aModel").refresh();
						this.byId("tabpanel").setExpanded(true);
						// exModel = new sap.ui.model.json.JSONModel(oData.results);
						this.byId("selection").setExpanded(false);
						exdata.push(tabdata);
					}.bind(this),
					error: function (error) {

					}
				});

			} else if (sorg === "") {
				this.getView().byId("ddo").setValueState("Error");
				sap.m.MessageToast.show("Please enter First name!");
			} else if (sfdate === "") {
				this.getView().byId("frmdate").setValueState("Error");
				sap.m.MessageToast.show("Please enter From Date!");
			} else if (sldate === "") {
				this.getView().byId("todate").setValueState("Error");
				sap.m.MessageToast.show("Please enter To Date!");
			}

		},
		onLiveChange: function (OEvt) {
			debugger;
			OEvt.getSource().setValueState("None");
		},
		onchangeFrmDate: function (OEvt) {
			debugger;
			OEvt.getSource().setValueState("None");
		},
		onchangeToDate: function (oevt) {
			debugger;
			oevt.getSource().setValueState("None");
		},

		// date function
		dateConverstion: function (dt) {
			debugger;
			var y = dt.slice(0, 4);
			var m = dt.slice(4, 6);
			var day = dt.slice(6, 8);
			var dt = y + "-" + m + "-" + day + "T00:00:00"
			return dt;
		},
		onSearch: function (oEvent) {
			var sValue = oEvent.getSource().getValue();
			var oFilter = new sap.ui.model.Filter([new sap.ui.model.Filter("XalertSource", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("PersonalNum", sap.ui.model.FilterOperator.Contains, sValue),
				new sap.ui.model.Filter("EmpName", sap.ui.model.FilterOperator.Contains, sValue),

			]);
			var oBinding = this.getView().byId("mDetails").getBinding("rows");
			oBinding.filter([oFilter]);

		},
		Exporttabledata: function (exdata) {
                debugger;
                /*if(this.exptdata !== undefined)
                {
                	var exdata = this.exptdata;
                }
              var empomodel = new sap.ui.model.json.JSONModel({
			results: exdata
                });*/
			
			var oExport = new sap.ui.core.util.Export({

				exportType: new sap.ui.core.util.ExportTypeCSV(),

				// Pass in the model created above
				 models: this.byId("mDetails").getModel("aModel"), //empomodel,

				// binding information for the rows aggregation
				rows: {
					path: "/results"
				},

				columns: [{
						name: "Empolee Number",
						template: {
							content: "{PersonalNum}"
						}
					},

					{
						name: "Employee Name",
						template: {
							content: "{EmpName}"
						}
					}, {
						name: "Designation",
						template: {
							content: "{Designation}"
						}
					}, {
						name: "Personal Area",
						template: {
							content: "{PersArea}"
						}
					}, {
						name: "Leave Type",
						template: {
							content: "{LeaveType}"
						}
					}

				]
			});

			// download exported file
			oExport.saveFile("Payrollrun Summary" + Date()).catch(function (oError) {
				sap.m.MessageToast.show("Error when downloading data.\n\n", +oError);
			}).then(function () {
				oExport.destroy();
			});

		},
		onHandleExportPdf: function()
		{
			debugger;
			// var that = this;
			var oFromDate = this.getView().byId("frmdate").getValue();
			// oFromDate = oFromDate.substr(6, 2) + "-" + oFromDate.substr(4, 2) + "-" + oFromDate.substr(0, 4);
			var oToDate = this.getView().byId("todate").getValue();
			// oToDate = oToDate.substr(6, 2) + "-" + oToDate.substr(4, 2) + "-" + oToDate.substr(0, 4);
			// var oDdoCode = this.getView().byId("ddo").getValue();
			// var orgdata = this.getView().byId("orgid").getValue();
				var TableData = this.getView().byId("mDetails").getModel("aModel").getData().results;
			var getImageFromUrl = function (url, callback) {
				var img = new Image();
				img.onError = function () {
					alert('Cannot load image: "' + url + '"');
				};
				img.onload = function () {
					callback(img);
				};
				img.src = url;
			};
			var createPDF = function (imgData) {

				var objTotal = {};
				// objTotal.CfmsId = "Total";
				// objTotal.Amount = that.getView().byId("idSumofAmt").getText();
				//	this.tablecount = TableData.length;
				// var j = TableData.length - 1;
				// if (TableData.length >= 1) {
				// 	if (TableData[TableData.length - 1].CfmsId !== "Total") {
				// 		TableData.push(objTotal);
				// 	}
				// }
				var columns = ["Empolee Number", "Employe Name", "Designation", "Personal Area", "Leave Type"
				];

				var dataPay = [];
				for (var i = 0; i < TableData.length; i++) {
					dataPay[i] = [TableData[i].PersonalNum, TableData[i].EmpName, TableData[i].Designation, TableData[i].PersArea,
						TableData[i].LeaveType
					];
				}

				var doc = new jsPDF('l', 'pt', 'a3');
				// var oNoRecords = this.tablecount; // that.getView().byId("idNoRecords").getText();
				doc.addImage(imgData, 'PNG', 90, 5, 1024, 65, 'test');
				doc.text("Report Summary:" + " [" + oFromDate + " To " + oToDate + "] " , 45, 100, {
					contentWidth: 9
				});
				doc.text("Records:" + dataPay.length, 1000, 100, {
					contentWidth: 9
				});
				doc.autoTable(columns, dataPay, {
					margin: {
						top: 120
					}
				});
				doc.save("Report Summary" + Date());
			};
			var RootPath = jQuery.sap.getModulePath("service.APP_service");
			getImageFromUrl(RootPath + '/controller/js/CFMSHeader.png', createPDF);
		},
		Valuehelpdemo: function(oEvt){
			debugger;
			
				if (!this.addfrg) {
				this.addfrg = sap.ui.xmlfragment(
					"service.APP_service.fragments.demo",
					this
				);
				this.getView().addDependent(this.addfrg);

			}
			this.addfrg.open();
			
				var person = {

				pname:"praveen",
				pno: "9999567",
				padd: "Bangalore",
				paddhar: "123445"
	
				};
			this.PerDtails.push(person);

			// var searchmodel = new sap.ui.model.json.JSONModel(oData);
			var detModel = new sap.ui.model.json.JSONModel({
				results: this.PerDtails
			});
			this.getOwnerComponent().setModel(detModel, "perModel");
			this.getOwnerComponent().getModel("perModel").refresh();
			// this.byId("tabpanel").setExpanded(true);

		}

	});
});