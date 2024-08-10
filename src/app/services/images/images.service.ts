import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageObject } from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private readonly IMAGE_ENDPOINT =
    'https://kx2igcenr7.execute-api.us-east-1.amazonaws.com/prod/images';

  constructor(private _httpClient: HttpClient) {}

  getAllImages(): Observable<ImageObject[]> {
    return this._httpClient.get<ImageObject[]>(
      `${this.IMAGE_ENDPOINT}/listing`
    );
  }
}
