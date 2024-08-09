import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LookupPayload,
  CreateAccountPayload,
  LoginPayload,
  LoginResponse,
} from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly USER_ENDPOINT =
    'https://jl2j5nkkda.execute-api.us-east-1.amazonaws.com/prod/users';
  private httpWithoutInterceptor: HttpClient;

  constructor(private _httpBackend: HttpBackend) {
    this.httpWithoutInterceptor = new HttpClient(_httpBackend);
  }

  performLookup(body: LookupPayload): Observable<{ lookupFlag: boolean }> {
    return this.httpWithoutInterceptor.post<{ lookupFlag: boolean }>(
      `${this.USER_ENDPOINT}/lookup`,
      body
    );
  }

  createAccount(body: CreateAccountPayload): Observable<LoginResponse> {
    return this.httpWithoutInterceptor.post<LoginResponse>(
      `${this.USER_ENDPOINT}/create-account`,
      body
    );
  }

  login(body: LoginPayload): Observable<LoginResponse> {
    return this.httpWithoutInterceptor.post<LoginResponse>(
      `${this.USER_ENDPOINT}/login`,
      body
    );
  }
}
