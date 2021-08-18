sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, History, Fragment, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("com.terraregia.ZDEMO_EVER2.controller.Detalle", {

		onInit: function () {
			var oViewModel = new JSONModel({
				Descripcion: "",
				Pais: "",
				Id: "",
				Mode: "M",
				Title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("titleEdicion"),
				TextoBoton: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("editar")
			});
			this.getView().setModel(oViewModel, "viewModel");

			this.getOwnerComponent().getRouter().getRoute("RouteDetalle").attachPatternMatched(this._onViewMatched, this);
		},
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getOwnerComponent().getRouter().navTo("RouteLista", {}, true);
			}
		},
		_onViewMatched: function (oEvent) {
			var sId = oEvent.getParameter("arguments").id;
			if (sId) {
				this._bindView(sId);
			}
		},
		_bindView: function (sId) {
			this.getView().bindElement({
				path: "/CabeceraSet('" + sId + "')"
			});
		},
		onEdit: function (oEvent) {
			var oView = this.getView();
			if (!this._oDialogCrear) {
				this._oDialogCrear = Fragment.load({
					id: oView.getId(),
					name: "com.terraregia.ZDEMO_EVER2.view.DialogCrear",
					controller: this
				}).then(function (oDialog) {
					oView.addDependent(oDialog);
					return oDialog;
				});
			}
			this._clearModel();
			var oItem = this.getView().getBindingContext().getObject();
			var oViewModel = this.getView().getModel("viewModel");
			oViewModel.setProperty("/Descripcion", oItem.Descripcion);
			oViewModel.setProperty("/Pais", oItem.Pais);
			oViewModel.setProperty("/Id", oItem.Id);

			this._oDialogCrear.then(function (oDialog) {
				oDialog.open();
			});
		},
		onCancelDialog: function (oEvent) {
			this._oDialogCrear.then(function (oDialog) {
				oDialog.close();
			});
		},
		_clearModel: function () {
			var oViewModel = this.getView().getModel("viewModel");
			oViewModel.setProperty("/Descripcion", "");
			oViewModel.setProperty("/Pais", "");
			oViewModel.setProperty("/Id", "");
		},
		onCrearCabecera: function (oEvent) {
			var oViewModel = this.getView().getModel("viewModel");
			var oItem = {
				Id: oViewModel.getProperty("/Id"),
				Descripcion: oViewModel.getProperty("/Descripcion"),
				Pais: oViewModel.getProperty("/Pais")
			};
			var sPath = "/CabeceraSet('" + oViewModel.getProperty("/Id") + "')";

			this.getView().getModel().update(sPath, oItem, {
				success: function (oData) {
					MessageBox.success("Registro actualizado con ID: " + oItem.Id);
				},
				error: function (oError) {
					MessageBox.error("Error al modificar.");
				}
			});

			this._oDialogCrear.then(function (oDialog) {
				oDialog.close();
			});
		}

	});

});