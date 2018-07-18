import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'student-component',
  templateUrl: './student.component.html',
  styleUrls: ['../../../share/css/education-base.scss']
})

export class StudentComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  students:any = [];
  companies:any = [];
  deletingStudentObject:any;
  deletingType:any;
  deletingStudentObjectIndex:any;
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
  newStudent:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.students = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Student').then((res:any) => {
        if (res && res.ok != false) {
          self.students = res;
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

  btnRemoveStudentClick(student, index) {
    this.deletingStudentObject = student;
    this.deletingStudentObjectIndex = index;
    this.deletingType = 'student';
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    var url:any = 'api/Student/' + self.deletingStudentObject.Soid;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        return;
      } else {
        self.students.splice(self.deletingStudentObjectIndex, 1);
      }
      $(event.target).removeClass('btn-loading');
      $("#confirmation_modal").modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddStudentClick() {
    this.initNewStudent();
    $("#modalAddStudent").modal('show');
  }

  initNewStudent() {
    this.newStudent = {
      ContactName: '',
      Phone: '',
      Email: ''
    };
  }

  btnSaveStudentClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddStudent");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Student', self.newStudent).then((res:any) => {
      if (res && res.Soid) {
        self.students.push(res);
        $("#modalAddStudent").modal('hide');
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

    var url = 'api/Student/' + editingObject.Soid;
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
