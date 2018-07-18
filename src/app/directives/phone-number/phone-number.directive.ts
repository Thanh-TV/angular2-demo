import { Directive, HostListener, ElementRef, OnInit } from "@angular/core";
import { PhoneNumberPipe } from "../../pipes/phone-number/phone-number.pipe";

@Directive({ selector: "[phoneNumberFormatter]" })
export class PhoneNumberFormatterDirective implements OnInit {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    private phoneNumberPipe: PhoneNumberPipe
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    var self = this;
    setTimeout(function(){
      self.el.value = self.phoneNumberPipe.transform(self.el.value);
    }, 500);
  }

  @HostListener("keypress", ["$event", "$event.target.value"])
  onKeyPress(evt, value) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) || (this.el.value + '').length > 13) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  @HostListener("keyup", ["$event", "$event.target.value"])
  onKeyUp(evt, value) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    if ((key >= 48 && key <= 57) || (key >= 96 && key <= 105)) {
      this.el.value = this.phoneNumberPipe.transform(value);
    }
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    this.el.value = this.phoneNumberPipe.transform(value);
  }

}
