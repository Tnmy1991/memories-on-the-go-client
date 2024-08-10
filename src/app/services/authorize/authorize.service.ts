import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, of } from 'rxjs';

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
    return sessionStorage.getItem(this.KEY) ?? '';
  }

  getDecodedToken(): { name: string; user_id: string } {
    const bearerToken = sessionStorage.getItem(this.KEY) ?? '';
    return (
      this._jwtHelper.decodeToken(bearerToken) ?? { name: '', user_id: '' }
    );
  }

  isAuthenticated(): Observable<boolean> {
    const bearerToken = sessionStorage.getItem(this.KEY);
    return of(!this._jwtHelper.isTokenExpired(bearerToken));
  }

  logout(): Observable<boolean> {
    try {
      sessionStorage.removeItem(this.KEY);
      return of(true);
    } catch (e) {
      console.error(e);
      return of(false);
    }
  }

  getIdentity(): string {
    const decoded = this.getDecodedToken();
    return decoded.user_id;
  }

  getName(): string {
    const decoded = this.getDecodedToken();
    return decoded.name;
  }
}
