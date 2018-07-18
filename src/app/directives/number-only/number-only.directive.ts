import { Directive, HostListener, ElementRef, OnInit } from "@angular/core";

@Directive({ selector: "[numberOnlyFormatter]" })
export class NumberOnlyFormatterDirective implements OnInit {

  private el: HTMLInputElement;

  constructor( private elementRef: ElementRef ) {}

  ngOnInit() {
  }

  @HostListener("keypress", ["$event", "$event.target.value"])
  onKeyPress(evt, value) {
    var theEvent = evt || window.event;
    var key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    var regex = /[0-9]|\./;
    if( !regex.test(key) ) {
      theEvent.returnValue = false;
      if(theEvent.preventDefault) theEvent.preventDefault();
    }
  }

}
