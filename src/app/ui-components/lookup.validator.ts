import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UsersService } from '../services';

export class LookupValidator {
  static validateUsername(userService: UsersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return userService
        .performLookup({
          key: 'username',
          value: control.value.replace(/ /g, ''),
        })
        .pipe(
          map((result) => (result.lookupFlag ? { usernameExists: true } : null))
        );
    };
  }

  static validatePhonenumber(userService: UsersService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return userService
        .performLookup({
          key: 'phone_number',
          value: control.value.replace(/ /g, ''),
        })
        .pipe(
          map((result) =>
            result.lookupFlag ? { phonenumberExists: true } : null
          )
        );
    };
  }
}
