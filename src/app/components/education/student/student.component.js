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
var base_service_1 = require("../../../services/base.service");
var StudentComponent = (function () {
    function StudentComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.students = [];
        this.companies = [];
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
        this.newStudent = {};
    }
    StudentComponent.prototype.ngOnInit = function () {
        var self = this;
        self.students = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Student').then(function (res) {
                if (res && res.ok != false) {
                    self.students = res;
                }
                self.isLoading = false;
            });
            self._baseService.getBase('api/Company').then(function (res) {
                if (res && res.ok != false) {
                    self.companies = res;
                }
            });
        }
        else {
            self._router.navigate(['/login']);
        }
    };
    StudentComponent.prototype.btnRemoveStudentClick = function (student, index) {
        this.deletingStudentObject = student;
        this.deletingStudentObjectIndex = index;
        this.deletingType = 'student';
        $("#confirmation_modal").modal('show');
    };
    StudentComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        var url = 'api/Student/' + self.deletingStudentObject.Soid;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.deleteBase(url).then(function (res) {
            if (res && res.ok == false) {
                return;
            }
            else {
                self.students.splice(self.deletingStudentObjectIndex, 1);
            }
            $(event.target).removeClass('btn-loading');
            $("#confirmation_modal").modal('hide');
        });
    };
    StudentComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    StudentComponent.prototype.btnAddStudentClick = function () {
        this.initNewStudent();
        $("#modalAddStudent").modal('show');
    };
    StudentComponent.prototype.initNewStudent = function () {
        this.newStudent = {
            ContactName: '',
            Phone: '',
            Email: ''
        };
    };
    StudentComponent.prototype.btnSaveStudentClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddStudent");
        if (invalid) {
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase('api/Student', self.newStudent).then(function (res) {
            if (res && res.Soid) {
                self.students.push(res);
                $("#modalAddStudent").modal('hide');
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    StudentComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject) {
        var self = this;
        var value = '';
        var boolInputFields = ['IsAdmin', 'Active'];
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
        var url = 'api/Student/' + editingObject.Soid;
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
                var dateInputs = [];
                if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return StudentComponent;
}());
StudentComponent = __decorate([
    core_1.Component({
        selector: 'student-component',
        templateUrl: './student.component.html',
        styleUrls: ['../../../share/css/education-base.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], StudentComponent);
exports.StudentComponent = StudentComponent;
//# sourceMappingURL=student.component.js.map