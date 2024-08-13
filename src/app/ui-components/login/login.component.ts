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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ExtendedFieldComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})
export class LoginComponent implements OnInit, OnDestroy {
  isLogging = false;
  loginForm!: FormGroup;

  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(
    private _userService: UsersService,
    private _authorizeService: AuthorizeService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  requestLogin(): void {
    if (this.loginForm.valid) {
      this.isLogging = true;
      this._userService
        .login(this.loginForm.value)
        .pipe(
          takeUntil(this.unsubscribe$),
          catchError((error) => {
            this.loginForm
              .get(error.error.field)
              ?.setErrors({ invalidData: true });
            this.isLogging = false;

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
