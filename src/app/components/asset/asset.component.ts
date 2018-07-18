import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var window:any;
declare var $:any;

@Component({
  selector: 'asset-component',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss', '../share/css/base-panel.scss']
})

export class AssetComponent implements OnInit {
  assets:any = [];
  users:any = [];
  isLoading:any = false;
  totalAssets:number = 0;
  loadedAssets:number = 0;
  userInfo:any;
  newAsset:any = {};
  deletingObject:any;
  deletingType:any;
  deletingObjectIndex:any;
  deletingParentObject:any;
  confirmation:any = {
    btnLeftText: 'Yes',
    btnRightText: 'No',
    title: 'Confirmation',
    content: 'Are you sure you want to delete this?',
  };
  headerConfig:any = {
    menuLeft: true,
    loggedIn: true
  };

  constructor(private _router: Router, private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.assets = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self.totalAssets = 0;
      self.loadedAssets = 0;
      self._baseService.getBase('api/Person/' + self.userInfo.userInfo.UserSoid).then((res:any) => {
        if (res && res.Assets && res.Assets.length > 0) {
          self.totalAssets = res.Assets.length;
          $.each(res.Assets, function(idx, asset){
            if (asset.AssetSoid) {
              self._baseService.getBase('api/Asset/' + asset.AssetSoid).then((res:any) => {
                if (res && res.Soid) {
                  res.PurchaseDate = window.getDateInputFormat(res.PurchaseDate);
                  self.prepareAssetValues(res);
                  self.assets.push(res);
                }
                self.checkToStopLoading();
              });
            } else {
              self.checkToStopLoading();
            }
          });
        } else {
          self.isLoading = false;
        }
      });
      self.initNewAsset();
      self._baseService.getBase('api/Person').then((res:any) => {
        if (res && res.ok != false) {
          self.users = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  checkToStopLoading() {
    var self = this;
    self.loadedAssets += 1;
    if (self.totalAssets == self.loadedAssets) {
      self.isLoading = false;
      self.initScrollBar();
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  prepareAssetValues (asset, type:any = undefined) {
    var self = this;
    if ((!type || type=='owner') && asset.Owners) {
      $.each(asset.Owners, function(idx2, owner){
        if (owner.OwnershipStart) {
          owner.OwnershipStart = window.getDateInputFormat(owner.OwnershipStart);
        }
        if (owner.OwnershipEnd) {
          owner.OwnershipEnd = window.getDateInputFormat(owner.OwnershipEnd);
        }
      });
    }
  }

  handleAfterSaving(oldData, newData) {
    var deletedIndexes:any = [];
    for (var i = 0; i < oldData.length; i++) {
      var existedIndex = -1;
      for (var j =0; j < newData.length; j++) {
        if (oldData[i].Soid == newData[j].Soid) {
          existedIndex = j;
          break;
        }
      }
      if (existedIndex >= 0) {
        newData.splice(existedIndex, 1);
      } else {
        deletedIndexes.push(i);
      }
    }

    if (newData && newData.length > 0) {
      $.each(newData, function(index, item){
        oldData.push(item);
      });
    }

    if (deletedIndexes && deletedIndexes.length > 0) {
      for (var t = deletedIndexes.length - 1; t >= 0; t--) {
        oldData.splice(deletedIndexes[t], 1);
      }
    }
  }

  txtValueChange(event, type, fieldName, editingObject, parentObject:any = {}) {
    var self = this;
    var value:any = '';
    var boolInputFields = ['Alarm', 'Pool', 'Pool', 'Fenced', 'DivingBoard', 'PoolSlide', 'Pets'];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    var url = 'api/Asset/' + editingObject.Soid;
    if (type == 'asset') {
      url = 'api/Asset/' + editingObject.Soid;
    } else if (type == 'email') {
      url = 'api/Asset/' + editingObject.Soid;
    } else if (type == 'owner') {
      url = 'api/Asset/' + parentObject.Soid + '/UpdateAssetOwner/' + editingObject.Soid;
    }
    self._baseService.patchBase(url, data).then((res) => {
      if (res.Changed) {
        if (boolInputFields.indexOf(fieldName) >= 0) {
          var checked = (res.Data == 'true');
          $(event.target).prop( "checked", checked );
        } else {
          $(event.target).val(res.Data);
        }
      } else {
        if (!res.Value)
          res.Value = '';
        var dateFieldNames = ['PurchaseDate', 'OwnershipStart', 'OwnershipEnd'];
        if (dateFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }

  initNewAsset() {
    this.newAsset = {
      PersonSoid: this.userInfo.userInfo.UserSoid,
      PersonName: this.userInfo.userInfo.UserName,
      AssetType: 'Home',
      AssetName: ''
    };
  }

  txtAssetNameKeyUp() {
    if (this.newAsset.AssetName.trim() == "")
      $(".asset-name-ctn").addClass('has-error');
    else
      $(".asset-name-ctn").removeClass('has-error');
  }

  btnAddAssetClick() {
    this.initNewAsset();
    $("#modalAddAsset").modal('show');
  }

  btnSaveAssetClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddAsset");
    if (invalid) {
      return;
    }

    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var data = {AssetType: self.newAsset.AssetType, AssetName: self.newAsset.AssetName};
    self._baseService.postBase('api/Asset', data).then((res:any) => {
      if (res && res.Soid) {
        res.PurchaseDate = window.getDateInputFormat(res.PurchaseDate);
        self.assets.push(res);
        self.initScrollBar();
        self.newAsset.AssetSoid = res.Soid;
        self._baseService.postBase('api/Asset/AddAssetForPerson', self.newAsset).then((res:any) => {
          $(event.target).removeClass('btn-loading');
        });
        $("#modalAddAsset").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
    });
  }

  btnAddAssetOwnerClick(event, asset) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Asset/' + asset.Soid + '/AddAssetOwner';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        self.handleAfterSaving(asset.Owners, res.Owners);
        self.prepareAssetValues(asset, 'owner');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnDeleteClick(deletingObject, type, index, deletingParentObject) {
    this.deletingObject = deletingObject;
    this.deletingObjectIndex = index;
    this.deletingParentObject = deletingParentObject;
    this.deletingType = type;
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    var url:any = "";
    if (self.deletingType == 'owner') {
      url = 'api/Asset/' + self.deletingParentObject.Soid + '/DeleteAssetOwner/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'asset') {
      url = 'api/Asset/' + self.deletingObject.Soid
    }
    $(event.target).addClass('btn-loading');
    self._baseService.deleteBase(url).then((res)=>{
      if (self.deletingType == 'owner') {
        self.handleAfterSaving(self.assets[self.deletingObjectIndex].Owners, res.Owners);
        self.prepareAssetValues(self.assets[self.deletingObjectIndex], 'owner');
      } else {
        self.assets.splice(self.deletingObjectIndex, 1);
      }

      $("#confirmation_modal").modal('hide');
      $(event.target).removeClass('btn-loading');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }
}
