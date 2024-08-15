import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GetS3Object, ImageObject, ImageUploader } from '../app.model';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  private IMAGE_ENDPOINT = '';
  private _httpWithoutInterceptor: HttpClient;

  constructor(
    private _configService: ConfigService,
    private _httpBackend: HttpBackend,
    private _httpClient: HttpClient
  ) {
    this.IMAGE_ENDPOINT =
      this._configService.getConfigService('IMAGE_ENDPOINT');
    this._httpWithoutInterceptor = new HttpClient(_httpBackend);
  }

  getAllImages(): Observable<ImageObject[]> {
    return this._httpClient
      .get<{ images: ImageObject[] }>(`${this.IMAGE_ENDPOINT}images/listing`)
      .pipe(map((response) => response?.images));
  }

  getSignedUrl(fileName: string): Observable<ImageUploader> {
    return this._httpClient.post<ImageUploader>(
      `${this.IMAGE_ENDPOINT}images/upload`,
      { image: fileName }
    );
  }

  getS3Object(body: {
    s3_key: string;
    s3_key_thumbnail: string;
  }): Observable<GetS3Object> {
    return this._httpClient.post<GetS3Object>(
      `${this.IMAGE_ENDPOINT}images/s3-presigned`,
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
