import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService} from '../../services/base.service';

declare var $:any;

@Component({
  selector: 'validation-component',
  templateUrl: './validation.component.html',
  providers: [BaseService]
})

export class ValidationComponent implements OnInit {
  errorMessage:any = '';
  token:any = '';

  constructor(private _router: Router, private _baseService: BaseService){}

  ngOnInit(){
  }

  btnSubmitClick() {
    var self = this;
    if (self.token.trim() == '') {
      self.errorMessage = 'Please enter the token.';
      return;
    }
    self._baseService.getBase('').then((res:any)=>{
      self._router.navigate(['/reset-password']);
    });
  }

  txtTokenKeyUp() {
    if (this.token.trim() != '') {
      this.errorMessage = '';
    }
  }
}
