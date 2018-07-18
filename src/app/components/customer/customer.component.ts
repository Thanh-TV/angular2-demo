import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'customer-component',
  templateUrl: './customer.component.html',
  styleUrls: ['../share/css/base-panel.scss', '../share/css/financial-base.scss', './customer.component.scss']
})

export class CustomerComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  customers:any = [];
  users:any = [];
  offices:any = [];
  officeId:any;
  invoiceItems:any = [];
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
  newCustomer:any = {};
  newPayment:any = {};
  newInvoice:any = {};
  currentCustomer:any;
  newInvoiceSubTotal:any = 0;
  newInvoiceTotal:any = 0;

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.customers = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.fetchData();
      self._baseService.getBase('api/Person').then((res:any) => {
        if (res && res.ok != false) {
          self.users = res;
        }
      });
      self._baseService.getBase('api/Office').then((res:any) => {
        if (res && res.ok != false) {
          self.offices = res;
          if (self.offices.length > 0) {
            var office:any = self.offices[0];
            self.officeId = office.Soid;
            self.invoiceItems = [];
            $.each(office.PriceLists, function(idx, priceList){
              $.each(priceList.Items, function(idx, priceListItem){
                self.invoiceItems.push({
                  Soid: priceListItem.Soid,
                  Name: priceListItem.Item,
                  UnitPrice: priceListItem.UnitPrice,
                  UnitOfMeasure: priceListItem.UnitOfMeasure
                });
              });
            });
          }
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  fetchData() {
    var self = this;
    self.isLoading = true;
    var url:any = 'api/Customer';
    self._baseService.getBase(url).then((res:any) => {
      if (res && res.ok != false) {
        self.customers = res;
        $.each(self.customers, function(idx, customer){
          self.prepareCustomerValues(customer);
        });
      }
      self.isLoading = false;
      self.initScrollBar();
    });
  }

  prepareCustomerValues (customer, type:any = undefined) {
    var self = this;
    if ((!type || type=='visit') && customer.Visits) {
      $.each(customer.Visits, function(idx, visit){
        if (visit.VisitDate) {
          visit.VisitDate = window.getDateTimeInputFormat(visit.VisitDate);
        }
      });
    }

    if ((!type || type=='invoice') && customer.Invoices) {
      $.each(customer.Invoices, function(idx1, invoice){
        if (invoice.InvoicedOn) {
          invoice.InvoicedOn = window.getDateTimeInputFormat(invoice.InvoicedOn);
          invoice.DueOn = window.getDateTimeInputFormat(invoice.DueOn);
        }
      });
    }

    if ((!type || type=='payment') && customer.Payments) {
      $.each(customer.Payments, function(idx2, payment){
        if (payment.PaidOn) {
          payment.PaidOn = window.getDateTimeInputFormat(payment.PaidOn);
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

  btnDeleteClick(deletingObject, deletingType, index, deletingParentObject) {
    this.deletingObject = deletingObject;
    this.deletingObjectIndex = index;
    this.deletingType = deletingType;
    this.deletingParentObject = deletingParentObject;
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = "";
    if (self.deletingType == 'visit') {
      url = 'api/Customer/' + self.deletingParentObject.Soid + '/DeleteCustomerVisit/' + self.deletingObject.Soid;
    } if (self.deletingType == 'invoice') {
      url = 'api/Customer/' + self.deletingParentObject.Soid + '/DeleteCustomerInvoice/' + self.deletingObject.Soid;
    } if (self.deletingType == 'transaction') {
      url = 'api/Customer/' + self.deletingParentObject.Soid + '/DeleteCustomerTransaction/' + self.deletingObject.Soid;
    } if (self.deletingType == 'payment') {
      url = 'api/Customer/' + self.deletingParentObject.Soid + '/DeleteCustomerPayment/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'customer') {
      url = 'api/Customer/' + self.deletingObject.Soid;
    }

    self._baseService.deleteBase(url).then((res)=>{
      if (self.deletingType == 'visit') {
        self.handleAfterSaving(self.customers[self.deletingObjectIndex].Visits, res.Visits);
        self.prepareCustomerValues(self.customers[self.deletingObjectIndex], 'visit');
      } if (self.deletingType == 'invoice') {
        self.handleAfterSaving(self.customers[self.deletingObjectIndex].Invoices, res.Invoices);
        self.prepareCustomerValues(self.customers[self.deletingObjectIndex], 'invoice');
      } if (self.deletingType == 'transaction') {
        self.handleAfterSaving(self.customers[self.deletingObjectIndex].Transactions, res.Transactions);
        self.prepareCustomerValues(self.customers[self.deletingObjectIndex], 'transaction');
      } if (self.deletingType == 'payment') {
        self.handleAfterSaving(self.customers[self.deletingObjectIndex].Payments, res.Payments);
        self.prepareCustomerValues(self.customers[self.deletingObjectIndex], 'payment');
      } else if (self.deletingType == 'customer') {
        self.customers.splice(self.deletingObjectIndex, 1);
      }
      $("#confirmation_modal").modal('hide');
      $(event.target).removeClass('btn-loading');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddCustomerClick() {
    this.initNewCustomer();
    $("#modalAddCustomer").modal('show');
  }

  initNewCustomer() {
    this.newCustomer = {
      PersonSoid: '',
      OfficeSoid: ''
    };
  }

  initNewPayment() {
    this.newPayment = {
      Checks: [{
        CheckNumber: '',
        Amount: 0,
        BankName: '',
        CardHolder: ''
      }],
      Credits: [{
        CardNumber: '',
        Amount: 0,
        BankName: '',
        CardHolder: ''
      }],
      ReceiptNumber: "",
      PaidOn: window.getDateTimeInputFormat(new Date()),
      Amount: 0,
      PaymentType: "",
      PaymentInfo: "",
      Coins001: 0,
      Coins005: 0,
      Coins010: 0,
      Coins025: 0,
      Bills001: 0,
      Bills002: 0,
      Bills005: 0,
      Bills010: 0,
      Bills020: 0,
      Bills050: 0,
      Bills100: 0
    };
  }

  initNewInvoice() {
    this.newInvoice = {
      DueOn: window.getDateTimeInputFormat(new Date()),
      InvoicedOn: window.getDateTimeInputFormat(new Date()),
      InvoiceNumber: "",
      Label: "",
      Notes: "",
      StaffSoid: this.userInfo.userInfo.UserSoid,
      StaffName: this.userInfo.userInfo.ScreenName,
      Items: [this.initNewInvoiceItem()]
    };
  }

  initNewInvoiceItem() {
    return {
      Item: "",
      ListItemSoid: "",
      ModuleName: "",
      Price: 0,
      Quantity: 0,
      UnitOfMeasure: "",
      UnitPrice: 0
    };
  }

  listItemChange(item) {
    var self = this;
    if (item.ListItemSoid) {
      var selectedItems = self.invoiceItems.filter(function(e){
        return e.Soid == item.ListItemSoid;
      });
      if (selectedItems.length > 0) {
        var selectedItem:any = selectedItems[0];
        item.UnitPrice = selectedItem.UnitPrice;
        item.UnitOfMeasure = selectedItem.UnitOfMeasure;
        item.Item = selectedItem.Name;
      }
    } else {
      item.UnitPrice = 0,
      item.Item = "";
      item.UnitOfMeasure = "";
      item.Quantity = 0;
      item.Price = 0;
    }

    self.txtNewInvoiceChange(item);
  }

  txtNewInvoiceChange(item) {
    if (item.ListItemSoid) {
      var price:any = (item.UnitPrice || 0) * 100;
      item.Price = price * (item.Quantity || 0);
    } else {
      item.Price = 0;
    }
    this.calculateSubTotal();
  }

  calculateSubTotal() {
    var self = this;
    var subTotal:any = 0;
    if (self.newInvoice.Items.length > 0) {
      $.each(self.newInvoice.Items, function (idx, item){
        subTotal +=  (item.Price || 0);
      });
    }

    self.newInvoiceSubTotal = subTotal;
    self.newInvoiceTotal = subTotal;
  }

  btnDeleteInvoiceItem(iIndex) {
    this.newInvoice.Items.splice(iIndex, 1);
    this.calculateSubTotal();
  }

  btnClearInvoiceItemsClick() {
    this.newInvoice.Items = [];
    this.newInvoiceSubTotal = 0;
    this.newInvoiceTotal = 0;
  }

  btnAddInvoiceItemClick() {
    this.newInvoice.Items.push(this.initNewInvoiceItem());
  }

  btnAddCheckCreditClick(type) {
    var addingObject:any = {
      Amount: 0,
      BankName: '',
      CardHolder: ''
    };
    if (type == 'check') {
      addingObject.CheckNumber = "";
      this.newPayment.Checks.push(addingObject);
    } else {
      addingObject.CardNumber = "";
      this.newPayment.Credits.push(addingObject);
    }
  }

  btnDeletePaymentCheck(chIndex) {
    this.newPayment.Checks.splice(chIndex, 1);
    this.calculateAmount();
  }

  btnDeletePaymentCredit(cIndex) {
    this.newPayment.Credits.splice(cIndex, 1);
    this.calculateAmount();
  }

  txtFinancialKeyUp(event) {
    this.calculateAmount();
  }

  calculateAmount() {
    var self = this;
    var totalAmount = 0;
    totalAmount += (self.newPayment.Bills100 || 0) * 10000;
    totalAmount += (self.newPayment.Bills050 || 0) * 5000;
    totalAmount += (self.newPayment.Bills020 || 0) * 2000;
    totalAmount += (self.newPayment.Bills010 || 0) * 1000;
    totalAmount += (self.newPayment.Bills005 || 0) * 500;
    totalAmount += (self.newPayment.Bills002 || 0) * 200;
    totalAmount += (self.newPayment.Bills001 || 0) * 100;
    totalAmount += (self.newPayment.Coins025 || 0) * 25;
    totalAmount += (self.newPayment.Coins010 || 0) * 10;
    totalAmount += (self.newPayment.Coins005 || 0) * 5;
    totalAmount += (self.newPayment.Coins001 || 0) * 1;
    $.each(self.newPayment.Checks, function(idx, check){
      totalAmount += (check.Amount || 0) * 100;
    });
    $.each(self.newPayment.Credits, function(idx, credit){
      totalAmount += (credit.Amount || 0) * 100;
    });

    self.newPayment.Amount = totalAmount;
  }

  btnSavePaymentClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    var officeId = "5b1b1505a21c1906e494da35";
    if (self.offices && self.offices.length > 0) {
      officeId = self.offices[0].Soid;
    }
    var url:any = '/api/Customer/' + officeId + '/AddPayment/' + self.currentCustomer.Soid;
    self._baseService.postBase(url, self.newPayment).then((res:any) => {
      if (res && res.Payments) {
        self.handleAfterSaving(self.currentCustomer.Payments, res.Payments);
        self.prepareCustomerValues(self.currentCustomer, 'payment');
        $("#modalAddPayment").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnSaveInvoiceClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    var officeId = "5b1b1505a21c1906e494da35";
    if (self.offices && self.offices.length > 0) {
      officeId = self.offices[0].Soid;
    }
    // For admin
    //var url:any = 'api/Customer/' + self.currentCustomer.Soid + '/AddCustomerInvoice';

    var url:any = 'api/Customer/' + officeId + '/AddInvoice/' + self.currentCustomer.Soid;
    $(event.target).addClass('btn-loading');
    self._baseService.postBase(url, self.newInvoice).then((res:any) => {
      if (res && res.Invoices) {
        self.handleAfterSaving(self.currentCustomer.Invoices, res.Invoices);
        self.prepareCustomerValues(self.currentCustomer, 'invoice');
        $("#modalAddInvoice").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnSaveCustomerClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddCustomer");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    var currentPerson = self.users.filter(function(e){
      return e.Soid == self.newCustomer.PersonSoid;
    });
    if (currentPerson.length > 0) {
       var user:any = currentPerson[0];
       self.newCustomer.PersonName = ((user.NameFirst || user.NameLast)? ((user.NameFirst? user.NameFirst: '') + ' ' + (user.NameLast? user.NameLast: '')).trim() : 'Empty Name');
    }

    var currentOffice = self.offices.filter(function(e){
       return e.Soid == self.newCustomer.OfficeSoid;
    });
    if (currentOffice.length > 0) {
      self.newCustomer.OfficeName = currentOffice[0].OfficeName;
    }

    $(event.target).addClass('btn-loading');
    var url:any = 'api/Customer';
    self._baseService.postBase(url, self.newCustomer).then((res:any) => {
      if (res && res.Soid) {
        self.customers.push(res);
        self.prepareCustomerValues(self.customers[self.customers.length - 1]);
        self.initScrollBar();
        $("#modalAddCustomer").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddClick(event, customer, type) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    var url:any = "";
    if (type == 'visit') {
      url = 'api/Customer/' + customer.Soid + '/AddCustomerVisit';
    } else if (type == 'invoice') {
      self.initNewInvoice();
      self.currentCustomer = customer;
      $("#modalAddInvoice").modal('show');
      return;
    } else if (type == 'transaction') {
      url = 'api/Customer/' + customer.Soid + '/AddCustomerTransaction';
    } else if (type == 'payment') {
      self.initNewPayment();
      self.currentCustomer = customer;
      $("#modalAddPayment").modal('show');
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        if (type == 'visit') {
          self.handleAfterSaving(customer.Visits, res.Visits);
        } else if (type == 'invoice') {
          self.handleAfterSaving(customer.Invoices, res.Invoices);
        } if (type == 'transaction') {
          self.handleAfterSaving(customer.Transactions, res.Transactions);
        }
        self.prepareCustomerValues(customer, type);
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  txtValueChange(event, type, fieldName, editingObject, parentObject:any = {}) {
    var self = this;
    var value:any = '';
    var boolInputFields = [];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    var url;
    if (type == 'customer') {
      url = 'api/Customer/' + editingObject.Soid;
    } else if (type == 'visit') {
      url = 'api/Customer/' + parentObject.Soid + '/UpdateCustomerVisit/' + editingObject.Soid;
    } else if (type == 'invoice') {
      url = 'api/Customer/' + parentObject.Soid + '/UpdateCustomerInvoice/' + editingObject.Soid;
    } else if (type == 'transaction') {
      url = 'api/Customer/' + parentObject.Soid + '/UpdateCustomerTransaction/' + editingObject.Soid;
    }
    self._baseService.patchBase(url, data).then((res) => {
      if (res.Changed) {
        if (boolInputFields.indexOf(fieldName) >= 0) {
          var checked = (res.Data == 'true');
          $(event.target).prop( "checked", checked );
        } else {
          $(event.target).val(res.Data);
        }
        var updatePersonUrl:any = 'api/Customer/' + editingObject.Soid;
        if (type == 'customer' && fieldName == 'PersonSoid') {
          var currentPerson = self.users.filter(function(e){
            return e.Soid == value;
          });
          if (currentPerson.length > 0) {
            var user:any = currentPerson[0];
            var personData:any = {
              FieldName: 'PersonName',
              Data: ((user.NameFirst || user.NameLast)? ((user.NameFirst? user.NameFirst: '') + ' ' + (user.NameLast? user.NameLast: '')).trim() : 'Empty Name')
            };
            self._baseService.patchBase(updatePersonUrl, personData).then((res1) => {
              if (res1.Changed) {
                editingObject.PersonName = personData.Data;
              }
            });
          }
        } else if (type == 'customer' && fieldName == 'OfficeSoid') {
          var currentOffice = self.offices.filter(function(e){
            return e.Soid == value;
          });
          if (currentOffice.length > 0) {
            var personData:any = {
              FieldName: 'OfficeName',
              Data: currentOffice[0].OfficeName
            };
            self._baseService.patchBase(updatePersonUrl, personData).then((res1) => {
              if (res1.Changed) {
                editingObject.OfficeName = personData.Data;
              }
            });
          }
        }
      } else {
        if (!res.Value)
          res.Value = '';

        var dateTimeFieldNames = ['VisitDate', 'InvoicedOn', 'DueOn'];
        if (dateTimeFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateTimeInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
