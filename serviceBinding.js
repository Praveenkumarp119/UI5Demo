function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZTR_LOAN_DEBT_PAYEMENT_GW_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}