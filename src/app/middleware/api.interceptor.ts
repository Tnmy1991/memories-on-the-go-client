import { inject } from '@angular/core';
import { AuthorizeService } from '../services';
import { HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function ApiInterceptor(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const authToken = inject(AuthorizeService).getBearerToken();

  // Clone the request to add the authentication header.
  const newRequset = request.clone({
    setHeaders: {
      Authorization: `Bearer ${authToken}`,
    },
  });
  return next(newRequset);
}
