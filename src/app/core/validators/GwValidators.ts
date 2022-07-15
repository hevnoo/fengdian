import { AbstractControl, ValidationErrors } from "@angular/forms";
export class GwValidators {
  static verifyUrl(control: AbstractControl): ValidationErrors | null {
    const regularText = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    if (regularText.test(control.value)) {
      return null;
    }
    return {
      verifyUrl: true,
    };
  }

  static verifyPhone(control: AbstractControl): ValidationErrors | null {
    const regularText = /^1(3\d|4[5-8]|5[0-35-9]|6[567]|7[01345-8]|8\d|9[025-9])\d{8}$/;
    if (regularText.test(control.value)) {
      return null;
    }
    return {
      verifyPhone: true,
    };
  }
}
