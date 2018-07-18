import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'appointment-component',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss', '../share/css/base-comment.scss', '../share/css/base-panel.scss']
})

export class AppointmentComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  appointments:any = [];
  users:any = [];
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
  notifyingObject:any;
  notifyUser:any = "";
  newAppointment:any = {Participants: [{}]};
  totalNewParticipants:number = 0;
  totalAddedNewParticipants:number = 0;

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.appointments = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Appointment').then((res:any) => {
        if (res && res.ok != false) {
          self.appointments = res;
          $.each(self.appointments, function(idx, appointment){
            self.prepareAppointmentValues(appointment);
          });
        }
        self.isLoading = false;
        self.initScrollBar();
      });
      self._baseService.getBase('api/Person').then((res:any) => {
        if (res && res.ok != false) {
          self.users = res;
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

  prepareAppointmentValues (appointment, type:any = undefined) {
    var self = this;
    if (!type) {
      appointment.Time.Start = window.getDateTimeInputFormat(appointment.Time.Start);
      appointment.Time.End = window.getDateTimeInputFormat(appointment.Time.End);
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
    if (self.deletingType == 'comment') {
      url = 'api/Appointment/' + self.deletingParentObject.Soid + '/DeleteAppointmentNote/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'participant') {
      url = 'api/Appointment/' + self.deletingParentObject.Soid + '/DeleteAppointmentParticipant/' + self.deletingObject.Soid;
    } else if (self.deletingType == 'appointment') {
      url = 'api/Appointment/' + self.deletingObject.Soid;
    }

    self._baseService.deleteBase(url).then((res)=>{
      if (self.deletingType == 'comment') {
        self.appointments[self.deletingObjectIndex].Comments = res.Comments;
      } else if (self.deletingType == 'participant') {
        self.handleAfterSaving(self.appointments[self.deletingObjectIndex].Participants, res.Participants);
      } else if (self.deletingType == 'appointment') {
        self.appointments.splice(self.deletingObjectIndex, 1);
      }
      $("#confirmation_modal").modal('hide');
      $(event.target).removeClass('btn-loading');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddNoteClick(event, appointment) {
    this.handleAddingNote(event, appointment);
  }

  txtNoteKeyUp(event, appointment) {
    if (event.keyCode == 13) {
      this.handleAddingNote(event, appointment);
    }
  }

  handleAddingNote(event, appointment) {
    var self = this;
    var comment:any = $(event.target).parents('.base-comment-ctn').find('textarea.txt-add-comment').val();
    var data:any = {
      SqlId: appointment.Soid,
      Content: comment
    };
    self._baseService.postBase('api/Appointment/' + appointment.Soid +'/AddAppointmentNote', data).then((res)=>{
      if (res && res.Soid) {
        appointment.Comments = res.Comments;
        $(event.target).parents('.base-comment-item').find('textarea').val('');
      }
    });
  }

  btnAddAppointmentClick() {
    this.initNewAppointment();
    $("#modalAddAppointment").modal('show');
  }

  initNewAppointment() {
    this.newAppointment = {
      Subject: '',
      Category: '',
      Participants: [{}],
      Start: window.getDateTimeInputFormat(new Date()),
      End: '',
      WholeDay: false
    };
  }

  btnNotifyUserClick(appointment) {
    this.notifyingObject = appointment;
    $("#modalTaskNotifyUser").modal('show');
  }

  btnProcessNotifyUserClick(event, appointment) {
    var self = this;
    var url:any;
    if (self.notifyUser != "") {
      url = 'api/Appointment/' + self.notifyingObject.Soid + '/NotifyUser/' + self.notifyUser;
    } else {
      url = 'api/Appointment/' + self.notifyingObject.Soid + '/NotifyAll';
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase(url, {}).then((res)=>{
      if (!(res && res.ok == false)) {
        window.showSuccess('Notified!');
        $("#modalTaskNotifyUser").modal('hide');
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnUpdateCommentClick(appointment, note, event) {
    var self = this;
    var url:any = 'api/Appointment/' + appointment.Soid + '/UpdateAppointmentNote/' + note.Soid;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var data = {
      FieldName: 'Content',
      Data: note.Content
    };
    self._baseService.patchBase(url, data).then((res)=>{
      if (res && res.Changed) {

      } else {
        note.Content = res.Value;
      }
      note.isEditing = false;
      $(event.target).removeClass('btn-loading');
    });
  }

  btnResetParticipantsClick(event, appointment) {
    var self = this;
    var url:any = 'api/Appointment/' + appointment.Soid + '/ResetParticipant';
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.patchBase(url, {}).then((res)=>{
      if (res && res.ok == false) {
        return
      } else {
        debugger;
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnAddParticipantClick(event, appointment) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Appointment/' + appointment.Soid + '/AddAppointmentParticipant';
    self._baseService.postBase(url, {}).then((res:any) => {
      if (res) {
        self.handleAfterSaving(appointment.Participants, res.Participants);
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  btnSaveAppointmentClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddAppointment");
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
    var data:any = {
      Subject: self.newAppointment.Subject.trim(),
      Start: self.newAppointment.Start,
      End: self.newAppointment.End,
      WholeDay: self.newAppointment.WholeDay,
      Category: self.newAppointment.Category
    };
    self._baseService.postBase('api/Appointment', data).then((res:any) => {
      if (res && res.Soid) {
        self.totalNewParticipants = self.newAppointment.Participants.length;
        self.totalAddedNewParticipants = 0;
        if (self.newAppointment.Participants.length > 0) {
          $.each(self.newAppointment.Participants, function(idx, participant) {
            if (participant.ParticipantSoid) {
              var addParticipantUrl = 'api/Appointment/' + res.Soid + '/AddAppointmentParticipant';
              var addParticipantData:any = {
                ParticipantSoid: participant.ParticipantSoid
              }
              self._baseService.postBase(addParticipantUrl, addParticipantData).then((res:any) => {
                self.totalAddedNewParticipants += 1;
                self.checkToAppendAddedAppointment(res);
              });
            } else {
              self.totalAddedNewParticipants += 1;
              self.checkToAppendAddedAppointment(res);
            }
          });
        } else {
          self.checkToAppendAddedAppointment(res);
        }
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  checkToAppendAddedAppointment(res) {
    var self = this;
    if (this.totalNewParticipants == this.totalAddedNewParticipants) {
      res.Time.Start = window.getDateTimeInputFormat(res.Time.Start);
      res.Time.End = window.getDateTimeInputFormat(res.Time.End);
      this.appointments.push(res);
      self.initScrollBar();
      // Set time
      var timeUrl:any = 'api/Appointment/' + res.Soid + '/SetTime';
      var startTimeData:any = {FieldName: 'Start', Data: self.newAppointment.Start};
      self._baseService.patchBase(timeUrl, startTimeData).then((timeRes)=>{
        if (timeRes && timeRes.Time) {
          res.Time.Start = window.getDateTimeInputFormat(timeRes.Time.Start);
        }
      });

      if (self.newAppointment.End) {
        var endTimeData:any = {FieldName: 'End', Data: self.newAppointment.End};
        self._baseService.patchBase(timeUrl, endTimeData).then((timeEndRes)=>{
          if (timeEndRes && timeEndRes.Time) {
            res.Time.End = window.getDateTimeInputFormat(timeEndRes.Time.End);
          }
        });
      }

      if (self.newAppointment.WholeDay) {
        var endTimeData:any = {FieldName: 'WholeDay', Data: self.newAppointment.WholeDay};
        self._baseService.patchBase(timeUrl, endTimeData).then((wholeDayRes)=>{
          if (wholeDayRes && wholeDayRes.Time) {
            res.Time.WholeDay = wholeDayRes.Time.WholeDay;
          }
        });
      }
      $("#modalAddAppointment").modal('hide');
    }
  }

  txtValidationKeyUp(event) {
    if ($(event.target).val().trim() != "")
      $(event.target).parents('.input-wrapper').removeClass('has-error');
  }

  cbkWholeDayChange() {
    if (this.newAppointment.WholeDay) {
      $(".appointment-end-ctn").removeClass('has-error');
    }
  }

  txtValueChange(event, type, fieldName, editingObject, parentObject:any = {}) {
    var self = this;
    var value:any = '';
    var boolInputFields = ['Canceled', 'Present', 'WholeDay'];
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
    if (type == 'appointment') {
      url = 'api/Appointment/' + editingObject.Soid;
    } else if (type == 'time') {
      url = 'api/Appointment/' + editingObject.Soid + '/SetTime';
    } else if (type == 'participant') {
      url = 'api/Appointment/' + parentObject.Soid + '/UpdateAppointmentParticipant/' + editingObject.Soid;
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

        var dateTimeFieldNames = ['Start', 'End'];
        if (dateTimeFieldNames.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateTimeInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
