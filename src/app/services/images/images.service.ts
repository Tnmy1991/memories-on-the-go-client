import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GetS3Object, ImageObject, ImageUploader } from '../app.model';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private readonly IMAGE_ENDPOINT =
    'https://kx2igcenr7.execute-api.us-east-1.amazonaws.com/prod/images';
  private _httpWithoutInterceptor: HttpClient;

  constructor(
    private _httpBackend: HttpBackend,
    private _httpClient: HttpClient
  ) {
    this._httpWithoutInterceptor = new HttpClient(_httpBackend);
  }

  getAllImages(): Observable<ImageObject[]> {
    return this._httpClient
      .get<{ images: ImageObject[] }>(`${this.IMAGE_ENDPOINT}/listing`)
      .pipe(map((response) => response?.images));
  }

  getSignedUrl(fileName: string): Observable<ImageUploader> {
    return this._httpClient.post<ImageUploader>(
      `${this.IMAGE_ENDPOINT}/upload`,
      { image: fileName }
    );
  }

  getS3Object(body: {
    s3_key: string;
    s3_key_thumbnail: string;
  }): Observable<GetS3Object> {
    return this._httpClient.post<GetS3Object>(
      `${this.IMAGE_ENDPOINT}/s3-presigned`,
      body
    );
  }

  putS3Object(signedUrl: string, file: File): Observable<unknown> {
    const headers = new HttpHeaders({
      'Content-Type': file.type,
    });

    return this._httpWithoutInterceptor.put(signedUrl, file, {
      headers,
      reportProgress: true,
    });
  }
}
