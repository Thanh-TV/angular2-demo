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
var CustomerComponent = (function () {
    function CustomerComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.customers = [];
        this.users = [];
        this.offices = [];
        this.invoiceItems = [];
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
        this.newCustomer = {};
        this.newPayment = {};
        this.newInvoice = {};
        this.newInvoiceSubTotal = 0;
        this.newInvoiceTotal = 0;
    }
    CustomerComponent.prototype.ngOnInit = function () {
        var self = this;
        self.customers = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.fetchData();
            self._baseService.getBase('api/Person').then(function (res) {
                if (res && res.ok != false) {
                    self.users = res;
                }
            });
            self._baseService.getBase('api/Office').then(function (res) {
                if (res && res.ok != false) {
                    self.offices = res;
                    if (self.offices.length > 0) {
                        var office = self.offices[0];
                        self.officeId = office.Soid;
                        self.invoiceItems = [];
                        $.each(office.PriceLists, function (idx, priceList) {
                            $.each(priceList.Items, function (idx, priceListItem) {
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
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    CustomerComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    CustomerComponent.prototype.fetchData = function () {
        var self = this;
        self.isLoading = true;
        var url = 'api/Customer';
        self._baseService.getBase(url).then(function (res) {
            if (res && res.ok != false) {
                self.customers = res;
                $.each(self.customers, function (idx, customer) {
                    self.prepareCustomerValues(customer);
                });
            }
            self.isLoading = false;
            self.initScrollBar();
        });
    };
    CustomerComponent.prototype.prepareCustomerValues = function (customer, type) {
        if (type === void 0) { type = undefined; }
        var self = this;
        if ((!type || type == 'visit') && customer.Visits) {
            $.each(customer.Visits, function (idx, visit) {
                if (visit.VisitDate) {
                    visit.VisitDate = window.getDateTimeInputFormat(visit.VisitDate);
                }
            });
        }
        if ((!type || type == 'invoice') && customer.Invoices) {
            $.each(customer.Invoices, function (idx1, invoice) {
                if (invoice.InvoicedOn) {
                    invoice.InvoicedOn = window.getDateTimeInputFormat(invoice.InvoicedOn);
                    invoice.DueOn = window.getDateTimeInputFormat(invoice.DueOn);
                }
            });
        }
        if ((!type || type == 'payment') && customer.Payments) {
            $.each(customer.Payments, function (idx2, payment) {
                if (payment.PaidOn) {
                    payment.PaidOn = window.getDateTimeInputFormat(payment.PaidOn);
                }
            });
        }
    };
    CustomerComponent.prototype.handleAfterSaving = function (oldData, newData) {
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
    CustomerComponent.prototype.btnDeleteClick = function (deletingObject, deletingType, index, deletingParentObject) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingType = deletingType;
        this.deletingParentObject = deletingParentObject;
        $("#confirmation_modal").modal('show');
    };
    CustomerComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "";
        if (self.deletingType == 'visit') {
            url = 'api/Customer/' + self.deletingParentObject.Soid + '/DeleteCustomerVisit/' + self.deletingObject.Soid;
        }
        if (self.deletingType == 'invoice') {
            url = 'api/Customer/' + self.deletingParentObject.Soid + '/DeleteCustomerInvoice/' + self.deletingObject.Soid;
        }
        if (self.deletingType == 'transaction') {
            url = 'api/Customer/' + self.deletingParentObject.Soid + '/DeleteCustomerTransaction/' + self.deletingObject.Soid;
        }
        if (self.deletingType == 'payment') {
            url = 'api/Customer/' + self.deletingParentObject.Soid + '/DeleteCustomerPayment/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'customer') {
            url = 'api/Customer/' + self.deletingObject.Soid;
        }
        self._baseService.deleteBase(url).then(function (res) {
            if (self.deletingType == 'visit') {
                self.handleAfterSaving(self.customers[self.deletingObjectIndex].Visits, res.Visits);
                self.prepareCustomerValues(self.customers[self.deletingObjectIndex], 'visit');
            }
            if (self.deletingType == 'invoice') {
                self.handleAfterSaving(self.customers[self.deletingObjectIndex].Invoices, res.Invoices);
                self.prepareCustomerValues(self.customers[self.deletingObjectIndex], 'invoice');
            }
            if (self.deletingType == 'transaction') {
                self.handleAfterSaving(self.customers[self.deletingObjectIndex].Transactions, res.Transactions);
                self.prepareCustomerValues(self.customers[self.deletingObjectIndex], 'transaction');
            }
            if (self.deletingType == 'payment') {
                self.handleAfterSaving(self.customers[self.deletingObjectIndex].Payments, res.Payments);
                self.prepareCustomerValues(self.customers[self.deletingObjectIndex], 'payment');
            }
            else if (self.deletingType == 'customer') {
                self.customers.splice(self.deletingObjectIndex, 1);
            }
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    CustomerComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    CustomerComponent.prototype.btnAddCustomerClick = function () {
        this.initNewCustomer();
        $("#modalAddCustomer").modal('show');
    };
    CustomerComponent.prototype.initNewCustomer = function () {
        this.newCustomer = {
            PersonSoid: '',
            OfficeSoid: ''
        };
    };
    CustomerComponent.prototype.initNewPayment = function () {
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
    };
    CustomerComponent.prototype.initNewInvoice = function () {
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
    };
    CustomerComponent.prototype.initNewInvoiceItem = function () {
        return {
            Item: "",
            ListItemSoid: "",
            ModuleName: "",
            Price: 0,
            Quantity: 0,
            UnitOfMeasure: "",
            UnitPrice: 0
        };
    };
    CustomerComponent.prototype.listItemChange = function (item) {
        var self = this;
        if (item.ListItemSoid) {
            var selectedItems = self.invoiceItems.filter(function (e) {
                return e.Soid == item.ListItemSoid;
            });
            if (selectedItems.length > 0) {
                var selectedItem = selectedItems[0];
                item.UnitPrice = selectedItem.UnitPrice;
                item.UnitOfMeasure = selectedItem.UnitOfMeasure;
                item.Item = selectedItem.Name;
            }
        }
        else {
            item.UnitPrice = 0,
                item.Item = "";
            item.UnitOfMeasure = "";
            item.Quantity = 0;
            item.Price = 0;
        }
        self.txtNewInvoiceChange(item);
    };
    CustomerComponent.prototype.txtNewInvoiceChange = function (item) {
        if (item.ListItemSoid) {
            var price = (item.UnitPrice || 0) * 100;
            item.Price = price * (item.Quantity || 0);
        }
        else {
            item.Price = 0;
        }
        this.calculateSubTotal();
    };
    CustomerComponent.prototype.calculateSubTotal = function () {
        var self = this;
        var subTotal = 0;
        if (self.newInvoice.Items.length > 0) {
            $.each(self.newInvoice.Items, function (idx, item) {
                subTotal += (item.Price || 0);
            });
        }
        self.newInvoiceSubTotal = subTotal;
        self.newInvoiceTotal = subTotal;
    };
    CustomerComponent.prototype.btnDeleteInvoiceItem = function (iIndex) {
        this.newInvoice.Items.splice(iIndex, 1);
        this.calculateSubTotal();
    };
    CustomerComponent.prototype.btnClearInvoiceItemsClick = function () {
        this.newInvoice.Items = [];
        this.newInvoiceSubTotal = 0;
        this.newInvoiceTotal = 0;
    };
    CustomerComponent.prototype.btnAddInvoiceItemClick = function () {
        this.newInvoice.Items.push(this.initNewInvoiceItem());
    };
    CustomerComponent.prototype.btnAddCheckCreditClick = function (type) {
        var addingObject = {
            Amount: 0,
            BankName: '',
            CardHolder: ''
        };
        if (type == 'check') {
            addingObject.CheckNumber = "";
            this.newPayment.Checks.push(addingObject);
        }
        else {
            addingObject.CardNumber = "";
            this.newPayment.Credits.push(addingObject);
        }
    };
    CustomerComponent.prototype.btnDeletePaymentCheck = function (chIndex) {
        this.newPayment.Checks.splice(chIndex, 1);
        this.calculateAmount();
    };
    CustomerComponent.prototype.btnDeletePaymentCredit = function (cIndex) {
        this.newPayment.Credits.splice(cIndex, 1);
        this.calculateAmount();
    };
    CustomerComponent.prototype.txtFinancialKeyUp = function (event) {
        this.calculateAmount();
    };
    CustomerComponent.prototype.calculateAmount = function () {
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
        $.each(self.newPayment.Checks, function (idx, check) {
            totalAmount += (check.Amount || 0) * 100;
        });
        $.each(self.newPayment.Credits, function (idx, credit) {
            totalAmount += (credit.Amount || 0) * 100;
        });
        self.newPayment.Amount = totalAmount;
    };
    CustomerComponent.prototype.btnSavePaymentClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        var officeId = "5b1b1505a21c1906e494da35";
        if (self.offices && self.offices.length > 0) {
            officeId = self.offices[0].Soid;
        }
        var url = '/api/Customer/' + officeId + '/AddPayment/' + self.currentCustomer.Soid;
        self._baseService.postBase(url, self.newPayment).then(function (res) {
            if (res && res.Payments) {
                self.handleAfterSaving(self.currentCustomer.Payments, res.Payments);
                self.prepareCustomerValues(self.currentCustomer, 'payment');
                $("#modalAddPayment").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CustomerComponent.prototype.btnSaveInvoiceClick = function (event) {
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
        var url = 'api/Customer/' + officeId + '/AddInvoice/' + self.currentCustomer.Soid;
        $(event.target).addClass('btn-loading');
        self._baseService.postBase(url, self.newInvoice).then(function (res) {
            if (res && res.Invoices) {
                self.handleAfterSaving(self.currentCustomer.Invoices, res.Invoices);
                self.prepareCustomerValues(self.currentCustomer, 'invoice');
                $("#modalAddInvoice").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CustomerComponent.prototype.btnSaveCustomerClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddCustomer");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        var currentPerson = self.users.filter(function (e) {
            return e.Soid == self.newCustomer.PersonSoid;
        });
        if (currentPerson.length > 0) {
            var user = currentPerson[0];
            self.newCustomer.PersonName = ((user.NameFirst || user.NameLast) ? ((user.NameFirst ? user.NameFirst : '') + ' ' + (user.NameLast ? user.NameLast : '')).trim() : 'Empty Name');
        }
        var currentOffice = self.offices.filter(function (e) {
            return e.Soid == self.newCustomer.OfficeSoid;
        });
        if (currentOffice.length > 0) {
            self.newCustomer.OfficeName = currentOffice[0].OfficeName;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Customer';
        self._baseService.postBase(url, self.newCustomer).then(function (res) {
            if (res && res.Soid) {
                self.customers.push(res);
                self.prepareCustomerValues(self.customers[self.customers.length - 1]);
                self.initScrollBar();
                $("#modalAddCustomer").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CustomerComponent.prototype.btnAddClick = function (event, customer, type) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        var url = "";
        if (type == 'visit') {
            url = 'api/Customer/' + customer.Soid + '/AddCustomerVisit';
        }
        else if (type == 'invoice') {
            self.initNewInvoice();
            self.currentCustomer = customer;
            $("#modalAddInvoice").modal('show');
            return;
        }
        else if (type == 'transaction') {
            url = 'api/Customer/' + customer.Soid + '/AddCustomerTransaction';
        }
        else if (type == 'payment') {
            self.initNewPayment();
            self.currentCustomer = customer;
            $("#modalAddPayment").modal('show');
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                if (type == 'visit') {
                    self.handleAfterSaving(customer.Visits, res.Visits);
                }
                else if (type == 'invoice') {
                    self.handleAfterSaving(customer.Invoices, res.Invoices);
                }
                if (type == 'transaction') {
                    self.handleAfterSaving(customer.Transactions, res.Transactions);
                }
                self.prepareCustomerValues(customer, type);
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    CustomerComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject) {
        if (parentObject === void 0) { parentObject = {}; }
        var self = this;
        var value = '';
        var boolInputFields = [];
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
        var url;
        if (type == 'customer') {
            url = 'api/Customer/' + editingObject.Soid;
        }
        else if (type == 'visit') {
            url = 'api/Customer/' + parentObject.Soid + '/UpdateCustomerVisit/' + editingObject.Soid;
        }
        else if (type == 'invoice') {
            url = 'api/Customer/' + parentObject.Soid + '/UpdateCustomerInvoice/' + editingObject.Soid;
        }
        else if (type == 'transaction') {
            url = 'api/Customer/' + parentObject.Soid + '/UpdateCustomerTransaction/' + editingObject.Soid;
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
                var updatePersonUrl = 'api/Customer/' + editingObject.Soid;
                if (type == 'customer' && fieldName == 'PersonSoid') {
                    var currentPerson = self.users.filter(function (e) {
                        return e.Soid == value;
                    });
                    if (currentPerson.length > 0) {
                        var user = currentPerson[0];
                        var personData = {
                            FieldName: 'PersonName',
                            Data: ((user.NameFirst || user.NameLast) ? ((user.NameFirst ? user.NameFirst : '') + ' ' + (user.NameLast ? user.NameLast : '')).trim() : 'Empty Name')
                        };
                        self._baseService.patchBase(updatePersonUrl, personData).then(function (res1) {
                            if (res1.Changed) {
                                editingObject.PersonName = personData.Data;
                            }
                        });
                    }
                }
                else if (type == 'customer' && fieldName == 'OfficeSoid') {
                    var currentOffice = self.offices.filter(function (e) {
                        return e.Soid == value;
                    });
                    if (currentOffice.length > 0) {
                        var personData = {
                            FieldName: 'OfficeName',
                            Data: currentOffice[0].OfficeName
                        };
                        self._baseService.patchBase(updatePersonUrl, personData).then(function (res1) {
                            if (res1.Changed) {
                                editingObject.OfficeName = personData.Data;
                            }
                        });
                    }
                }
            }
            else {
                if (!res.Value)
                    res.Value = '';
                var dateTimeFieldNames = ['VisitDate', 'InvoicedOn', 'DueOn'];
                if (dateTimeFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateTimeInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return CustomerComponent;
}());
CustomerComponent = __decorate([
    core_1.Component({
        selector: 'customer-component',
        templateUrl: './customer.component.html',
        styleUrls: ['../../share/css/base-panel.scss', '../../share/css/financial-base.scss', './customer.component.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], CustomerComponent);
exports.CustomerComponent = CustomerComponent;
//# sourceMappingURL=customer.component.js.map