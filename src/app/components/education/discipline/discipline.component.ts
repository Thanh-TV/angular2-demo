import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'discipline-component',
  templateUrl: './discipline.component.html',
  styleUrls: ['../../share/css/education-base.scss']
})

export class DisciplineComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  disciplines:any = [];
  courses:any = [];
  deletingDisciplineObject:any;
  deletingDisciplineCourseObject:any;
  deletingType:any;
  deletingDisciplineObjectIndex:any;
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
  newDiscipline:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.disciplines = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Discipline').then((res:any) => {
        if (res && res.ok != false) {
          self.disciplines = res;
          $.each(self.disciplines, function(idx, discipline){
            self.prepareDisciplineValues(discipline);
          });
        }
        self.isLoading = false;
        self.initScrollBar();
      });
      self._baseService.getBase('api/Course').then((res:any) => {
        if (res && res.ok != false) {
          self.courses = res;
        }
      });
    } else {
      self._router.navigate(['/login']);
    }
  }

  prepareDisciplineValues (discipline, type:any = undefined) {
    if ((!type || type=='course') && discipline.Courses) {
      $.each(discipline.Courses, function(idx2, course){
        if (course.AddedOn) {
          course.AddedOn = window.getDateInputFormat(course.AddedOn);
        }
      });
    }
  }

  initScrollBar() {
    var self = this;
    setTimeout(function(){
      window.initScrollBar();
    }, 500);
  }

  btnRemoveDisciplineClick(discipline, index) {
    this.deletingDisciplineObject = discipline;
    this.deletingDisciplineObjectIndex = index;
    this.deletingType = 'discipline';
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Discipline/' + self.deletingDisciplineObject.Soid;
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        return;
      } else {
        self.disciplines.splice(self.deletingDisciplineObjectIndex, 1);
      }
      $(event.target).removeClass('btn-loading');
      $("#confirmation_modal").modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddDisciplineClick() {
    this.initNewDiscipline();
    $("#modalAddDiscipline").modal('show');
  }

  initNewDiscipline() {
    this.newDiscipline = {
      Name: ''
    };
  }

  btnSaveDisciplineClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddDiscipline");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Discipline', self.newDiscipline).then((res:any) => {
      if (res && res.Soid) {
        self.disciplines.push(res);
        $("#modalAddDiscipline").modal('hide');
        self.initScrollBar();
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
    var boolInputFields = ['Active'];
    if (boolInputFields.indexOf(fieldName) >= 0) {
      value = $(event.target).prop('checked');
    } else {
      value = $(event.target).val().trim();
    }

    var data = {
      FieldName: fieldName,
      Data: value
    };

    var url = 'api/Discipline/' + editingObject.Soid;
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
