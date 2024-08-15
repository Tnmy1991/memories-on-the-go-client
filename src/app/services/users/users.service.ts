import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LookupPayload,
  CreateAccountPayload,
  LoginPayload,
  LoginResponse,
} from '../app.model';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private USER_ENDPOINT = '';
  private httpWithoutInterceptor: HttpClient;

  constructor(
    private _httpBackend: HttpBackend,
    private _configService: ConfigService
  ) {
    this.USER_ENDPOINT = this._configService.getConfigService('USER_ENDPOINT');
    this.httpWithoutInterceptor = new HttpClient(_httpBackend);
  }

  performLookup(body: LookupPayload): Observable<{ lookupFlag: boolean }> {
    return this.httpWithoutInterceptor.post<{ lookupFlag: boolean }>(
      `${this.USER_ENDPOINT}users/lookup`,
      body
    );
  }

  createAccount(body: CreateAccountPayload): Observable<LoginResponse> {
    return this.httpWithoutInterceptor.post<LoginResponse>(
      `${this.USER_ENDPOINT}users/create-account`,
      body
    );
  }

  login(body: LoginPayload): Observable<LoginResponse> {
    return this.httpWithoutInterceptor.post<LoginResponse>(
      `${this.USER_ENDPOINT}users/login`,
      body
    );
  }
}
