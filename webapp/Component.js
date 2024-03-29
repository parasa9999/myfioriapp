sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sappress/sappress/model/models",
	"sap/m/MessageBox"
], function (UIComponent, Device, models, MessageBox) {
	"use strict";

	return UIComponent.extend("sappress.sappress.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().getTargetHandler().setCloseDialogs(false);
			this.getRouter().initialize();

			this.getModel().attachEvent("metadataFailed", function (oEvent) {
				this._showServiceError(oEvent.getParameters().getResponse);
				this.getRouter().getTargets().display("notFound");
			}.bind(this));

			this.getModel().attachRequestFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				if (oParams.response.statusCode !== "400" && oParams.response.statusCode !== "404") {
					this.getRouter().getTargetHandler().setCloseDialogs(false);
					this.getRouter().getTargets().display("notFound");
					this._showServiceError(oParams.response);
				}
			}, this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},

		_showServiceError: function (sDetails) {
			if (this._bMessageOpen) {
				return;
			}
			this._bMessageOpen = true;
			MessageBox.error("An error occurred", {
				details: sDetails,
				actions: [MessageBox.Action.CLOSE],
				onClose: function () {
					this._bMessageOpen = false;
				}.bind(this)
			});
		}
	});
});