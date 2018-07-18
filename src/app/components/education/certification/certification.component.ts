import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../../services/base.service';

declare var $:any;
declare var window:any;

@Component({
  selector: 'certification-component',
  templateUrl: './certification.component.html',
  styleUrls: ['../../../share/css/education-base.scss']
})

export class CertificationComponent implements OnInit {
  isLoading:any = false;
  userInfo:any;
  certifications:any = [];
  courses:any = [];
  deletingCertificationObject:any;
  deletingCertificationCourseObject:any;
  deletingType:any;
  deletingCertificationObjectIndex:any;
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
  newCertification:any = {};

  constructor(private _router: Router,  private _baseService: BaseService){

  }

  ngOnInit(){
    var self = this;
    self.certifications = [];
    var userInfo = sessionStorage.getItem('UserInfo');
    if (userInfo && userInfo != 'undefined' && userInfo != 'null'){
      self.userInfo = JSON.parse(userInfo);
      self.isLoading = true;
      self._baseService.getBase('api/Certification').then((res:any) => {
        if (res && res.ok != false) {
          self.certifications = res;
          $.each(self.certifications, function(idx, certification){
            self.prepareCertificationValues(certification);
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

  prepareCertificationValues (certification, type:any = undefined) {
    if ((!type || type=='course') && certification.Courses) {
      $.each(certification.Courses, function(idx2, course){
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

  btnRemoveCertificationClick(certification, index) {
    this.deletingCertificationObject = certification;
    this.deletingCertificationObjectIndex = index;
    this.deletingType = 'certification';
    $("#confirmation_modal").modal('show');
  }

  btnConfirmDeletingClick(event) {
    var self = this;
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    var url:any = 'api/Certification/' + self.deletingCertificationObject.Soid;
    self._baseService.deleteBase(url).then((res)=>{
      if (res && res.ok == false) {
        return;
      } else {
        self.certifications.splice(self.deletingCertificationObjectIndex, 1);
      }
      $(event.target).removeClass('btn-loading');
      $("#confirmation_modal").modal('hide');
    });
  }

  btnConfirmCancelingClick() {
    $("#confirmation_modal").modal('hide');
  }

  btnAddCertificationClick() {
    this.initNewCertification();
    $("#modalAddCertification").modal('show');
  }

  initNewCertification() {
    this.newCertification = {
      ContactName: '',
      Phone: '',
      Email: ''
    };
  }

  btnSaveCertificationClick(event) {
    var self = this;
    // Validation
    var invalid:any = window.validateForm(event, "modalAddCertification");
    if (invalid) {
      return;
    }
    if ($(event.target).attr('class').indexOf('btn-loading') >= 0) {
      return;
    }
    $(event.target).addClass('btn-loading');
    self._baseService.postBase('api/Certification', self.newCertification).then((res:any) => {
      if (res && res.Soid) {
        self.certifications.push(res);
        $("#modalAddCertification").modal('hide');
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

    var url = 'api/Certification/' + editingObject.Soid;
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
