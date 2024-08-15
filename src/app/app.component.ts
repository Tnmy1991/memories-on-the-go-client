import {
  LoginComponent,
  GalleryComponent,
  DialogBoxComponent,
  ImageViewerComponent,
  CreateAccountComponent,
  ActionSidebarComponent,
  ExtendedFieldComponent,
} from './ui-components';
import { Subject, takeUntil } from 'rxjs';
import { AuthorizeService } from './services';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoginComponent,
    GalleryComponent,
    DialogBoxComponent,
    ImageViewerComponent,
    CreateAccountComponent,
    ActionSidebarComponent,
    ExtendedFieldComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit, OnDestroy {
  public isLoggedIn = false;
  public isLoginVisible = false;
  public isSignupVisible = false;

  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private _authorize: AuthorizeService) {}

  ngOnInit(): void {
    this._authorize
      .isAuthenticated()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((response) => {
        this.isLoggedIn = response;
      });
  }

  toggleLogin(): void {
    this.isSignupVisible = false;
    this.isLoginVisible = !this.isLoginVisible;
  }

  toggleCreateAccount(): void {
    this.isLoginVisible = false;
    this.isSignupVisible = !this.isSignupVisible;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
