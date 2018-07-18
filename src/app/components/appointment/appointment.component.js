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
var AppointmentComponent = (function () {
    function AppointmentComponent(_router, _baseService) {
        this._router = _router;
        this._baseService = _baseService;
        this.isLoading = false;
        this.appointments = [];
        this.users = [];
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
        this.notifyUser = "";
        this.newAppointment = { Participants: [{}] };
        this.totalNewParticipants = 0;
        this.totalAddedNewParticipants = 0;
    }
    AppointmentComponent.prototype.ngOnInit = function () {
        var self = this;
        self.appointments = [];
        var userInfo = sessionStorage.getItem('UserInfo');
        if (userInfo && userInfo != 'undefined' && userInfo != 'null') {
            self.userInfo = JSON.parse(userInfo);
            self.isLoading = true;
            self._baseService.getBase('api/Appointment').then(function (res) {
                if (res && res.ok != false) {
                    self.appointments = res;
                    $.each(self.appointments, function (idx, appointment) {
                        self.prepareAppointmentValues(appointment);
                    });
                }
                self.isLoading = false;
                self.initScrollBar();
            });
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
    AppointmentComponent.prototype.initScrollBar = function () {
        var self = this;
        setTimeout(function () {
            window.initScrollBar();
        }, 500);
    };
    AppointmentComponent.prototype.prepareAppointmentValues = function (appointment, type) {
        if (type === void 0) { type = undefined; }
        var self = this;
        if (!type) {
            appointment.Time.Start = window.getDateTimeInputFormat(appointment.Time.Start);
            appointment.Time.End = window.getDateTimeInputFormat(appointment.Time.End);
        }
    };
    AppointmentComponent.prototype.handleAfterSaving = function (oldData, newData) {
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
    AppointmentComponent.prototype.btnDeleteClick = function (deletingObject, deletingType, index, deletingParentObject) {
        this.deletingObject = deletingObject;
        this.deletingObjectIndex = index;
        this.deletingType = deletingType;
        this.deletingParentObject = deletingParentObject;
        $("#confirmation_modal").modal('show');
    };
    AppointmentComponent.prototype.btnConfirmDeletingClick = function (event) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = "";
        if (self.deletingType == 'comment') {
            url = 'api/Appointment/' + self.deletingParentObject.Soid + '/DeleteAppointmentNote/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'participant') {
            url = 'api/Appointment/' + self.deletingParentObject.Soid + '/DeleteAppointmentParticipant/' + self.deletingObject.Soid;
        }
        else if (self.deletingType == 'appointment') {
            url = 'api/Appointment/' + self.deletingObject.Soid;
        }
        self._baseService.deleteBase(url).then(function (res) {
            if (self.deletingType == 'comment') {
                self.appointments[self.deletingObjectIndex].Comments = res.Comments;
            }
            else if (self.deletingType == 'participant') {
                self.handleAfterSaving(self.appointments[self.deletingObjectIndex].Participants, res.Participants);
            }
            else if (self.deletingType == 'appointment') {
                self.appointments.splice(self.deletingObjectIndex, 1);
            }
            $("#confirmation_modal").modal('hide');
            $(event.target).removeClass('btn-loading');
        });
    };
    AppointmentComponent.prototype.btnConfirmCancelingClick = function () {
        $("#confirmation_modal").modal('hide');
    };
    AppointmentComponent.prototype.btnAddNoteClick = function (event, appointment) {
        this.handleAddingNote(event, appointment);
    };
    AppointmentComponent.prototype.txtNoteKeyUp = function (event, appointment) {
        if (event.keyCode == 13) {
            this.handleAddingNote(event, appointment);
        }
    };
    AppointmentComponent.prototype.handleAddingNote = function (event, appointment) {
        var self = this;
        var comment = $(event.target).parents('.base-comment-ctn').find('textarea.txt-add-comment').val();
        var data = {
            SqlId: appointment.Soid,
            Content: comment
        };
        self._baseService.postBase('api/Appointment/' + appointment.Soid + '/AddAppointmentNote', data).then(function (res) {
            if (res && res.Soid) {
                appointment.Comments = res.Comments;
                $(event.target).parents('.base-comment-item').find('textarea').val('');
            }
        });
    };
    AppointmentComponent.prototype.btnAddAppointmentClick = function () {
        this.initNewAppointment();
        $("#modalAddAppointment").modal('show');
    };
    AppointmentComponent.prototype.initNewAppointment = function () {
        this.newAppointment = {
            Subject: '',
            Category: '',
            Participants: [{}],
            Start: window.getDateTimeInputFormat(new Date()),
            End: '',
            WholeDay: false
        };
    };
    AppointmentComponent.prototype.btnNotifyUserClick = function (appointment) {
        this.notifyingObject = appointment;
        $("#modalTaskNotifyUser").modal('show');
    };
    AppointmentComponent.prototype.btnProcessNotifyUserClick = function (event, appointment) {
        var self = this;
        var url;
        if (self.notifyUser != "") {
            url = 'api/Appointment/' + self.notifyingObject.Soid + '/NotifyUser/' + self.notifyUser;
        }
        else {
            url = 'api/Appointment/' + self.notifyingObject.Soid + '/NotifyAll';
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.postBase(url, {}).then(function (res) {
            if (!(res && res.ok == false)) {
                window.showSuccess('Notified!');
                $("#modalTaskNotifyUser").modal('hide');
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    AppointmentComponent.prototype.btnUpdateCommentClick = function (appointment, note, event) {
        var self = this;
        var url = 'api/Appointment/' + appointment.Soid + '/UpdateAppointmentNote/' + note.Soid;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var data = {
            FieldName: 'Content',
            Data: note.Content
        };
        self._baseService.patchBase(url, data).then(function (res) {
            if (res && res.Changed) {
            }
            else {
                note.Content = res.Value;
            }
            note.isEditing = false;
            $(event.target).removeClass('btn-loading');
        });
    };
    AppointmentComponent.prototype.btnResetParticipantsClick = function (event, appointment) {
        var self = this;
        var url = 'api/Appointment/' + appointment.Soid + '/ResetParticipant';
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        self._baseService.patchBase(url, {}).then(function (res) {
            if (res && res.ok == false) {
                return;
            }
            else {
                debugger;
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    AppointmentComponent.prototype.btnAddParticipantClick = function (event, appointment) {
        var self = this;
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var url = 'api/Appointment/' + appointment.Soid + '/AddAppointmentParticipant';
        self._baseService.postBase(url, {}).then(function (res) {
            if (res) {
                self.handleAfterSaving(appointment.Participants, res.Participants);
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    AppointmentComponent.prototype.btnSaveAppointmentClick = function (event) {
        var self = this;
        // Validation
        var invalid = window.validateForm(event, "modalAddAppointment");
        if (invalid) {
            return;
        }
        if (!self.newAppointment.WholeDay && self.newAppointment.End.trim() == "") {
            $(".appointment-end-ctn").addClass('has-error');
            return;
        }
        if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
            return;
        }
        $(event.target).addClass('btn-loading');
        var data = {
            Subject: self.newAppointment.Subject.trim(),
            Start: self.newAppointment.Start,
            End: self.newAppointment.End,
            WholeDay: self.newAppointment.WholeDay,
            Category: self.newAppointment.Category
        };
        self._baseService.postBase('api/Appointment', data).then(function (res) {
            if (res && res.Soid) {
                self.totalNewParticipants = self.newAppointment.Participants.length;
                self.totalAddedNewParticipants = 0;
                if (self.newAppointment.Participants.length > 0) {
                    $.each(self.newAppointment.Participants, function (idx, participant) {
                        if (participant.ParticipantSoid) {
                            var addParticipantUrl = 'api/Appointment/' + res.Soid + '/AddAppointmentParticipant';
                            var addParticipantData = {
                                ParticipantSoid: participant.ParticipantSoid
                            };
                            self._baseService.postBase(addParticipantUrl, addParticipantData).then(function (res) {
                                self.totalAddedNewParticipants += 1;
                                self.checkToAppendAddedAppointment(res);
                            });
                        }
                        else {
                            self.totalAddedNewParticipants += 1;
                            self.checkToAppendAddedAppointment(res);
                        }
                    });
                }
                else {
                    self.checkToAppendAddedAppointment(res);
                }
            }
            else {
                $(event.target).removeClass('btn-loading');
                window.showError();
            }
            $(event.target).removeClass('btn-loading');
        });
    };
    AppointmentComponent.prototype.checkToAppendAddedAppointment = function (res) {
        var self = this;
        if (this.totalNewParticipants == this.totalAddedNewParticipants) {
            res.Time.Start = window.getDateTimeInputFormat(res.Time.Start);
            res.Time.End = window.getDateTimeInputFormat(res.Time.End);
            this.appointments.push(res);
            self.initScrollBar();
            // Set time
            var timeUrl = 'api/Appointment/' + res.Soid + '/SetTime';
            var startTimeData = { FieldName: 'Start', Data: self.newAppointment.Start };
            self._baseService.patchBase(timeUrl, startTimeData).then(function (timeRes) {
                if (timeRes && timeRes.Time) {
                    res.Time.Start = window.getDateTimeInputFormat(timeRes.Time.Start);
                }
            });
            if (self.newAppointment.End) {
                var endTimeData = { FieldName: 'End', Data: self.newAppointment.End };
                self._baseService.patchBase(timeUrl, endTimeData).then(function (timeEndRes) {
                    if (timeEndRes && timeEndRes.Time) {
                        res.Time.End = window.getDateTimeInputFormat(timeEndRes.Time.End);
                    }
                });
            }
            if (self.newAppointment.WholeDay) {
                var endTimeData = { FieldName: 'WholeDay', Data: self.newAppointment.WholeDay };
                self._baseService.patchBase(timeUrl, endTimeData).then(function (wholeDayRes) {
                    if (wholeDayRes && wholeDayRes.Time) {
                        res.Time.WholeDay = wholeDayRes.Time.WholeDay;
                    }
                });
            }
            $("#modalAddAppointment").modal('hide');
        }
    };
    AppointmentComponent.prototype.txtValidationKeyUp = function (event) {
        if ($(event.target).val().trim() != "")
            $(event.target).parents('.input-wrapper').removeClass('has-error');
    };
    AppointmentComponent.prototype.cbkWholeDayChange = function () {
        if (this.newAppointment.WholeDay) {
            $(".appointment-end-ctn").removeClass('has-error');
        }
    };
    AppointmentComponent.prototype.txtValueChange = function (event, type, fieldName, editingObject, parentObject) {
        if (parentObject === void 0) { parentObject = {}; }
        var self = this;
        var value = '';
        var boolInputFields = ['Canceled', 'Present', 'WholeDay'];
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
        if (type == 'appointment') {
            url = 'api/Appointment/' + editingObject.Soid;
        }
        else if (type == 'time') {
            url = 'api/Appointment/' + editingObject.Soid + '/SetTime';
        }
        else if (type == 'participant') {
            url = 'api/Appointment/' + parentObject.Soid + '/UpdateAppointmentParticipant/' + editingObject.Soid;
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
                var dateTimeFieldNames = ['Start', 'End'];
                if (dateTimeFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
                    res.Value = window.getDateTimeInputFormat(res.Value);
                }
                $(event.target).val(res.Value);
            }
        });
    };
    return AppointmentComponent;
}());
AppointmentComponent = __decorate([
    core_1.Component({
        selector: 'appointment-component',
        templateUrl: './appointment.component.html',
        styleUrls: ['./appointment.component.scss', '../../share/css/base-comment.scss', '../../share/css/base-panel.scss']
    }),
    __metadata("design:paramtypes", [router_1.Router, base_service_1.BaseService])
], AppointmentComponent);
exports.AppointmentComponent = AppointmentComponent;
//# sourceMappingURL=appointment.component.js.map