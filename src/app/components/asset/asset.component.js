"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var base_service_1 = require("../../services/base.service");
var AssetComponent = (function () {
    function AssetComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.assets = [];
        this.users = [];
        this.isLoading = false;
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.newAsset = {};
        this.confirmation = {
            btnLeftText: 'Yes',
            btnRightText: 'No',
            title: 'Confirmation',
            content: 'Are you sure you want to delete this?',
        };
        this.headerConfig = {
            menuLeft: true,
            loggedIn: true
        };
    }
    AssetComponent.prototype.ngOnInit = function () {
        var self = this;
        self.assets = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self.totalAssets = 0;
            self.loadedAssets = 0;
            self._baseService.getBase('api/Person/' + self.userInfo.userInfo.UserSoid).then(function (res) {
                if (res && res.Assets && res.Assets.length > 0) {
                    self.totalAssets = res.Assets.length;
                    $.each(res.Assets, function (idx, asset) {
                        if (asset.AssetSoid) {
                            self._baseService.getBase('api/Asset/' + asset.AssetSoid).then(function (res) {
                                if (res && res.Soid) {
                                    res.PurchaseDate = window.getDateInputFormat(res.PurchaseDate);
                                    self.prepareAssetValues(res);
                                    self.assets.push(res);
                                }
                                self.checkToStopLoading();
                            });
                        }
                        else {
                            self.checkToStopLoading();
                        }
                    });
                }
                else {
                    self.isLoading = false;
                }
            });
            self.initNewAsset();
            self._baseService.getBase('api/Person').then(function (res) {
                if (res && res.ok != false) {
                    self.users = res;
                }
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    AssetComponent.prototype.checkToStopLoading = function () {
        var self = this;
        self.loadedAssets += 1;
        if (self.totalAssets == self.loadedAssets) {
            self.isLoading = false;
            self.initScrollBar();
        }
    };
    AssetComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    AssetComponent.prototype.prepareAssetValues = function (asset, type) {
        if (type === void 0) { type = undefined; }
        var self = this;
        if ((!type || type == 'owner') && asset.Owners) {
            $.each(asset.Owners, function (idx2, owner) {
                if (owner.OwnershipStart) {
                    owner.OwnershipStart = window.getDateInputFormat(owner.OwnershipStart);
                }
                if (owner.OwnershipEnd) {
                    owner.OwnershipEnd = window.getDateInputFormat(owner.OwnershipEnd);
                }
            });
        }
    };
    AssetComponent.prototype.handleAfterSaving = function (oldData, newData) {
        var deletedIndexes = [];
        for (var i = 0; i < oldData.length; i++) {
            var existedIndex = -1;
            for (var j = 0; j < newData.length; j++) {
                if (oldData[i].Soid == newData[j].Soid) {
                    existedIndex = j;
                    break;
                }
            }
            if (existedIndex >= 0) {
                newData.splice(existedIndex, 1);
            }
            else {
                deletedIndexes.push(i);
            }
        }
        if (newData && newData.length > 0) {
            $.each(newData, function (index, item) {
                oldData.push(item);
            });
        }
        if (deletedIndexes && deletedIndexes.length > 0) {
            for (var t = deletedIndexes.length - 1; t >= 0; t--) {
                oldData.splice(deletedIndexes[t], 1);
            }
        }
    };
    AssetComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject) {
        if (parentObject === void 0) { parentObject = {}; }
        var self = this;
        var value = '';
        var boolInputFields = ['Alarm', 'Pool', 'Pool', 'Fenced', 'DivingBoard', 'PoolSlide', 'Pets'];
        if (boolInputFields.indexOf(fieldName) >= 0) {
            value = $(event.target).prop('checked');
        }
        else {
            value = $(event.target).val().trim();
        }
        var data = {
            FieldName: fieldName,
            Data: value
        };
        var url = 'api/Asset/' + editingObject.Soid;
        if (type == 'asset') {
            url = 'api/Asset/' + editingObject.Soid;
        }
        else if (type == 'email') {
            url = 'api/Asset/' + editingObject.Soid;
        }
        else if (type == 'owner') {
            url = 'api/Asset/' + parentObject.Soid + '/UpdateAssetOwner/' + editingObject.Soid;
        }
        self._baseService.patchBase(url, data).then(function (res) {
            if (res.Changed) {
                if (boolInputFields.indexOf(fieldName) >= 0) {
                    var checked = (res.Data == 'true');
                    $(event.target).prop("checked", checked);
                }
                else {
                    $(event.target).val(res.Data);
                }
            }
            else {
                if (!res.Value)
                    res.Value = '';
                var dateFieldNames = ['PurchaseDate', 'OwnershipStart', 'OwnershipEnd'];
                if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    AssetComponent.prototype.initNewAsset = function () {
        this.newAsset = {
            PersonSoid: this.userInfo.userInfo.UserSoid,
            PersonName: this.userInfo.userInfo.UserName,
            AssetType: 'Home',
            AssetName: ''
        };
    };
    AssetComponent.prototype.txtAssetNameKeyUp = function () {
        if (this.newAsset.AssetName.trim() == "")
            $(".asset-name-ctn").addClass('has-error');
        else
            $(".asset-name-ctn").removeClass('has-error');
    };
    AssetComponent.prototype.btnAddAssetClick = function () {
        this.initNewAsset();
        $("#modalAddAsset").modal('show');
    };
    AssetComponent.prototype.btnSaveAssetClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddAsset");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var data = { AssetType: self.newAsset.AssetType, AssetName: self.newAsset.AssetName };
        self._baseService.postBase('api/Asset', data).then(function (res) {
            if (res && res.Soid) {
                res.PurchaseDate = window.getDateInputFormat(res.PurchaseDate);
                self.assets.push(res);
                self.initScrollBar();
                self.newAsset.AssetSoid = res.Soid;
                self._baseService.postBase('api/Asset/AddAssetForPerson', self.newAsset).then(function (res) {
                    $(event.target).removeClass('btn-loading');
                });
                $("#modalAddAsset").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
        });
    };
    AssetComponent.prototype.btnAddAssetOwnerClick = function (event, asset) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Asset/' + asset.Soid + '/AddAssetOwner';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                self.handleAfterSaving(asset.Owners, res.Owners);
                self.prepareAssetValues(asset, 'owner');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    AssetComponent.prototype.btnDeleteClick = function (deletingObject, type, index, deletingParentObject) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingParentObject = deletingParentObject;
        this.deletingType = type;
        $("#confirmation_modal").modal('show');
    };
    AssetComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        var url = "";
        if (self.deletingType == 'owner') {
            url = 'api/Asset/' + self.deletingParentObject.Soid + '/DeleteAssetOwner/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'asset') {
            url = 'api/Asset/' + self.deletingObject.Soid;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.deleteBase(url).then(function (res) {
            if (self.deletingType == 'owner') {
                self.handleAfterSaving(self.assets[self.deletingObjectIndex].Owners, res.Owners);
                self.prepareAssetValues(self.assets[self.deletingObjectIndex], 'owner');
            }
            else {
                self.assets.splice(self.deletingObjectIndex, 1);
            }
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    AssetComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    return AssetComponent;
}());
AssetComponent = __decorate([
    core_1.Component({
        selector: 'asset-component',
        templateUrl: './asset.component.html',
        styleUrls: ['./asset.component.scss', '../../share/css/base-panel.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], AssetComponent);
exports.AssetComponent = AssetComponent;
//# sourceMappingURL=asset.component.js.map