import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  Optional,
} from '@angular/core';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { mergeMap, Observable, of, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-extended-field',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './extended-field.component.html',
  styleUrl: './extended-field.component.sass',
})
export class ExtendedFieldComponent implements AfterViewInit {
  @Input() label = '';
  @Input() fieldName = '';
  @Input() isRequired = false;
  @Input() errors!: { [key: string]: string };

  error$?: Observable<string>;

  private _formGroup!: FormGroup;
  private _formControl!: FormControl;

  constructor(
    private _cd: ChangeDetectorRef,
    @Optional() private _controlContainer: ControlContainer
  ) {}

  ngAfterViewInit(): void {
    if (this._controlContainer && this.fieldName) {
      this._formGroup = <FormGroup>this._controlContainer?.control;
      this._formControl = <FormControl>this._formGroup.controls[this.fieldName];

      if (this._formControl) {
        this.error$ = this._formControl?.statusChanges.pipe(
          startWith(this._formControl.status),
          mergeMap((_status, _index) => {
            let error = '';
            if (this.errors) {
              Object.keys(this.errors).forEach((key) => {
                if (this._formControl.errors && this._formControl.errors[key]) {
                  error = this.errors[key];
                }
              });
            }
            return of(error);
          })
        );
      }
    }

    this._cd.detectChanges();
  }

  get showError(): boolean {
    if (this._formControl) {
      return this._formControl.touched || this._formControl.dirty;
    }

    return true;
  }
}
