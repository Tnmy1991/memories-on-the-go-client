import {
  FormGroup,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { catchError, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthorizeService, UsersService } from '../../services';
import { ExtendedFieldComponent } from '../extended-field/extended-field.component';
import { LookupValidator } from '../lookup.validator';
import { ConfirmPasswordValidator } from '../password.validator';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [ReactiveFormsModule, ExtendedFieldComponent],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.sass',
})
export class CreateAccountComponent implements OnInit, OnDestroy {
  isReqesting = false;
  createAccoutnForm!: FormGroup;

  private readonly unsubscribe$: Subject<void> = new Subject();
  private readonly StrongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{6,}$/;

  constructor(
    private _userService: UsersService,
    private _authorizeService: AuthorizeService
  ) {}

  ngOnInit(): void {
    this.createAccoutnForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(6)]),
      phone_number: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.pattern('^[0-9]{5}[ 0-9]{6}$'),
        ],
        [LookupValidator.validatePhonenumber(this._userService)]
      ),
      username: new FormControl(
        '',
        [Validators.required, Validators.minLength(6)],
        [LookupValidator.validateUsername(this._userService)]
      ),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.StrongPasswordRegx),
        ConfirmPasswordValidator.validate('confirm_password', true),
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        ConfirmPasswordValidator.validate('password'),
      ]),
    });
  }

  createAccount(): void {
    if (this.createAccoutnForm.valid) {
      this.isReqesting = true;
      this._userService
        .createAccount(this.createAccoutnForm.value)
        .pipe(
          takeUntil(this.unsubscribe$),
          catchError((error) => {
            this.isReqesting = false;

            throw error;
          })
        )
        .subscribe((response) => {
          this._authorizeService.setBearerToken(response.access_token);
          location.reload();
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
