import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    return value.endsWith('@gmail.com') || value.endsWith('@hotmail.com') ? null : { gmail: true };
  };
}