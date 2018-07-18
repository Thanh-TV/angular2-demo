import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'instructor-component',
  templateUrl: './instructor.component.html',
  styleUrls: ['../../../share/css/education-base.scss']
})

export class InstructorComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  instructors:any = [];
  companies:any = [];
  deletingInstructorObject:any;
  deletingType:any;
  deletingInstructorObjectIndex:any;
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
  newInstructor:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.instructors = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Instructor').then((res:any) => {
        if (res && res.ok != false) {
          self.instructors = res;
        }
        self.isLoading = false;
      });
      self._baseService.getBase('api/Company').then((res:any) => {
        if (res && res.ok != false) {
          self.companies = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  btnRemoveInstructorClick(instructor, index) {
    this.deletingInstructorObject = instructor;
    this.deletingInstructorObjectIndex = index;
    this.deletingType = 'instructor';
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    var url:any = 'api/Instructor/' + self.deletingInstructorObject.Soid;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        return;
      } else {
        self.instructors.splice(self.deletingInstructorObjectIndex, 1);
      }
      $(event.target).removeClass('btn-loading');
      $("#confirmation_modal").modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddInstructorClick() {
    this.initNewInstructor();
    $("#modalAddInstructor").modal('show');
  }

  initNewInstructor() {
    this.newInstructor = {
      NameFirst: '',
      NameLast: '',
      Title: '',
      PhoneNumber: '',
      EmailAddress: ''
    };
  }

  btnSaveInstructorClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddInstructor");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Instructor', self.newInstructor).then((res:any) => {
      if (res && res.Soid) {
        self.instructors.push(res);
        $("#modalAddInstructor").modal('hide');
      } else {
        $(event.target).removeClass('btn-loading');
        window.showError();
      }
      $(event.target).removeClass('btn-loading');
    });
  }

  txtValueChange(event, type, fieldName, editingObject) {
    var self = this;
    var value:any = '';
    var boolInputFields = ['IsAdmin', 'Active'];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    var url = 'api/Instructor/' + editingObject.Soid;
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
        var dateInputs:any = [];
        if (dateInputs.indexOf(fieldName) >= 0 && !isNaN(Date.parse(res.Value))) {
          res.Value = window.getDateInputFormat(res.Value);
        }
        $(event.target).val(res.Value);
      }
    });
  }
}
