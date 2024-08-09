import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  private readonly KEY = 'bearer_token';

  constructor(private _jwtHelper: JwtHelperService) {}

  setBearerToken(token: string): void {
    sessionStorage.setItem(this.KEY, token);
  }

  getBearerToken(): string {
    const token = sessionStorage.getItem(this.KEY) ?? '';
    return this.isAuthenticated() ? token : '';
  }

  getDecodedToken(): { name: string; user_id: string } {
    const bearerToken = sessionStorage.getItem(this.KEY) ?? '';
    return (
      this._jwtHelper.decodeToken(bearerToken) ?? { name: '', user_id: '' }
    );
  }

  isAuthenticated(): boolean {
    const bearerToken = sessionStorage.getItem(this.KEY);
    const isActive = !this._jwtHelper.isTokenExpired(bearerToken);
    return isActive;
  }

  getIdentity(): string {
    if (this.isAuthenticated()) {
      const decoded = this.getDecodedToken();
      return decoded.user_id;
    }

    return '';
  }

  getName(): string {
    if (this.isAuthenticated()) {
      const decoded = this.getDecodedToken();
      return decoded.name;
    }

    return '';
  }
}
