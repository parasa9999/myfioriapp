sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device"
], function (Controller, Device) {
	"use strict";

	return Controller.extend("sappress.sappress.controller.Master", {

		onInit: function () {
			//reuse variables
			this.oList = this.getView().byId("list");
			this.oRouter = this.getOwnerComponent().getRouter();

			this.oRouter.getRoute("detail").attachEvent("patternMatched",
				this.onDetailRouteHit.bind(this));
			
			this.oRouter.getRoute("main").attachEvent("patternMatched",
				this.onMasterRouteHit.bind(this));
			
			this.oRouter.attachEvent("bypassed", function() {
				this.oList.removeSelections(true);
			}.bind(this));

			var that = this;
			this.oListBindingPromise = new Promise(
				function (resolve, reject) {
					that.getView().addEventDelegate({
						onBeforeFirstShow: function () {
							that.oList.getBinding("items").attachEventOnce("dataReceived",
								function (oEvent) {
									if (oEvent.getParameter("data")) {
										resolve();
									} else {
										reject();
									}
								}, this);
						}.bind(that)
					});
				});

		},

		onDetailRouteHit: function (oEvent) {
			var sBusinessPartnerID = oEvent.getParameter("arguments").BusinessPartnerID,
				oSelectedItem = this.oList.getSelectedItem();
			if (oSelectedItem && oSelectedItem.getBindingContext().getProperty("BusinessPartnerID") === sBusinessPartnerID) {
				return;
			} else if (!oSelectedItem) {
				this.oListBindingPromise.then(function () {
					this.selectAnItem(sBusinessPartnerID);
				}.bind(this));
			} else {
				this.selectAnItem(sBusinessPartnerID);
			}
		},

		selectAnItem: function (sBusinessPartnerID) {
			var sKey = this.getView().getModel().createKey("BusinessPartnerSet", {
				BusinessPartnerID: sBusinessPartnerID
			});

			var oItems = this.oList.getItems();
			oItems.some(function (oItem) {
				if (oItem.getBindingContext() && oItem.getBindingContext().getPath() === "/" + sKey) {
					this.oList.setSelectedItem(oItem);
					return;
				}
			}, this);
		},

		onItemPressed: function (oEvent) {
			var oItem = oEvent.getParameter("listItem") || oEvent.getSource(),
				sId = oItem.getBindingContext().getProperty("BusinessPartnerID");

			this.oRouter.navTo("detail", {
				BusinessPartnerID: sId
			}, false);
		},
		
		onMasterRouteHit: function() {
			if(Device.system.phone){
				return;
			}
			this.oListBindingPromise.then(function() {
				var oItems = this.oList.getItems();
				this.oList.setSelectedItem(oItems[0]);
				this.oRouter.navTo("detail", {
					BusinessPartnerID: oItems[0].getBindingContext().getProperty("BusinessPartnerID")
				});
			}.bind(this));
		},
		
		onUpdateFinished: function() {
			this.byId("pullToRefresh").hide();
		},
		
		onRefresh: function() {
			this.oList.getBinding("items").refresh();
		}
	});

});