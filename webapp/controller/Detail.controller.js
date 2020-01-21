sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {

	return Controller.extend("sappress.sappress.controller.Detail", {

		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oRouter.getRoute("detail").attachPatternMatched(this.onDetailRouteHit.bind(this));

		},

		onDetailRouteHit: function (oEvent) {
			var sID = oEvent.getParameter("arguments").BusinessPartnerID;
			this.getView().getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getView().getModel().createKey("BusinessPartnerSet", {
					BusinessPartnerID: sID
				});
				this.getView().bindElement({
					path: "/" + sObjectPath,
					events: {
						change: function () {
							var oView = this.getView();
							if (!oView.getElementBinding().getBoundContext()) {
								this.oRouter.getTargets().display("notFound");
							}
						}.bind(this),
						dataRequested: function () {
							//this.getView().setBusy(true);
						},
						dataReceived: function () {
							this.getView().setBusy(false);
						}
					}
				});
			}.bind(this));
		},

		onNavButtonPressed: function () {
			this.oRouter.navTo("main");
		}
	});
});