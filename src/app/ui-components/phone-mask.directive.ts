import { Directive, HostListener } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Directive({
  standalone: true,
  selector: '[appPhoneMask]',
})
export class PhoneMaskDirective {
  constructor(public _controlContainer: ControlContainer) {}

  @HostListener('input', ['$event'])
  onModelChange(event: any) {
    this.onInputChange(event, false);
  }

  @HostListener('keydown.backspace', ['$event'])
  keydownBackspace(event: { target: { value: any } }) {
    this.onInputChange(event.target.value, true);
  }

  onInputChange(event: string, backspace: boolean) {
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length === 5) {
      newVal = newVal.replace(/^(\d{0,5})/, '$1');
    } else if (newVal.length === 10) {
      newVal = newVal.replace(/^(\d{0,5})(\d{0,5})/, '$1 $2');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,5})(\d{0,5})/, '$1 $2');
    }
    const formGroup = <FormGroup>this._controlContainer?.control;
    formGroup.controls['phone_number'].setValue(newVal);
  }
}
