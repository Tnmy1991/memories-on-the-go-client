import {
  LoginComponent,
  GalleryComponent,
  DialogBoxComponent,
  ImageViewerComponent,
  CreateAccountComponent,
  ActionSidebarComponent,
} from './ui-components';
import { AuthorizeService } from './services';
import { Component, OnInit } from '@angular/core';

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
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass',
})
export class AppComponent implements OnInit {
  public isLoggedIn = false;
  public isLoginVisible = false;

  constructor(private _authorize: AuthorizeService) {}

  ngOnInit(): void {
    this.isLoggedIn = this._authorize.isAuthenticated();
  }

  toggleLogin(): void {
    this.isLoginVisible = !this.isLoginVisible;
  }
}
