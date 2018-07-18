import { Pipe, PipeTransform } from "@angular/core";

const PADDING = "000000";

@Pipe({ name: "phoneNumberPipe" })
export class PhoneNumberPipe implements PipeTransform {

  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;

  constructor() {
    // TODO comes from configuration settings
    this.DECIMAL_SEPARATOR = ".";
    this.THOUSANDS_SEPARATOR = "'";
  }

  transform(value: string): string {
    value = value.replace(/[^0-9\.]+/g, '');
    value = value + '';
    var formattedValue = '';
    if (value.length > 0) {
      if (value.length > 10)
        value = value.substring(0, 10);

      for (var i = 0; i < value.length; i++) {
        if (i == 0) {
           formattedValue += '(' + value[i];
        } else if (i == 2) {
           formattedValue += value[i] + ')';
        } else if (i == 3) {
           formattedValue += ' ' + value[i];
        } else if (i == 6) {
          formattedValue += '-' + value[i];
        } else {
          formattedValue += value[i];
        }
      }
    }
    return formattedValue;
  }

  parse(value: string, fractionSize: number = 2): string {
    let [ integer, fraction = "" ] = (value || "").split(this.DECIMAL_SEPARATOR);

    integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, "g"), "");

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.DECIMAL_SEPARATOR + (fraction + PADDING).substring(0, fractionSize)
      : "";

    return integer + fraction;
  }

}
