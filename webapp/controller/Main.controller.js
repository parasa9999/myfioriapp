sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device"
], function (Controller, Device) {
	"use strict";

	return Controller.extend("sappress.sappress.controller.Main", {
		onInit: function () {
			var sContentDensityClass = "";
			if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
				sContentDensityClass = "";
			} else if (!Device.support.touch) {
				sContentDensityClass = "sapUiSizeCompact";
			} else {
				sContentDensityClass = "sapUiSizeCozy";
			}
			this.getView().addStyleClass(sContentDensityClass);

			var oRootControl = this.byId("app");

			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				oRootControl.setBusy(false);
			});

			this.getOwnerComponent().getModel().attachMetadataFailed(
				function () {
					oRootControl.setBusy(false);
				});
		},

		backToHome: function () {
			this.getOwnerComponent().getRouter().navTo("main");
		}
	});
});